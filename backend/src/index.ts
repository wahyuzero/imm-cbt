import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth.js";
import { runMigrations } from "./db/migrate.js";
import { runSeeder } from "./db/seed.js";
import { client } from "./db/index.js";
import { authRouter } from "./routes/auth.js";
import { chaptersRouter } from "./routes/chapters.js";
import { examRouter } from "./routes/exam.js";
import { vocabularyRouter } from "./routes/vocabulary.js";
import { adminRouter } from "./routes/admin.js";
import { authRateLimiter, examSubmitRateLimiter } from "./middlewares/rateLimiter.js";
import { AppEnv } from "./types.js";

const app = new Hono<AppEnv>();

// Logger
app.use("*", logger());

// Whitelist CORS ketat: Hanya domain resmi dan local host/IP development
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/imm\.frugaldev\.biz\.id$/,
  /^http:\/\/imm\.frugaldev\.biz\.id$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function isOriginAllowed(origin?: string): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

// CORS configuration dengan whitelist ketat
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (isOriginAllowed(origin)) {
        return origin;
      }
      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 86400,
  })
);

// Rate Limiter pada endpoint autentikasi & submit exam
app.use("/api/auth/*", authRateLimiter);
app.use("/api/v1/auth/*", authRateLimiter);
app.use("/api/v1/exam/submit", examSubmitRateLimiter);

// Health check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "imm-cbt-api",
    time: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Better Auth Official Handler
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// API v1 Routes
app.route("/api/v1", authRouter);
app.route("/api/v1", chaptersRouter);
app.route("/api/v1", examRouter);
app.route("/api/v1", vocabularyRouter);
app.route("/api/v1", adminRouter);

// Global Error Handler
app.onError((err, c) => {
  console.error("Unhandled Error:", err);
  return c.json({ success: false, error: err.message || "Internal Server Error" }, 500);
});

// 404 Handler
app.notFound((c) => {
  return c.json({ success: false, error: `Route not found: ${c.req.method} ${c.req.url}` }, 404);
});

const port = Number(process.env.PORT) || 3000;

async function bootstrap() {
  console.log("Initializing IMM CBT Backend...");
  try {
    if (process.env.AUTO_MIGRATE !== "false") {
      console.log("Running auto-migration...");
      await runMigrations();

      // BUG-14: seeding penuh hanya dijalankan bila database belum berisi user
      // sama sekali (bootstrap pertama / user terhapus semua) ATAU env
      // SEED_ON_BOOT=true — restart biasa tidak lagi menjalankan seeder agar
      // konfigurasi user buatan sensei tidak tertimpa. Migrasi tetap mengikuti
      // flag AUTO_MIGRATE di atas.
      const seedOnBoot = process.env.SEED_ON_BOOT === "true";
      let databaseEmpty = true;
      let hasAdmin = false;
      try {
        const existingUsers = await client`SELECT 1 FROM "user" LIMIT 1`;
        databaseEmpty = existingUsers.length === 0;
        // RESIDUAL BUG-14: database berisi user tetapi NOL admin (mis. admin dihapus
        // semua) juga harus memicu seeder — bootstrap admin non-destruktif
        // (ON CONFLICT DO NOTHING), bukan hanya saat database kosong total.
        const admins = await client`SELECT 1 FROM "user" WHERE "role" = 'admin' LIMIT 1`;
        hasAdmin = admins.length > 0;
      } catch {
        databaseEmpty = true;
      }

      if (seedOnBoot || databaseEmpty || !hasAdmin) {
        console.log("Running auto-seeder...");
        await runSeeder();
      } else {
        console.log("Skipping auto-seeder (database sudah berisi user; set SEED_ON_BOOT=true untuk paksa seed ulang).");
      }
    }
  } catch (err) {
    console.error("Bootstrap migration/seed error (continuing startup):", err);
  }

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`IMM CBT API Server listening on http://0.0.0.0:${info.port}`);
    }
  );
}

bootstrap();

export default app;

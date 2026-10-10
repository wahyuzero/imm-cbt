import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth.js";
import { runMigrations } from "./db/migrate.js";
import { runSeeder } from "./db/seed.js";
import { authRouter } from "./routes/auth.js";
import { chaptersRouter } from "./routes/chapters.js";
import { examRouter } from "./routes/exam.js";
import { vocabularyRouter } from "./routes/vocabulary.js";
import { adminRouter } from "./routes/admin.js";
import { AppEnv } from "./types.js";

const app = new Hono<AppEnv>();

// Logger
app.use("*", logger());

// CORS configuration
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow localhost, domain, or any internal proxy
      return origin || "*";
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 86400,
  })
);

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
      console.log("Running auto-seeder...");
      await runSeeder();
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

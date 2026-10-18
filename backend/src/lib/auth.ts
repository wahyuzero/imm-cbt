import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, admin } from "better-auth/plugins";
import { randomBytes } from "crypto";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";

// BUG-04: rahasia auth tidak boleh punya fallback konstanta publik.
// Produksi wajib menyediakan BETTER_AUTH_SECRET. Fallback dev kini EPHEMERAL
// (random per-proses, RESIDUAL BUG-04) — deploy tanpa NODE_ENV=production dan
// tanpa secret tidak lagi mendapat cookie bertanda-tangan konstanta publik yang
// bisa dipalsukan; hanya session-nya yang tidak survive restart.
let authSecret = process.env.BETTER_AUTH_SECRET;
if (!authSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: BETTER_AUTH_SECRET wajib diisi di produksi. Generate secret baru (mis. `openssl rand -base64 32`) dan set environment variable ini sebelum server dijalankan."
    );
  }
  authSecret = randomBytes(32).toString("base64");
  console.warn(
    "[PERINGATAN KEAMANAN] BETTER_AUTH_SECRET tidak di-set — memakai secret dev EPHEMERAL acak (session tidak survive restart, tetapi cookie tidak bisa dipalsukan pihak luar). Jangan pernah gunakan di produksi."
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  // BUG-10: aktifkan rate limit Better Auth untuk mencegah brute force.
  rateLimit: {
    enabled: true,
    window: 60, // detik
    max: 60,
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
    admin({
      defaultRole: "student",
      adminRole: "admin",
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "imm-google-dummy-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "imm-google-dummy-secret",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "student" },
      className: { type: "string", required: false },
      pdfAccessAllowed: { type: "boolean", defaultValue: false, required: false }, // BUG-13a: default-deny sesuai komentar schema "Hanya Sensei"
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:9334",
    "http://127.0.0.1:9334",
    "https://imm.frugaldev.biz.id",
    "http://imm.frugaldev.biz.id",
  ],
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL || "https://imm.frugaldev.biz.id",
});

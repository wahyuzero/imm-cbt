import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, admin } from "better-auth/plugins";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";

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
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:5173",
    "https://imm.frugaldev.biz.id",
    "http://imm.frugaldev.biz.id",
  ],
  secret: process.env.BETTER_AUTH_SECRET || "imm_cbt_secret_key_super_secure_auth_token_2026",
  baseURL: process.env.BETTER_AUTH_URL || "https://imm.frugaldev.biz.id",
});

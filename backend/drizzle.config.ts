import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://imm_admin:imm_cbt_secure_pass_2026_db@localhost:5432/imm_cbt",
  },
});

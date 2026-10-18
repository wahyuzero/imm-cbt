import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import dotenv from "dotenv";

dotenv.config();

// BUG-04: kredensial produksi tidak boleh jadi fallback yang ter-commit di repo.
// Produksi wajib DATABASE_URL; dev boleh fallback localhost generik tanpa kredensial nyata.
function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url && url.trim().length > 0) {
    return url;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: DATABASE_URL wajib diisi di produksi. Set environment variable DATABASE_URL dengan kredensial database yang valid sebelum server dijalankan."
    );
  }
  console.warn(
    "[PERINGATAN] DATABASE_URL tidak di-set — memakai koneksi dev localhost generik."
  );
  return "postgres://postgres:postgres@localhost:5432/imm_cbt";
}

const connectionString = resolveDatabaseUrl();

export const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

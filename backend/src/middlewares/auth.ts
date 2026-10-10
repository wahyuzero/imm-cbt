import { createMiddleware } from "hono/factory";
import { auth } from "../lib/auth.js";
import { db } from "../db/index.js";
import { systemSettings } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { AppEnv } from "../types.js";

// 1. Guard Autentikasi Pengguna
export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ success: false, error: "Sesi tidak valid atau telah kedaluwarsa." }, 401);
  }
  c.set("user", session.user as any);
  c.set("session", session.session as any);
  await next();
});

// 2. Guard Akses Khusus Admin / Sensei
export const adminGuard = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.json({ success: false, error: "Akses ditolak: Hanya Sensei/Admin yang diizinkan." }, 403);
  }
  await next();
});

// 3. Guard Kontrol Pendaftaran Mandiri Siswa
export const registrationGuard = createMiddleware<AppEnv>(async (c, next) => {
  // Jika pemanggil adalah Admin yang sedang login, pembuatan user selalu diizinkan
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session && (session.user as any).role === "admin") {
    return await next();
  }

  const settings = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.id, "default"),
  });

  if (settings && !settings.allowRegistration) {
    return c.json(
      {
        success: false,
        error: "Pendaftaran mandiri siswa sedang dinonaktifkan oleh Sensei. Hubungi pengawas untuk didaftarkan.",
      },
      403
    );
  }
  await next();
});

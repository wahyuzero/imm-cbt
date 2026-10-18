import { Hono } from "hono";
import { registrationGuard, authMiddleware } from "../middlewares/auth.js";
import { db } from "../db/index.js";
import { user, account, systemSettings } from "../db/schema.js";
import { eq, or } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import crypto from "crypto";
import { AppEnv } from "../types.js";

export const authRouter = new Hono<AppEnv>();

// BUG-11: sanitasi field tampilan — buang kurung siku, kutip ganda/tunggal,
// backtick, dan karakter kontrol agar tidak bisa menjadi vektor stored XSS di panel admin.
// RESIDUAL BUG-11: diekspor agar route admin (/admin/users) memakai sanitasi identik.
export function sanitizeDisplayName(value: string): string {
  return value
    .replace(/[<>"'`]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
}

// Public system status
authRouter.get("/system/status", async (c) => {
  const settings = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.id, "default"),
  });
  return c.json({
    success: true,
    data: settings || {
      allowRegistration: true,
      globalExamLock: false,
      announcement: "Selamat datang di Platform CBT IMM Japan!",
    },
  });
});

// Current user profile
authRouter.get("/auth/me", authMiddleware, async (c) => {
  const currentUser = c.get("user");
  const currentSession = c.get("session");
  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, currentUser.id),
  });
  return c.json({
    success: true,
    data: {
      user: {
        ...currentUser,
        pdfAccessAllowed: dbUser ? dbUser.pdfAccessAllowed : true,
      },
      session: currentSession,
    },
  });
});

// Student self-registration (protected by registrationGuard)
authRouter.post("/auth/register-student", registrationGuard, async (c) => {
  try {
    const body = await c.req.json();
    const { name, username: rawUsername, pin, className: rawClassName, email: rawEmail } = body;

    if (!name || !rawUsername || !pin) {
      return c.json({ success: false, error: "Nama, username, dan PIN wajib diisi." }, 400);
    }

    // BUG-11: validasi + sanitasi ketat per field sebelum disimpan ke database.
    const nameClean = sanitizeDisplayName(String(name));
    if (nameClean.length < 1 || nameClean.length > 60) {
      return c.json(
        { success: false, error: "Nama harus 1-60 karakter dan tidak boleh hanya berisi karakter tidak valid." },
        400
      );
    }

    const usernameClean = String(rawUsername).trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,30}$/.test(usernameClean)) {
      return c.json(
        { success: false, error: "Username hanya boleh berisi huruf, angka, titik, underscore, dan hyphen, dengan panjang 3-30 karakter." },
        400
      );
    }

    // BUG-22b: PIN wajib tepat 6 digit angka.
    if (!/^\d{6}$/.test(String(pin))) {
      return c.json(
        { success: false, error: "PIN harus tepat 6 digit angka." },
        400
      );
    }

    let classNameClean = "Angkatan 35-A";
    if (rawClassName !== undefined && rawClassName !== null && String(rawClassName).trim().length > 0) {
      classNameClean = sanitizeDisplayName(String(rawClassName));
      if (classNameClean.length > 40) {
        return c.json(
          { success: false, error: "Nama kelas maksimal 40 karakter." },
          400
        );
      }
    }

    const emailClean = rawEmail && String(rawEmail).trim().length > 0
      ? String(rawEmail).trim().toLowerCase()
      : `${usernameClean}@imm.internal`;

    // Check if user already exists
    const existing = await db.query.user.findFirst({
      where: or(eq(user.username, usernameClean), eq(user.email, emailClean)),
    });

    if (existing) {
      return c.json(
        {
          success: false,
          error: existing.username === usernameClean
            ? "Username sudah terdaftar. Silakan gunakan username lain atau login."
            : "Email sudah terdaftar.",
        },
        409
      );
    }

    const userId = "usr_" + crypto.randomUUID();
    const accountId = "acc_" + crypto.randomUUID();
    const hashedPassword = await hashPassword(String(pin));

    const [newUser] = await db.insert(user).values({
      id: userId,
      name: nameClean,
      username: usernameClean,
      displayUsername: usernameClean,
      email: emailClean,
      emailVerified: true,
      role: "student",
      className: classNameClean,
      banned: false,
    }).returning();

    await db.insert(account).values({
      id: accountId,
      userId: userId,
      accountId: userId,
      providerId: "credential",
      password: hashedPassword,
    });

    return c.json({
      success: true,
      message: "Pendaftaran berhasil! Silakan login dengan username dan PIN Anda.",
      data: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        className: newUser.className,
      },
    }, 201);
  } catch (err: any) {
    console.error("Register student error:", err);
    return c.json({ success: false, error: err.message || "Gagal mendaftarkan siswa." }, 500);
  }
});

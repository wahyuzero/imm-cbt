import { Hono } from "hono";
import { registrationGuard, authMiddleware } from "../middlewares/auth.js";
import { db } from "../db/index.js";
import { user, account, systemSettings } from "../db/schema.js";
import { eq, or } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import crypto from "crypto";
import { AppEnv } from "../types.js";

export const authRouter = new Hono<AppEnv>();

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
  return c.json({
    success: true,
    data: {
      user: currentUser,
      session: currentSession,
    },
  });
});

// Student self-registration (protected by registrationGuard)
authRouter.post("/auth/register-student", registrationGuard, async (c) => {
  try {
    const body = await c.req.json();
    const { name, username: rawUsername, pin, className, email: rawEmail } = body;

    if (!name || !rawUsername || !pin) {
      return c.json({ success: false, error: "Nama, username, dan PIN wajib diisi." }, 400);
    }

    const usernameClean = String(rawUsername).trim().toLowerCase();
    if (usernameClean.length < 3 || usernameClean.length > 30) {
      return c.json({ success: false, error: "Username harus 3-30 karakter." }, 400);
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
      name: String(name).trim(),
      username: usernameClean,
      displayUsername: usernameClean,
      email: emailClean,
      emailVerified: true,
      role: "student",
      className: className ? String(className).trim() : "Angkatan 35-A",
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

import { Hono } from "hono";
import { authMiddleware, adminGuard } from "../middlewares/auth.js";
import { db } from "../db/index.js";
import {
  user,
  session,
  account,
  systemSettings,
  chapters,
  questions,
  examSessions,
  examAnswers,
  userChapterAccess,
} from "../db/schema.js";
import { eq, desc, asc, and, sql, or, ilike, inArray } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import crypto from "crypto";
import { AppEnv } from "../types.js";
import { resetAndSeedOfficialAccounts, INITIAL_USERS } from "../db/seed.js";
import { sanitizeDisplayName } from "./auth.js";

export const adminRouter = new Hono<AppEnv>();

// Apply auth + admin guard to all /admin/* routes
adminRouter.use("/admin/*", authMiddleware, adminGuard);

// =========================================================================
// 1. MANAJEMEN PENGGUNA
// =========================================================================

// List users with search & exam summary
adminRouter.get("/admin/users", async (c) => {
  try {
    const q = c.req.query("q")?.trim() || "";
    const role = c.req.query("role") || "";

    const allUsers = await db.query.user.findMany({
      orderBy: [desc(user.createdAt)],
    });

    // Query exam stats per user
    const stats = await db
      .select({
        userId: examSessions.userId,
        totalExams: sql<number>`count(${examSessions.id})::int`,
        passedExams: sql<number>`sum(case when ${examSessions.isPassed} then 1 else 0 end)::int`,
        avgScore: sql<number>`round(avg(${examSessions.totalScore}::numeric), 2)::float`,
      })
      .from(examSessions)
      .where(or(eq(examSessions.status, "SUBMITTED"), eq(examSessions.status, "TERMINATED_BY_ADMIN")))
      .groupBy(examSessions.userId);

    const statsMap = new Map(stats.map((s) => [s.userId, s]));

    let filtered = allUsers;
    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }
    if (q) {
      const qLower = q.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(qLower) ||
          u.username.toLowerCase().includes(qLower) ||
          (u.className && u.className.toLowerCase().includes(qLower))
      );
    }

    const result = filtered.map((u) => {
      const st = statsMap.get(u.id);
      return {
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role: u.role,
        className: u.className || "-",
        createdAt: u.createdAt,
        totalExams: st?.totalExams || 0,
        passedExams: st?.passedExams || 0,
        avgScore: st?.avgScore || 0,
      };
    });

    return c.json({ success: true, count: result.length, data: result });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin creates user
adminRouter.post("/admin/users", async (c) => {
  try {
    const body = await c.req.json();
    const { name, username: rawUsername, pin, className, email: rawEmail, role = "student" } = body;

    if (!name || !rawUsername || !pin) {
      return c.json({ success: false, error: "Nama, username, dan PIN wajib diisi." }, 400);
    }

    // RESIDUAL BUG-11/BUG-22: validasi + sanitasi identik dengan registrasi siswa
    // (defense-in-depth — sink frontend sudah di-escape, backend tidak boleh lebih longgar).
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

    // RESIDUAL BUG-22: PIN wajib tepat 6 digit angka.
    if (!/^\d{6}$/.test(String(pin))) {
      return c.json(
        { success: false, error: "PIN harus tepat 6 digit angka." },
        400
      );
    }
    const emailClean = rawEmail && String(rawEmail).trim().length > 0
      ? String(rawEmail).trim().toLowerCase()
      : `${usernameClean}@imm.internal`;

    const existing = await db.query.user.findFirst({
      where: or(eq(user.username, usernameClean), eq(user.email, emailClean)),
    });

    if (existing) {
      return c.json({ success: false, error: "Username atau email sudah terdaftar." }, 409);
    }

    const userId = "usr_" + crypto.randomUUID();
    const accountId = "acc_" + crypto.randomUUID();
    const hashedPassword = await hashPassword(String(pin));

    const [newUser] = await db
      .insert(user)
      .values({
        id: userId,
        name: nameClean,
        username: usernameClean,
        displayUsername: usernameClean,
        email: emailClean,
        emailVerified: true,
        role: role === "admin" ? "admin" : "student",
        className: className ? (sanitizeDisplayName(String(className)) || "Angkatan 35-A").slice(0, 40) : "Angkatan 35-A",
        banned: false,
      })
      .returning();

    await db.insert(account).values({
      id: accountId,
      userId: userId,
      accountId: userId,
      providerId: "credential",
      password: hashedPassword,
    });

    return c.json({ success: true, message: "Pengguna berhasil ditambahkan.", data: newUser }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin deletes user
adminRouter.delete("/admin/users/:id", async (c) => {
  try {
    const currentAdmin = c.get("user") as any;
    const targetUserId = c.req.param("id");

    if (currentAdmin.id === targetUserId) {
      return c.json({ success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." }, 400);
    }

    await db.delete(user).where(eq(user.id, targetUserId));
    return c.json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin resets user PIN to default '123456'
adminRouter.post("/admin/users/:id/reset-pin", async (c) => {
  try {
    const targetUserId = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    // RESIDUAL BUG-22: PIN kustom (bila diberikan) wajib tepat 6 digit angka.
    if (body.pin !== undefined && body.pin !== null && !/^\d{6}$/.test(String(body.pin))) {
      return c.json({ success: false, error: "PIN harus tepat 6 digit angka." }, 400);
    }
    const newPin = body.pin ? String(body.pin) : "123456";

    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, targetUserId),
    });

    if (!targetUser) {
      return c.json({ success: false, error: "Pengguna tidak ditemukan." }, 404);
    }

    const hashedPassword = await hashPassword(newPin);

    // Update credential account
    await db
      .update(account)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(and(eq(account.userId, targetUserId), eq(account.providerId, "credential")));

    // Revoke all active sessions of this user
    await db.delete(session).where(eq(session.userId, targetUserId));

    return c.json({
      success: true,
      message: `PIN pengguna ${targetUser.name} berhasil di-reset menjadi "${newPin}" dan seluruh sesi aktif telah dicabut.`,
      newPin: newPin,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin resets exam results & sessions for a specific student
adminRouter.post("/admin/users/:id/reset-exams", async (c) => {
  try {
    const targetUserId = c.req.param("id");
    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, targetUserId),
    });

    if (!targetUser) {
      return c.json({ success: false, error: "Pengguna tidak ditemukan." }, 404);
    }

    // Ambil seluruh ID sesi ujian milik siswa ini
    const userSessions = await db.query.examSessions.findMany({
      where: eq(examSessions.userId, targetUserId),
    });

    const sessionIds = userSessions.map((s) => s.id);
    if (sessionIds.length > 0) {
      await db.delete(examAnswers).where(inArray(examAnswers.sessionId, sessionIds));
      await db.delete(examSessions).where(eq(examSessions.userId, targetUserId));
    }

    return c.json({
      success: true,
      message: `Seluruh data nilai dan riwayat pengerjaan ujian untuk siswa "${targetUser.name}" berhasil di-reset total (${sessionIds.length} sesi dihapus).`,
      deletedCount: sessionIds.length,
    });
  } catch (err: any) {
    console.error("Reset student exams error:", err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin resets all users to official 19 accounts (clean slate)
adminRouter.post("/admin/reset-system-users", async (c) => {
  try {
    await resetAndSeedOfficialAccounts(true);
    return c.json({
      success: true,
      // RESIDUAL BUG-14: pesan harus mencerminkan perilaku non-destruktif aktual
      // (purge dinonaktifkan) — jangan menyesatkan sensei bahwa data lama dibersihkan.
      message: `Mode non-destruktif: TIDAK ada data pengguna lama yang dihapus. ${INITIAL_USERS.length} akun resmi (2 Sensei + 17 Siswa) telah dipastikan tersedia; akun yang sudah ada tidak diubah.`,
      count: INITIAL_USERS.length,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// =========================================================================
// 1B. MANAJEMEN HAK AKSES BAB PER-SISWA (PER-STUDENT CHAPTER ACCESS)
// =========================================================================

// Get chapter access permissions for a specific student
adminRouter.get("/admin/users/:id/chapter-access", async (c) => {
  try {
    const targetUserId = c.req.param("id");

    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, targetUserId),
    });

    if (!targetUser) {
      return c.json({ success: false, error: "Pengguna tidak ditemukan." }, 404);
    }

    const allChapters = await db.query.chapters.findMany({
      orderBy: [asc(chapters.chapterNum)],
    });

    const userAccessList = await db.query.userChapterAccess.findMany({
      where: eq(userChapterAccess.userId, targetUserId),
    });

    const accessMap = new Map(userAccessList.map((a) => [a.chapterNum, a.isAllowed]));
    const pdfAccessMap = new Map(userAccessList.map((a) => [a.chapterNum, a.isPdfAllowed]));

    const targetIsAdmin = targetUser.role === "admin";
    const targetPdfMaster = targetIsAdmin ? true : Boolean(targetUser.pdfAccessAllowed);

    const chapterList = allChapters.map((ch) => {
      let isPdfAllowed = false;
      if (targetIsAdmin) {
        isPdfAllowed = true;
      } else if (pdfAccessMap.has(ch.chapterNum)) {
        isPdfAllowed = pdfAccessMap.get(ch.chapterNum)! === true;
      } else if (targetPdfMaster) {
        isPdfAllowed = true;
      } else {
        isPdfAllowed = false;
      }

      return {
        chapterNum: ch.chapterNum,
        titleJa: ch.titleJa,
        titleId: ch.titleId,
        isAllowed: accessMap.has(ch.chapterNum) ? accessMap.get(ch.chapterNum)! : true,
        isPdfAllowed: isPdfAllowed,
        isGeneralUnlocked: ch.isUnlocked,
      };
    });

    return c.json({
      success: true,
      data: chapterList,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        username: targetUser.username,
        role: targetUser.role,
        className: targetUser.className || "-",
        pdfAccessAllowed: targetPdfMaster,
      },
      pdfAccessAllowed: targetPdfMaster,
      chapters: chapterList,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Update chapter & PDF access permissions for a specific student
adminRouter.put("/admin/users/:id/chapter-access", async (c) => {
  try {
    const targetUserId = c.req.param("id");

    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, targetUserId),
    });

    if (!targetUser) {
      return c.json({ success: false, error: "Pengguna tidak ditemukan." }, 404);
    }

    const body = await c.req.json().catch(() => ({}));

    // 1. Update user-level master PDF switch if provided
    if (typeof body.pdfAccessAllowed === "boolean") {
      await db
        .update(user)
        .set({ pdfAccessAllowed: body.pdfAccessAllowed, updatedAt: new Date() })
        .where(eq(user.id, targetUserId));
    }

    const allChapters = await db.query.chapters.findMany({
      orderBy: [asc(chapters.chapterNum)],
    });
    const validChapterSet = new Set(allChapters.map((ch) => ch.chapterNum));

    // Existing user chapter access records
    const existingList = await db.query.userChapterAccess.findMany({
      where: eq(userChapterAccess.userId, targetUserId),
    });
    const existingMap = new Map(existingList.map((a) => [a.chapterNum, a]));

    const updatesMap = new Map<string, { chapterNum: string; isAllowed?: boolean; isPdfAllowed?: boolean }>();

    function getOrCreateUpdate(chNum: string) {
      const cleanNum = String(chNum).padStart(2, "0");
      if (!updatesMap.has(cleanNum)) {
        updatesMap.set(cleanNum, { chapterNum: cleanNum });
      }
      return updatesMap.get(cleanNum)!;
    }

    // Exam access updates
    if (body.chapterNum !== undefined && body.isAllowed !== undefined) {
      getOrCreateUpdate(body.chapterNum).isAllowed = Boolean(body.isAllowed);
    } else if (Array.isArray(body.restrictedChapters)) {
      const restrictedSet = new Set(body.restrictedChapters.map((n: any) => String(n).padStart(2, "0")));
      for (const ch of allChapters) {
        getOrCreateUpdate(ch.chapterNum).isAllowed = !restrictedSet.has(ch.chapterNum);
      }
    } else if (Array.isArray(body.allowedChapters)) {
      const allowedSet = new Set(body.allowedChapters.map((n: any) => String(n).padStart(2, "0")));
      for (const ch of allChapters) {
        getOrCreateUpdate(ch.chapterNum).isAllowed = allowedSet.has(ch.chapterNum);
      }
    } else if (Array.isArray(body.chapters)) {
      for (const item of body.chapters) {
        if (item && item.chapterNum !== undefined) {
          const up = getOrCreateUpdate(item.chapterNum);
          if (item.isAllowed !== undefined) up.isAllowed = Boolean(item.isAllowed);
          if (item.isPdfAllowed !== undefined) up.isPdfAllowed = Boolean(item.isPdfAllowed);
        }
      }
    } else if (body.chapters && typeof body.chapters === "object") {
      for (const [k, v] of Object.entries(body.chapters)) {
        const up = getOrCreateUpdate(k);
        if (typeof v === "boolean") {
          up.isAllowed = Boolean(v);
        } else if (typeof v === "object" && v !== null) {
          const vObj = v as any;
          if (vObj.isAllowed !== undefined) up.isAllowed = Boolean(vObj.isAllowed);
          if (vObj.isPdfAllowed !== undefined) up.isPdfAllowed = Boolean(vObj.isPdfAllowed);
        }
      }
    } else if (Array.isArray(body.chapterAccess)) {
      for (const item of body.chapterAccess) {
        if (item && item.chapterNum !== undefined) {
          const up = getOrCreateUpdate(item.chapterNum);
          if (item.isAllowed !== undefined) up.isAllowed = Boolean(item.isAllowed);
          if (item.isPdfAllowed !== undefined) up.isPdfAllowed = Boolean(item.isPdfAllowed);
        }
      }
    } else if (body.action === "allow_all") {
      for (const ch of allChapters) {
        getOrCreateUpdate(ch.chapterNum).isAllowed = true;
      }
    } else if (body.action === "lock_all") {
      for (const ch of allChapters) {
        getOrCreateUpdate(ch.chapterNum).isAllowed = false;
      }
    }

    // Granular PDF updates
    if (body.chapterNum !== undefined && body.isPdfAllowed !== undefined) {
      getOrCreateUpdate(body.chapterNum).isPdfAllowed = Boolean(body.isPdfAllowed);
    } else if (Array.isArray(body.pdfChapters)) {
      for (const item of body.pdfChapters) {
        if (item && item.chapterNum !== undefined) {
          getOrCreateUpdate(item.chapterNum).isPdfAllowed = Boolean(item.isPdfAllowed);
        }
      }
    } else if (body.pdfChapters && typeof body.pdfChapters === "object") {
      for (const [k, v] of Object.entries(body.pdfChapters)) {
        getOrCreateUpdate(k).isPdfAllowed = Boolean(v);
      }
    } else if (body.pdfAction === "allow_all") {
      for (const ch of allChapters) {
        getOrCreateUpdate(ch.chapterNum).isPdfAllowed = true;
      }
      await db
        .update(user)
        .set({ pdfAccessAllowed: true, updatedAt: new Date() })
        .where(eq(user.id, targetUserId));
    } else if (body.pdfAction === "lock_all") {
      for (const ch of allChapters) {
        getOrCreateUpdate(ch.chapterNum).isPdfAllowed = false;
      }
      await db
        .update(user)
        .set({ pdfAccessAllowed: false, updatedAt: new Date() })
        .where(eq(user.id, targetUserId));
    }

    const updates = Array.from(updatesMap.values());

    // If only user-level pdfAccessAllowed was modified and no chapter updates
    if (updates.length === 0 && typeof body.pdfAccessAllowed === "boolean") {
      return c.json({
        success: true,
        message: `Hak akses PDF untuk siswa "${targetUser.name}" berhasil diperbarui menjadi ${body.pdfAccessAllowed ? "Aktif" : "Dibatasi"}.`,
        pdfAccessAllowed: body.pdfAccessAllowed,
      });
    }

    if (updates.length === 0) {
      return c.json({ success: false, error: "Format data pembaruan hak akses bab/PDF tidak valid." }, 400);
    }

    const invalidUpdates = updates.filter((up) => !validChapterSet.has(up.chapterNum));
    if (invalidUpdates.length > 0) {
      return c.json(
        {
          success: false,
          error: `Nomor bab tidak valid: ${invalidUpdates.map((u) => u.chapterNum).join(", ")}. Bab harus terdaftar di sistem.`,
        },
        400
      );
    }

    const now = new Date();
    const rows = updates.map((up) => {
      const existing = existingMap.get(up.chapterNum);
      const isAllowedVal = up.isAllowed !== undefined ? up.isAllowed : (existing ? existing.isAllowed : true);
      const isPdfAllowedVal = up.isPdfAllowed !== undefined
        ? up.isPdfAllowed
        : (existing ? existing.isPdfAllowed : (targetUser.role === "admin" ? true : false));
      return {
        id: `uca_${targetUserId}_${up.chapterNum}`,
        userId: targetUserId,
        chapterNum: up.chapterNum,
        isAllowed: isAllowedVal,
        isPdfAllowed: isPdfAllowedVal,
        updatedAt: now,
      };
    });

    await db
      .insert(userChapterAccess)
      .values(rows)
      .onConflictDoUpdate({
        target: [userChapterAccess.userId, userChapterAccess.chapterNum],
        set: {
          isAllowed: sql`EXCLUDED.is_allowed`,
          isPdfAllowed: sql`EXCLUDED.is_pdf_allowed`,
          updatedAt: now,
        },
      });

    return c.json({
      success: true,
      message: `Hak akses bab & PDF untuk siswa "${targetUser.name}" berhasil diperbarui.`,
      updatedCount: updates.length,
      data: updates,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// =========================================================================
// 2. KONTROL SISTEM (SAKELAR REGISTRASI & KUNCI GLOBAL)
// =========================================================================

adminRouter.patch("/admin/settings", async (c) => {
  try {
    const currentAdmin = c.get("user") as any;
    const body = await c.req.json();

    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: currentAdmin.id,
    };

    if (body.allowRegistration !== undefined) {
      updateData.allowRegistration = Boolean(body.allowRegistration);
    }
    if (body.globalExamLock !== undefined) {
      updateData.globalExamLock = Boolean(body.globalExamLock);
    }
    if (body.announcement !== undefined) {
      updateData.announcement = String(body.announcement);
    }

    const [updated] = await db
      .insert(systemSettings)
      .values({
        id: "default",
        ...updateData,
      })
      .onConflictDoUpdate({
        target: [systemSettings.id],
        set: updateData,
      })
      .returning();

    return c.json({
      success: true,
      message: "Pengaturan sistem berhasil diperbarui.",
      data: updated,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// =========================================================================
// 3. KONTROL KUNCI BAB SOAL (LOCK / UNLOCK)
// =========================================================================

// Lock/unlock 1 single chapter
adminRouter.patch("/admin/chapters/:chapterNum/lock", async (c) => {
  try {
    const chapterNum = c.req.param("chapterNum").padStart(2, "0");
    const body = await c.req.json();
    const isUnlocked = Boolean(body.isUnlocked);

    const [updated] = await db
      .update(chapters)
      .set({ isUnlocked, updatedAt: new Date() })
      .where(eq(chapters.chapterNum, chapterNum))
      .returning();

    if (!updated) {
      return c.json({ success: false, error: "Bab tidak ditemukan." }, 404);
    }

    return c.json({
      success: true,
      message: `Bab ${chapterNum} berhasil ${isUnlocked ? "dibuka" : "dikunci"}.`,
      data: updated,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Lock all 25 chapters
adminRouter.post("/admin/chapters/lock-all", async (c) => {
  try {
    await db.update(chapters).set({ isUnlocked: false, updatedAt: new Date() });
    return c.json({
      success: true,
      message: "Seluruh Bab 01 s.d. Bab 25 berhasil dikunci untuk siswa.",
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Unlock all 25 chapters
adminRouter.post("/admin/chapters/unlock-all", async (c) => {
  try {
    await db.update(chapters).set({ isUnlocked: true, updatedAt: new Date() });
    return c.json({
      success: true,
      message: "Seluruh Bab 01 s.d. Bab 25 berhasil dibuka.",
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// =========================================================================
// 4. LIVE MONITORING & TERMINASI UJIAN
// =========================================================================

// Live monitoring active exam sessions
adminRouter.get("/admin/monitoring/live", async (c) => {
  try {
    const liveSessions = await db.query.examSessions.findMany({
      where: eq(examSessions.status, "IN_PROGRESS"),
      orderBy: [desc(examSessions.startedAt)],
    });

    if (liveSessions.length === 0) {
      return c.json({ success: true, count: 0, data: [] });
    }

    // Load related users
    const userIds = Array.from(new Set(liveSessions.map((s) => s.userId)));
    const usersList = await db.query.user.findMany({
      where: or(...userIds.map((id) => eq(user.id, id))),
    });
    const usersMap = new Map(usersList.map((u) => [u.id, u]));

    // Query answered counts per session
    const answerCounts = await db
      .select({
        sessionId: examAnswers.sessionId,
        answeredCount: sql<number>`count(${examAnswers.id})::int`,
      })
      .from(examAnswers)
      .where(or(...liveSessions.map((s) => eq(examAnswers.sessionId, s.id))))
      .groupBy(examAnswers.sessionId);
    const answersCountMap = new Map(answerCounts.map((a) => [a.sessionId, a.answeredCount]));

    // Query total questions per chapter
    const chaptersList = await db.query.chapters.findMany();
    const chaptersMap = new Map(chaptersList.map((ch) => [ch.chapterNum, ch]));

    const now = new Date();
    const result = liveSessions.map((s) => {
      const u = usersMap.get(s.userId);
      const ch = chaptersMap.get(s.chapterNum);
      const answered = answersCountMap.get(s.id) || 0;
      const totalQ = (ch?.readingQuestions || 25) + (ch?.choukaiQuestions || 8);
      const expires = new Date(s.expiresAt);
      const remainingSeconds = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000));
      const remainingMinutes = Math.floor(remainingSeconds / 60);

      return {
        sessionId: s.id,
        userId: s.userId,
        studentName: u?.name || "Siswa",
        username: u?.username || "-",
        className: u?.className || "-",
        chapterNum: s.chapterNum,
        mode: s.mode,
        startedAt: s.startedAt,
        expiresAt: s.expiresAt,
        answeredCount: answered,
        totalQuestions: totalQ,
        progressPercent: Math.round((answered / totalQ) * 100),
        remainingMinutes: remainingMinutes,
        remainingSeconds: remainingSeconds,
        isExpired: now > expires,
      };
    });

    return c.json({ success: true, count: result.length, data: result });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin force-terminates an exam session (auto-calculate and submit)
adminRouter.post("/admin/monitoring/sessions/:id/terminate", async (c) => {
  try {
    const sessionId = c.req.param("id");

    const session = await db.query.examSessions.findFirst({
      where: eq(examSessions.id, sessionId),
    });

    if (!session) {
      return c.json({ success: false, error: "Sesi ujian tidak ditemukan." }, 404);
    }

    if (session.status === "SUBMITTED") {
      return c.json({ success: true, message: "Sesi ujian sudah diselesaikan sebelumnya." });
    }

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.chapterNum, session.chapterNum),
    });

    const chapterQuestions = await db.query.questions.findMany({
      where: eq(questions.chapterNum, session.chapterNum),
    });

    const answers = await db.query.examAnswers.findMany({
      where: eq(examAnswers.sessionId, sessionId),
    });

    const answersMap = new Map(answers.map((a) => [a.questionId, a]));

    let readingTotal = 0;
    let readingCorrect = 0;
    let choukaiTotal = 0;
    let choukaiCorrect = 0;

    for (const q of chapterQuestions) {
      const userAns = answersMap.get(q.id);
      const isCorrect = userAns ? String(userAns.selectedOption) === String(q.correctAnswer) : false;
      if (q.session === "choukai") {
        choukaiTotal++;
        if (isCorrect) choukaiCorrect++;
      } else {
        readingTotal++;
        if (isCorrect) readingCorrect++;
      }
    }

    const totalQuestions = chapterQuestions.length || 1;
    const totalCorrect = readingCorrect + choukaiCorrect;
    const readingScore = readingTotal > 0 ? Number(((readingCorrect / readingTotal) * 100).toFixed(2)) : 0;
    const choukaiScore = choukaiTotal > 0 ? Number(((choukaiCorrect / choukaiTotal) * 100).toFixed(2)) : 0;
    const finalScore = choukaiTotal > 0
      ? Number(((readingScore + choukaiScore) / 2).toFixed(2))
      : readingScore;
    const passingScore = chapter?.passingScore || 80;
    const isPassed = finalScore >= passingScore;

    const now = new Date();
    const timeSpentSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000));

    await db
      .update(examSessions)
      .set({
        status: "TERMINATED_BY_ADMIN",
        submittedAt: now,
        timeSpentSeconds: timeSpentSeconds,
        readingScore: String(readingScore),
        choukaiScore: String(choukaiScore),
        totalScore: String(finalScore),
        isPassed: isPassed,
      })
      .where(eq(examSessions.id, sessionId));

    return c.json({
      success: true,
      message: "Sesi ujian berhasil dihentikan paksa dan dikumpulkan oleh pengawas.",
      data: {
        sessionId,
        totalScore: finalScore,
        isPassed,
      },
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// =========================================================================
// 5. REKAP NILAI & EKSPOR CSV
// =========================================================================

// Rekap Nilai JSON
adminRouter.get("/admin/monitoring/results", async (c) => {
  try {
    const chapterQuery = c.req.query("chapter") || "";
    const classQuery = c.req.query("class") || "";

    const results = await db
      .select({
        sessionId: examSessions.id,
        userId: examSessions.userId,
        studentName: user.name,
        username: user.username,
        className: user.className,
        chapterNum: examSessions.chapterNum,
        mode: examSessions.mode,
        status: examSessions.status,
        readingScore: examSessions.readingScore,
        choukaiScore: examSessions.choukaiScore,
        totalScore: examSessions.totalScore,
        isPassed: examSessions.isPassed,
        timeSpentSeconds: examSessions.timeSpentSeconds,
        submittedAt: examSessions.submittedAt,
        startedAt: examSessions.startedAt,
      })
      .from(examSessions)
      .innerJoin(user, eq(examSessions.userId, user.id))
      .where(
        and(
          or(eq(examSessions.status, "SUBMITTED"), eq(examSessions.status, "TERMINATED_BY_ADMIN")),
          chapterQuery ? eq(examSessions.chapterNum, chapterQuery.padStart(2, "0")) : undefined,
          classQuery ? eq(user.className, classQuery) : undefined
        )
      )
      .orderBy(desc(examSessions.submittedAt));

    return c.json({ success: true, count: results.length, data: results });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Ekspor Rekap Nilai CSV
adminRouter.get("/admin/monitoring/results/export", async (c) => {
  try {
    const chapterQuery = c.req.query("chapter") || "";
    const classQuery = c.req.query("class") || "";

    const results = await db
      .select({
        sessionId: examSessions.id,
        studentName: user.name,
        username: user.username,
        className: user.className,
        chapterNum: examSessions.chapterNum,
        mode: examSessions.mode,
        readingScore: examSessions.readingScore,
        choukaiScore: examSessions.choukaiScore,
        totalScore: examSessions.totalScore,
        isPassed: examSessions.isPassed,
        timeSpentSeconds: examSessions.timeSpentSeconds,
        submittedAt: examSessions.submittedAt,
      })
      .from(examSessions)
      .innerJoin(user, eq(examSessions.userId, user.id))
      .where(
        and(
          or(eq(examSessions.status, "SUBMITTED"), eq(examSessions.status, "TERMINATED_BY_ADMIN")),
          chapterQuery ? eq(examSessions.chapterNum, chapterQuery.padStart(2, "0")) : undefined,
          classQuery ? eq(user.className, classQuery) : undefined
        )
      )
      .orderBy(desc(examSessions.submittedAt));

    // Construct CSV output
    const headers = [
      "No",
      "Nama Siswa",
      "Username",
      "Kelas / Angkatan",
      "Bab",
      "Mode",
      "Nilai Reading",
      "Nilai Choukai",
      "Nilai Total",
      "Status Kelulusan",
      "Durasi Pengerjaan (Menit)",
      "Waktu Submit",
    ];

    const rows = results.map((r, index) => {
      const minutesSpent = Math.round((r.timeSpentSeconds || 0) / 60);
      const submitTime = r.submittedAt ? new Date(r.submittedAt).toLocaleString("id-ID") : "-";
      const passText = r.isPassed ? "LULUS" : "REMEDIAL";
      return [
        index + 1,
        `"${(r.studentName || "").replace(/"/g, '""')}"`,
        `"${(r.username || "").replace(/"/g, '""')}"`,
        `"${(r.className || "-").replace(/"/g, '""')}"`,
        `"Bab ${r.chapterNum}"`,
        `"${r.mode}"`,
        r.readingScore || "0",
        r.choukaiScore || "0",
        r.totalScore || "0",
        `"${passText}"`,
        minutesSpent,
        `"${submitTime}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="rekap_nilai_cbt_imm.csv"',
      },
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin resets ALL exam results and answers (Kosongkan Total Data Pengerjaan)
adminRouter.post("/admin/monitoring/results/reset-all", async (c) => {
  try {
    const totalSessions = await db.select({ count: sql<number>`count(*)::int` }).from(examSessions);
    const count = totalSessions[0]?.count || 0;

    await db.delete(examAnswers);
    await db.delete(examSessions);

    return c.json({
      success: true,
      message: `Seluruh data pengerjaan ujian siswa (${count} sesi) berhasil dikosongkan total dari basis data.`,
      deletedCount: count,
    });
  } catch (err: any) {
    console.error("Reset all exam results error:", err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

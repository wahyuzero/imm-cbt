import { Hono } from "hono";
import { db } from "../db/index.js";
import { chapters, examSessions, examAnswers, questions, systemSettings, userChapterAccess, user } from "../db/schema.js";
import { asc, eq, and, desc, or, inArray, sql } from "drizzle-orm";
import { auth } from "../lib/auth.js";

export const chaptersRouter = new Hono();

chaptersRouter.get("/chapters", async (c) => {
  try {
    const allChapters = await db.query.chapters.findMany({
      orderBy: [asc(chapters.chapterNum)],
    });

    // Check optional authenticated user to attach personal best scores & per-student access restrictions
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const userBestScores: Record<string, any> = {};
    const userAccessMap = new Map<string, boolean>();
    const userPdfAccessMap = new Map<string, boolean>();
    let userGlobalPdfAllowed = true;
    // RESIDUAL BUG-18: marker waktu reset ujian (global + per-user) — dipakai klien
    // untuk membersihkan cache progress lokal yang basi setelah reset oleh sensei.
    let resultsResetAt: string | null = null;

    if (session && session.user) {
      try {
        const markerRows = await db.query.systemSettings.findMany({
          where: inArray(systemSettings.id, ["exam_reset_global", `exam_reset_user_${session.user.id}`]),
        });
        let resetAt: Date | null = null;
        for (const row of markerRows) {
          const t = new Date(row.updatedAt);
          if (!resetAt || t > resetAt) resetAt = t;
        }
        resultsResetAt = resetAt ? resetAt.toISOString() : null;
      } catch {
        resultsResetAt = null;
      }

      const userSessions = await db.query.examSessions.findMany({
        where: and(
          eq(examSessions.userId, session.user.id),
          or(eq(examSessions.status, "SUBMITTED"), eq(examSessions.status, "TERMINATED_BY_ADMIN"))
        ),
        orderBy: [desc(examSessions.totalScore)],
      });

      const bestSessionIds = new Set<string>();
      for (const s of userSessions) {
        if (!userBestScores[s.chapterNum]) {
          bestSessionIds.add(s.id);
          userBestScores[s.chapterNum] = {
            sessionId: s.id,
            totalScore: Number(s.totalScore),
            readingScore: Number(s.readingScore),
            choukaiScore: Number(s.choukaiScore),
            isPassed: s.isPassed,
            status: s.status,
          };
        }
      }

      // RESIDUAL BUG-07: jumlah soal benar resmi dihitung ulang dari exam_answers
      // (kolom isCorrect diisi server saat /exam/answer) untuk sesi terbaik tiap
      // bab — tanpa ini klien server-lite menampilkan "Total Benar: 0 dari 33".
      const correctBySession = new Map<string, { reading: number; choukai: number }>();
      if (bestSessionIds.size > 0) {
        const answerRows = await db
          .select({
            sessionId: examAnswers.sessionId,
            questionSession: questions.session,
            isCorrect: examAnswers.isCorrect,
          })
          .from(examAnswers)
          .innerJoin(questions, eq(questions.id, examAnswers.questionId))
          .where(inArray(examAnswers.sessionId, Array.from(bestSessionIds)));
        for (const row of answerRows) {
          if (!row.isCorrect) continue;
          const agg = correctBySession.get(row.sessionId) || { reading: 0, choukai: 0 };
          if (row.questionSession === "choukai") agg.choukai += 1;
          else agg.reading += 1;
          correctBySession.set(row.sessionId, agg);
        }
      }
      // Total soal per bab per sesi (sumber kebenaran yang sama dengan /exam/submit).
      const totalsByChapter = new Map<string, { reading: number; choukai: number }>();
      const qCountRows = await db
        .select({
          chapterNum: questions.chapterNum,
          session: questions.session,
          count: sql<number>`count(*)::int`,
        })
        .from(questions)
        .groupBy(questions.chapterNum, questions.session);
      for (const row of qCountRows) {
        const agg = totalsByChapter.get(row.chapterNum) || { reading: 0, choukai: 0 };
        if (row.session === "choukai") agg.choukai = row.count;
        else agg.reading = row.count;
        totalsByChapter.set(row.chapterNum, agg);
      }
      for (const [chapterNum, best] of Object.entries(userBestScores)) {
        const counts = correctBySession.get(best.sessionId) || { reading: 0, choukai: 0 };
        const totals = totalsByChapter.get(chapterNum) || { reading: 25, choukai: 0 };
        best.readingCorrect = counts.reading;
        best.choukaiCorrect = counts.choukai;
        best.totalCorrect = counts.reading + counts.choukai;
        best.readingTotal = totals.reading;
        best.choukaiTotal = totals.choukai;
        best.totalQuestions = totals.reading + totals.choukai;
        delete best.sessionId; // internal saja — ID sesi tidak perlu dikirim ke klien
      }

      if (session.user.role === "admin") {
        userGlobalPdfAllowed = true;
      } else {
        const dbUser = await db.query.user.findFirst({
          where: eq(user.id, session.user.id),
        });
        userGlobalPdfAllowed = dbUser ? Boolean(dbUser.pdfAccessAllowed) : false;

        const accessList = await db.query.userChapterAccess.findMany({
          where: eq(userChapterAccess.userId, session.user.id),
        });
        for (const a of accessList) {
          userAccessMap.set(a.chapterNum, a.isAllowed);
          userPdfAccessMap.set(a.chapterNum, a.isPdfAllowed);
        }
      }
    }

    const mapped = allChapters.map((ch) => {
      const isAllowedForUser = userAccessMap.has(ch.chapterNum)
        ? userAccessMap.get(ch.chapterNum)!
        : true;
      const isUserRestricted = !isAllowedForUser;

      // PDF logic:
      // Sensei: ALWAYS allowed (true)
      // Siswa:
      // 1. If Sensei configured custom chapter toggle for this student: use that specific chapter toggle!
      // 2. Else if userGlobalPdfAllowed is true (Sensei clicked "Buka Semua"): true
      // 3. Else: false (By default, only Sensei has access!)
      let isPdfAllowedForUser = false;
      if (session && session.user.role === "admin") {
        isPdfAllowedForUser = true;
      } else if (userPdfAccessMap.has(ch.chapterNum)) {
        isPdfAllowedForUser = userPdfAccessMap.get(ch.chapterNum)! === true;
      } else if (userGlobalPdfAllowed) {
        isPdfAllowedForUser = true;
      } else {
        isPdfAllowedForUser = false;
      }

      return {
        ...ch,
        isUnlocked: isUserRestricted ? false : ch.isUnlocked,
        userRestricted: isUserRestricted,
        isPdfAllowed: isPdfAllowedForUser,
        pdfRestricted: !isPdfAllowedForUser,
        userScore: userBestScores[ch.chapterNum] || null,
      };
    });

    return c.json({
      success: true,
      pdfAccessAllowed: userGlobalPdfAllowed,
      resultsResetAt,
      data: mapped,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

chaptersRouter.get("/chapters/:chapterNum", async (c) => {
  try {
    const chapterNum = c.req.param("chapterNum").padStart(2, "0");
    const ch = await db.query.chapters.findFirst({
      where: eq(chapters.chapterNum, chapterNum),
    });

    if (!ch) {
      return c.json({ success: false, error: "Bab tidak ditemukan." }, 404);
    }

    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    let isUserRestricted = false;

    if (session && session.user && session.user.role !== "admin") {
      const accessRecord = await db.query.userChapterAccess.findFirst({
        where: and(
          eq(userChapterAccess.userId, session.user.id),
          eq(userChapterAccess.chapterNum, chapterNum)
        ),
      });
      if (accessRecord && !accessRecord.isAllowed) {
        isUserRestricted = true;
      }
    }

    return c.json({
      success: true,
      data: {
        ...ch,
        isUnlocked: isUserRestricted ? false : ch.isUnlocked,
        userRestricted: isUserRestricted,
      },
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});


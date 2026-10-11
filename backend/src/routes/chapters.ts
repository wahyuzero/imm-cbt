import { Hono } from "hono";
import { db } from "../db/index.js";
import { chapters, examSessions, userChapterAccess, user } from "../db/schema.js";
import { asc, eq, and, desc, or } from "drizzle-orm";
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

    if (session && session.user) {
      const userSessions = await db.query.examSessions.findMany({
        where: and(
          eq(examSessions.userId, session.user.id),
          or(eq(examSessions.status, "SUBMITTED"), eq(examSessions.status, "TERMINATED_BY_ADMIN"))
        ),
        orderBy: [desc(examSessions.totalScore)],
      });

      for (const s of userSessions) {
        if (!userBestScores[s.chapterNum]) {
          userBestScores[s.chapterNum] = {
            totalScore: Number(s.totalScore),
            readingScore: Number(s.readingScore),
            choukaiScore: Number(s.choukaiScore),
            isPassed: s.isPassed,
            status: s.status,
          };
        }
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


import { Hono } from "hono";
import { db } from "../db/index.js";
import { chapters, examSessions } from "../db/schema.js";
import { asc, eq, and, desc } from "drizzle-orm";
import { auth } from "../lib/auth.js";

export const chaptersRouter = new Hono();

chaptersRouter.get("/chapters", async (c) => {
  try {
    const allChapters = await db.query.chapters.findMany({
      orderBy: [asc(chapters.chapterNum)],
    });

    // Check optional authenticated user to attach personal best scores
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const userBestScores: Record<string, any> = {};

    if (session && session.user) {
      const userSessions = await db.query.examSessions.findMany({
        where: eq(examSessions.userId, session.user.id),
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
    }

    const mapped = allChapters.map((ch) => ({
      ...ch,
      userScore: userBestScores[ch.chapterNum] || null,
    }));

    return c.json({ success: true, data: mapped });
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

    return c.json({ success: true, data: ch });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

import { Hono } from "hono";
import { db } from "../db/index.js";
import { vocabulary, userVocabularyProgress } from "../db/schema.js";
import { eq, and, asc } from "drizzle-orm";
import { auth } from "../lib/auth.js";
import { authMiddleware } from "../middlewares/auth.js";
import crypto from "crypto";
import { AppEnv } from "../types.js";

export const vocabularyRouter = new Hono<AppEnv>();

// List vocabulary with user's memorized status
vocabularyRouter.get("/vocabulary", async (c) => {
  try {
    const babQuery = c.req.query("bab");
    const babNum = babQuery ? parseInt(babQuery, 10) : null;

    const words = await db.query.vocabulary.findMany({
      where: babNum ? eq(vocabulary.babNum, babNum) : undefined,
      orderBy: [asc(vocabulary.babNum), asc(vocabulary.wordOrder)],
    });

    // Check optional authenticated user
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const progressMap = new Map<string, boolean>();

    if (session && session.user) {
      const progressList = await db.query.userVocabularyProgress.findMany({
        where: eq(userVocabularyProgress.userId, session.user.id),
      });
      for (const p of progressList) {
        progressMap.set(p.vocabularyId, p.isMemorized ?? true);
      }
    }

    const mapped = words.map((w) => ({
      ...w,
      isMemorized: progressMap.has(w.id) ? progressMap.get(w.id) : false,
    }));

    return c.json({ success: true, count: mapped.length, data: mapped });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Toggle memorization status
vocabularyRouter.post("/vocabulary/:id/toggle", authMiddleware, async (c) => {
  try {
    const user = c.get("user") as any;
    const vocabId = c.req.param("id");

    const existing = await db.query.userVocabularyProgress.findFirst({
      where: and(
        eq(userVocabularyProgress.userId, user.id),
        eq(userVocabularyProgress.vocabularyId, vocabId)
      ),
    });

    const newStatus = existing ? !existing.isMemorized : true;

    await db
      .insert(userVocabularyProgress)
      .values({
        id: existing?.id || "uvp_" + crypto.randomUUID(),
        userId: user.id,
        vocabularyId: vocabId,
        isMemorized: newStatus,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userVocabularyProgress.userId, userVocabularyProgress.vocabularyId],
        set: {
          isMemorized: newStatus,
          updatedAt: new Date(),
        },
      });

    return c.json({
      success: true,
      data: {
        vocabularyId: vocabId,
        isMemorized: newStatus,
      },
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.js";
import { db } from "../db/index.js";
import {
  chapters,
  questions,
  examSessions,
  examAnswers,
  systemSettings,
} from "../db/schema.js";
import { eq, and, asc } from "drizzle-orm";
import crypto from "crypto";
import { AppEnv } from "../types.js";

export const examRouter = new Hono<AppEnv>();

// Start Exam Session
examRouter.post("/exam/start", authMiddleware, async (c) => {
  try {
    const user = c.get("user") as any;
    const body = await c.req.json();
    const chapterNum = String(body.chapterNum || "01").padStart(2, "0");
    const mode = body.mode === "shiken" ? "shiken" : "renshuu";

    // 1. Verify system settings & lock
    const settings = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.id, "default"),
    });

    if (settings?.globalExamLock && user.role !== "admin") {
      return c.json(
        { success: false, error: "Ujian sedang dikunci secara global oleh Sensei." },
        403
      );
    }

    // 2. Verify chapter exists & unlock status
    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.chapterNum, chapterNum),
    });

    if (!chapter) {
      return c.json({ success: false, error: "Bab ujian tidak ditemukan." }, 404);
    }

    if (!chapter.isUnlocked && user.role !== "admin") {
      return c.json(
        {
          success: false,
          error: `Bab ${chapterNum} sedang dikunci oleh Sensei. Hubungi pengawas ujian.`,
        },
        403
      );
    }

    // 3. Create exam session
    const durationMinutes = chapter.examDurationMinutes || 60;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
    const sessionId = "ses_" + crypto.randomUUID();

    const [session] = await db
      .insert(examSessions)
      .values({
        id: sessionId,
        userId: user.id,
        chapterNum: chapterNum,
        mode: mode,
        status: "IN_PROGRESS",
        startedAt: now,
        expiresAt: expiresAt,
        readingScore: "0",
        choukaiScore: "0",
        totalScore: "0",
        isPassed: false,
      })
      .returning();

    // 4. Fetch questions without correct answers and explanations (anti-cheat)
    const chapterQuestions = await db.query.questions.findMany({
      where: eq(questions.chapterNum, chapterNum),
      orderBy: [asc(questions.questionNumber)],
    });

    const safeQuestions = chapterQuestions.map((q) => ({
      id: q.id,
      questionNumber: q.questionNumber,
      session: q.session,
      sectionJa: q.sectionJa,
      sectionId: q.sectionId,
      category: q.category,
      questionType: q.questionType,
      questionJa: q.questionJa,
      questionRuby: q.questionRuby,
      questionRomaji: q.questionRomaji,
      questionId: q.questionId,
      imageUrl: q.imageUrl,
      audioSrc: q.audioSrc,
      dialogue: q.dialogue,
      options: q.options,
      // Note: correctAnswer and explanations are omitted here for integrity!
    }));

    return c.json({
      success: true,
      data: {
        session: {
          id: session.id,
          chapterNum: session.chapterNum,
          mode: session.mode,
          startedAt: session.startedAt,
          expiresAt: session.expiresAt,
          durationMinutes: durationMinutes,
        },
        chapter: {
          num: chapter.chapterNum,
          titleJa: chapter.titleJa,
          titleId: chapter.titleId,
          audioSrc: chapter.audioSrc,
          passingScore: chapter.passingScore,
        },
        questions: safeQuestions,
      },
    });
  } catch (err: any) {
    console.error("Start exam error:", err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Auto-save Answer Real-Time
examRouter.post("/exam/answer", authMiddleware, async (c) => {
  try {
    const user = c.get("user") as any;
    const body = await c.req.json();
    const { sessionId, questionId, selectedOption } = body;

    if (!sessionId || !questionId || selectedOption === undefined) {
      return c.json({ success: false, error: "Data jawaban tidak lengkap." }, 400);
    }

    const session = await db.query.examSessions.findFirst({
      where: and(eq(examSessions.id, sessionId), eq(examSessions.userId, user.id)),
    });

    if (!session) {
      return c.json({ success: false, error: "Sesi ujian tidak valid." }, 404);
    }

    if (session.status !== "IN_PROGRESS") {
      return c.json(
        { success: false, error: `Sesi ujian telah berstatus ${session.status}.` },
        400
      );
    }

    // Check expiration
    if (new Date() > new Date(session.expiresAt)) {
      await db
        .update(examSessions)
        .set({ status: "EXPIRED" })
        .where(eq(examSessions.id, sessionId));
      return c.json({ success: false, error: "Waktu ujian telah habis." }, 400);
    }

    // Check correctness server-side
    const q = await db.query.questions.findFirst({
      where: eq(questions.id, questionId),
    });

    const isCorrect = q ? String(q.correctAnswer) === String(selectedOption) : false;

    // PostgreSQL UPSERT on conflict (session_id, question_id)
    await db
      .insert(examAnswers)
      .values({
        id: "ans_" + crypto.randomUUID(),
        sessionId: sessionId,
        questionId: questionId,
        selectedOption: String(selectedOption),
        isCorrect: isCorrect,
        answeredAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [examAnswers.sessionId, examAnswers.questionId],
        set: {
          selectedOption: String(selectedOption),
          isCorrect: isCorrect,
          answeredAt: new Date(),
        },
      });

    return c.json({ success: true, saved: true });
  } catch (err: any) {
    console.error("Save answer error:", err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Submit Exam
examRouter.post("/exam/submit", authMiddleware, async (c) => {
  try {
    const user = c.get("user") as any;
    const body = await c.req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return c.json({ success: false, error: "Session ID wajib dikirim." }, 400);
    }

    const session = await db.query.examSessions.findFirst({
      where: and(eq(examSessions.id, sessionId), eq(examSessions.userId, user.id)),
    });

    if (!session) {
      return c.json({ success: false, error: "Sesi ujian tidak ditemukan." }, 404);
    }

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.chapterNum, session.chapterNum),
    });

    const chapterQuestions = await db.query.questions.findMany({
      where: eq(questions.chapterNum, session.chapterNum),
      orderBy: [asc(questions.questionNumber)],
    });

    const answers = await db.query.examAnswers.findMany({
      where: eq(examAnswers.sessionId, sessionId),
    });

    const answersMap = new Map(answers.map((a) => [a.questionId, a]));

    let readingTotal = 0;
    let readingCorrect = 0;
    let choukaiTotal = 0;
    let choukaiCorrect = 0;

    const detailedReview = chapterQuestions.map((q) => {
      const userAns = answersMap.get(q.id);
      const isCorrect = userAns ? String(userAns.selectedOption) === String(q.correctAnswer) : false;

      if (q.session === "choukai") {
        choukaiTotal++;
        if (isCorrect) choukaiCorrect++;
      } else {
        readingTotal++;
        if (isCorrect) readingCorrect++;
      }

      return {
        id: q.id,
        questionNumber: q.questionNumber,
        session: q.session,
        questionJa: q.questionJa,
        questionId: q.questionId,
        selectedOption: userAns?.selectedOption || null,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        explanation: {
          summary: q.explanationSummary,
          logic: q.explanationLogic,
          distractor: q.explanationDistractor,
          grammarRule: q.explanationGrammar,
        },
      };
    });

    const totalQuestions = chapterQuestions.length || 1;
    const totalCorrect = readingCorrect + choukaiCorrect;
    const finalScore = Number(((totalCorrect / totalQuestions) * 100).toFixed(2));
    const readingScore = readingTotal > 0 ? Number(((readingCorrect / readingTotal) * 100).toFixed(2)) : 0;
    const choukaiScore = choukaiTotal > 0 ? Number(((choukaiCorrect / choukaiTotal) * 100).toFixed(2)) : 0;
    const passingScore = chapter?.passingScore || 80;
    const isPassed = finalScore >= passingScore;

    const now = new Date();
    const timeSpentSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000));

    // Update session record
    await db
      .update(examSessions)
      .set({
        status: "SUBMITTED",
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
      data: {
        sessionId: sessionId,
        chapterNum: session.chapterNum,
        totalScore: finalScore,
        readingScore: readingScore,
        choukaiScore: choukaiScore,
        readingCorrect,
        readingTotal,
        choukaiCorrect,
        choukaiTotal,
        totalCorrect,
        totalQuestions,
        passingScore: passingScore,
        isPassed: isPassed,
        timeSpentSeconds: timeSpentSeconds,
        submittedAt: now,
        review: detailedReview,
      },
    });
  } catch (err: any) {
    console.error("Submit exam error:", err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Get session details and active progress
examRouter.get("/exam/sessions/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user") as any;
    const sessionId = c.req.param("id");

    const session = await db.query.examSessions.findFirst({
      where: and(eq(examSessions.id, sessionId), eq(examSessions.userId, user.id)),
    });

    if (!session) {
      return c.json({ success: false, error: "Sesi tidak ditemukan." }, 404);
    }

    const answers = await db.query.examAnswers.findMany({
      where: eq(examAnswers.sessionId, sessionId),
    });

    return c.json({
      success: true,
      data: {
        session,
        answers,
      },
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

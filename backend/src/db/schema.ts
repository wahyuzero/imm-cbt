import { pgTable, text, timestamp, boolean, integer, jsonb, numeric, uniqueIndex } from "drizzle-orm/pg-core";

// =========================================================================
// 1. BETTER AUTH & USER RBAC
// =========================================================================
export const user = pgTable("user", {
  id: text("id").primaryKey(),                       // CUID / UUID
  name: text("name").notNull(),                      // "Ahmad Syahroni" / "Sensei Wahyu"
  username: text("username").unique().notNull(),     // "ahmad.syahroni" (Login Kredensial LPK)
  displayUsername: text("display_username"),
  email: text("email").unique().notNull(),           // Fallback: ahmad.syahroni@imm.internal
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role").default("student").notNull(),   // 'student' | 'admin'
  className: text("class_name"),                     // "Angkatan 35-A" (teks fleksibel)
  banned: boolean("banned").default(false).notNull(),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),              // Diwajibkan Better Auth Admin Plugin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  impersonatedBy: text("impersonated_by"),           // Diwajibkan Better Auth Admin Plugin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),         // "credential" | "google"
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),                        // Hashed PIN / Password
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =========================================================================
// 2. SYSTEM SETTINGS (KONTROL SISTEM SENSEI)
// =========================================================================
export const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey().default("default"),
  allowRegistration: boolean("allow_registration").default(true).notNull(), // Switch Buka/Tutup Registrasi
  globalExamLock: boolean("global_exam_lock").default(false).notNull(),       // Sakelar Darurat Kunci Semua
  announcement: text("announcement"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by").references(() => user.id),
});

// =========================================================================
// 3. CHAPTERS & LOCK PER BAB
// =========================================================================
export const chapters = pgTable("chapters", {
  chapterNum: text("chapter_num").primaryKey(),       // "01" s.d. "25"
  titleJa: text("title_ja").notNull(),
  titleId: text("title_id").notNull(),
  themeJa: text("theme_ja"),
  themeId: text("theme_id"),
  audioSrc: text("audio_src"),
  pdfSoalUrl: text("pdf_soal_url"),
  pdfKunciUrl: text("pdf_kunci_url"),
  pdfReadingSoalUrl: text("pdf_reading_soal_url"),
  pdfReadingKunciUrl: text("pdf_reading_kunci_url"),
  readingQuestions: integer("reading_questions").default(25).notNull(),
  choukaiQuestions: integer("choukai_questions").default(8).notNull(),
  isUnlocked: boolean("is_unlocked").default(true).notNull(), // Kontrol Buka/Kunci Bab oleh Sensei
  examDurationMinutes: integer("exam_duration_minutes").default(60).notNull(),
  passingScore: integer("passing_score").default(80).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =========================================================================
// 4. QUESTIONS (BANK SOAL TERPADU SERVER-AUTHORITATIVE)
// =========================================================================
export const questions = pgTable("questions", {
  id: text("id").primaryKey(),                       // e.g. "q_08_01"
  chapterNum: text("chapter_num").notNull().references(() => chapters.chapterNum, { onDelete: "cascade" }),
  questionNumber: integer("question_number").notNull(), // 1 s.d. 33
  session: text("session").notNull(),                // 'reading' | 'choukai'
  sectionJa: text("section_ja"),
  sectionId: text("section_id"),
  category: text("category"),
  questionType: text("question_type").default("teks"), // 'teks' | 'gambar'
  questionJa: text("question_ja").notNull(),
  questionRuby: text("question_ruby"),
  questionRomaji: text("question_romaji"),
  questionId: text("question_id"),
  imageUrl: text("image_url"),
  audioSrc: text("audio_src"),
  dialogue: jsonb("dialogue"),                       // Array percakapan Choukai [{speaker, text_ja, romaji, text_id}]
  options: jsonb("options").notNull(),               // Array opsi [{id: "A", text_ja: "..."}]
  correctAnswer: text("correct_answer").notNull(),   // RAHASIA SERVER (Anti-Cheat)
  explanationSummary: text("explanation_summary"),
  explanationLogic: text("explanation_logic"),
  explanationDistractor: text("explanation_distractor"),
  explanationGrammar: text("explanation_grammar"),
});

// =========================================================================
// 5. SESI UJIAN & JAWABAN REAL-TIME
// =========================================================================
export const examSessions = pgTable("exam_sessions", {
  id: text("id").primaryKey(),                       // ID Sesi Tryout Siswa
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  chapterNum: text("chapter_num").notNull().references(() => chapters.chapterNum),
  mode: text("mode").default("renshuu").notNull(),   // 'renshuu' | 'shiken'
  status: text("status").default("IN_PROGRESS").notNull(), // 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED' | 'TERMINATED_BY_ADMIN'
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),      // Server-authoritative timer
  submittedAt: timestamp("submitted_at"),
  timeSpentSeconds: integer("time_spent_seconds").default(0),
  readingScore: numeric("reading_score", { precision: 5, scale: 2 }).default("0"),
  choukaiScore: numeric("choukai_score", { precision: 5, scale: 2 }).default("0"),
  totalScore: numeric("total_score", { precision: 5, scale: 2 }).default("0"),
  isPassed: boolean("is_passed").default(false),
});

export const examAnswers = pgTable("exam_answers", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => examSessions.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  selectedOption: text("selected_option").notNull(),
  isCorrect: boolean("is_correct"),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
}, (table) => ({
  // UNIQUE INDEX untuk PostgreSQL UPSERT ON CONFLICT:
  sessionQuestionUniqueIdx: uniqueIndex("exam_answers_session_q_idx").on(table.sessionId, table.questionId),
}));

// =========================================================================
// 6. VOCABULARY & CHECKLIST HAFALAN (1.500 KATA)
// =========================================================================
export const vocabulary = pgTable("vocabulary", {
  id: text("id").primaryKey(),                       // e.g. "vocab_01_01"
  babNum: integer("bab_num").notNull(),              // 1 s.d. 25
  wordOrder: integer("word_order").notNull(),        // 1 s.d. 60
  raw: text("raw").notNull(),
  kanji: text("kanji"),
  hiragana: text("hiragana").notNull(),
  romaji: text("romaji"),
  arti: text("arti").notNull(),
  kategori: text("kategori"),
  kategoriJp: text("kategori_jp"),
  contoh: text("contoh"),
  contohArti: text("contoh_arti"),
});

export const userVocabularyProgress = pgTable("user_vocabulary_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  vocabularyId: text("vocabulary_id").notNull().references(() => vocabulary.id, { onDelete: "cascade" }),
  isMemorized: boolean("is_memorized").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // UNIQUE INDEX untuk toggle checklist hafalan kata:
  userVocabUniqueIdx: uniqueIndex("user_vocab_unique_idx").on(table.userId, table.vocabularyId),
}));

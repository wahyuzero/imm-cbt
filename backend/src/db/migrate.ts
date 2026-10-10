import { client } from "./index.js";

export async function runMigrations() {
  console.log("Running PostgreSQL table migrations...");

  await client`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "username" TEXT UNIQUE NOT NULL,
      "display_username" TEXT,
      "email" TEXT UNIQUE NOT NULL,
      "email_verified" BOOLEAN DEFAULT false NOT NULL,
      "image" TEXT,
      "role" TEXT DEFAULT 'student' NOT NULL,
      "class_name" TEXT,
      "banned" BOOLEAN DEFAULT false NOT NULL,
      "ban_reason" TEXT,
      "ban_expires" TIMESTAMP,
      "created_at" TIMESTAMP DEFAULT now() NOT NULL,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" TEXT PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "token" TEXT UNIQUE NOT NULL,
      "expires_at" TIMESTAMP NOT NULL,
      "ip_address" TEXT,
      "user_agent" TEXT,
      "impersonated_by" TEXT,
      "created_at" TIMESTAMP DEFAULT now() NOT NULL,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "account" (
      "id" TEXT PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "account_id" TEXT NOT NULL,
      "provider_id" TEXT NOT NULL,
      "access_token" TEXT,
      "refresh_token" TEXT,
      "id_token" TEXT,
      "access_token_expires_at" TIMESTAMP,
      "refresh_token_expires_at" TIMESTAMP,
      "scope" TEXT,
      "password" TEXT,
      "created_at" TIMESTAMP DEFAULT now() NOT NULL,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "verification" (
      "id" TEXT PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expires_at" TIMESTAMP NOT NULL,
      "created_at" TIMESTAMP DEFAULT now() NOT NULL,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "system_settings" (
      "id" TEXT PRIMARY KEY DEFAULT 'default',
      "allow_registration" BOOLEAN DEFAULT true NOT NULL,
      "global_exam_lock" BOOLEAN DEFAULT false NOT NULL,
      "announcement" TEXT,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
      "updated_by" TEXT REFERENCES "user"("id")
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "chapters" (
      "chapter_num" TEXT PRIMARY KEY,
      "title_ja" TEXT NOT NULL,
      "title_id" TEXT NOT NULL,
      "theme_ja" TEXT,
      "theme_id" TEXT,
      "audio_src" TEXT,
      "pdf_soal_url" TEXT,
      "pdf_kunci_url" TEXT,
      "pdf_reading_soal_url" TEXT,
      "pdf_reading_kunci_url" TEXT,
      "reading_questions" INTEGER DEFAULT 25 NOT NULL,
      "choukai_questions" INTEGER DEFAULT 8 NOT NULL,
      "is_unlocked" BOOLEAN DEFAULT true NOT NULL,
      "exam_duration_minutes" INTEGER DEFAULT 60 NOT NULL,
      "passing_score" INTEGER DEFAULT 80 NOT NULL,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "questions" (
      "id" TEXT PRIMARY KEY,
      "chapter_num" TEXT NOT NULL REFERENCES "chapters"("chapter_num") ON DELETE CASCADE,
      "question_number" INTEGER NOT NULL,
      "session" TEXT NOT NULL,
      "section_ja" TEXT,
      "section_id" TEXT,
      "category" TEXT,
      "question_type" TEXT DEFAULT 'teks',
      "question_ja" TEXT NOT NULL,
      "question_ruby" TEXT,
      "question_romaji" TEXT,
      "question_id" TEXT,
      "image_url" TEXT,
      "audio_src" TEXT,
      "dialogue" JSONB,
      "options" JSONB NOT NULL,
      "correct_answer" TEXT NOT NULL,
      "explanation_summary" TEXT,
      "explanation_logic" TEXT,
      "explanation_distractor" TEXT,
      "explanation_grammar" TEXT
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "exam_sessions" (
      "id" TEXT PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "chapter_num" TEXT NOT NULL REFERENCES "chapters"("chapter_num"),
      "mode" TEXT DEFAULT 'renshuu' NOT NULL,
      "status" TEXT DEFAULT 'IN_PROGRESS' NOT NULL,
      "started_at" TIMESTAMP DEFAULT now() NOT NULL,
      "expires_at" TIMESTAMP NOT NULL,
      "submitted_at" TIMESTAMP,
      "time_spent_seconds" INTEGER DEFAULT 0,
      "reading_score" NUMERIC(5, 2) DEFAULT 0,
      "choukai_score" NUMERIC(5, 2) DEFAULT 0,
      "total_score" NUMERIC(5, 2) DEFAULT 0,
      "is_passed" BOOLEAN DEFAULT false
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "exam_answers" (
      "id" TEXT PRIMARY KEY,
      "session_id" TEXT NOT NULL REFERENCES "exam_sessions"("id") ON DELETE CASCADE,
      "question_id" TEXT NOT NULL REFERENCES "questions"("id") ON DELETE CASCADE,
      "selected_option" TEXT NOT NULL,
      "is_correct" BOOLEAN,
      "answered_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE UNIQUE INDEX IF NOT EXISTS "exam_answers_session_q_idx"
    ON "exam_answers" ("session_id", "question_id");
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "vocabulary" (
      "id" TEXT PRIMARY KEY,
      "bab_num" INTEGER NOT NULL,
      "word_order" INTEGER NOT NULL,
      "raw" TEXT NOT NULL,
      "kanji" TEXT,
      "hiragana" TEXT NOT NULL,
      "romaji" TEXT,
      "arti" TEXT NOT NULL,
      "kategori" TEXT,
      "kategori_jp" TEXT,
      "contoh" TEXT,
      "contoh_arti" TEXT
    );
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "user_vocabulary_progress" (
      "id" TEXT PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "vocabulary_id" TEXT NOT NULL REFERENCES "vocabulary"("id") ON DELETE CASCADE,
      "is_memorized" BOOLEAN DEFAULT true,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE UNIQUE INDEX IF NOT EXISTS "user_vocab_unique_idx"
    ON "user_vocabulary_progress" ("user_id", "vocabulary_id");
  `;

  await client`
    CREATE TABLE IF NOT EXISTS "user_chapter_access" (
      "id" TEXT PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "chapter_num" TEXT NOT NULL REFERENCES "chapters"("chapter_num") ON DELETE CASCADE,
      "is_allowed" BOOLEAN DEFAULT true NOT NULL,
      "updated_at" TIMESTAMP DEFAULT now() NOT NULL
    );
  `;

  await client`
    CREATE UNIQUE INDEX IF NOT EXISTS "user_chapter_access_user_ch_idx"
    ON "user_chapter_access" ("user_id", "chapter_num");
  `;

  console.log("PostgreSQL table migrations completed successfully.");
}

// Auto-run if executed directly via CLI
if (process.argv[1]?.endsWith("migrate.ts") || process.argv[1]?.endsWith("migrate.js")) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}

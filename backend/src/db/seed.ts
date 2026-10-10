import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { client } from "./index.js";
import { hashPassword } from "better-auth/crypto";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runSeeder() {
  console.log("Starting automated seeder for CBT IMM Japan...");

  // 1. Seed system_settings
  console.log("Seeding system_settings...");
  await client`
    INSERT INTO "system_settings" (
      "id", "allow_registration", "global_exam_lock", "announcement", "updated_at"
    ) VALUES (
      'default', true, false, 'Selamat datang di Platform CBT IMM Japan!', now()
    )
    ON CONFLICT ("id") DO NOTHING;
  `;

  // 2. Load data.js
  let dataJsPath = path.resolve(__dirname, "../../data/data.js");
  if (!fs.existsSync(dataJsPath)) {
    dataJsPath = path.resolve(process.cwd(), "data/data.js");
  }
  if (!fs.existsSync(dataJsPath)) {
    dataJsPath = path.resolve(process.cwd(), "../data.js");
  }

  console.log(`Loading chapters and questions from: ${dataJsPath}`);
  const dataJsContent = fs.readFileSync(dataJsPath, "utf8");
  const extractDataFn = new Function(dataJsContent + "\nreturn { CHAPTERS_INDEX, CHAPTERS_DATA };");
  const { CHAPTERS_INDEX, CHAPTERS_DATA } = extractDataFn();

  // 3. Seed chapters
  console.log(`Seeding ${CHAPTERS_INDEX.length} chapters...`);
  for (const item of CHAPTERS_INDEX) {
    const babData = CHAPTERS_DATA[item.num] || {};
    await client`
      INSERT INTO "chapters" (
        "chapter_num", "title_ja", "title_id", "theme_ja", "theme_id",
        "audio_src", "pdf_soal_url", "pdf_kunci_url", "pdf_reading_soal_url", "pdf_reading_kunci_url",
        "reading_questions", "choukai_questions", "is_unlocked", "exam_duration_minutes", "passing_score", "updated_at"
      ) VALUES (
        ${item.num},
        ${item.title_ja || ""},
        ${item.title_id || ""},
        ${item.theme_ja || babData.theme_ja || ""},
        ${item.theme_id || babData.theme_id || ""},
        ${babData.audioSrc || item.audioSrc || ""},
        ${item.pdfSoalUrl || babData.pdfSoalUrl || ""},
        ${item.pdfKunciUrl || babData.pdfKunciUrl || ""},
        ${item.pdfReadingSoalUrl || babData.pdfReadingSoalUrl || ""},
        ${item.pdfReadingKunciUrl || babData.pdfReadingKunciUrl || ""},
        ${babData.readingCount || 25},
        ${babData.choukaiCount || 8},
        true,
        60,
        ${babData.passingGrade || 80},
        now()
      )
      ON CONFLICT ("chapter_num") DO UPDATE SET
        "title_ja" = EXCLUDED."title_ja",
        "title_id" = EXCLUDED."title_id",
        "theme_ja" = EXCLUDED."theme_ja",
        "theme_id" = EXCLUDED."theme_id",
        "audio_src" = EXCLUDED."audio_src",
        "pdf_soal_url" = EXCLUDED."pdf_soal_url",
        "pdf_kunci_url" = EXCLUDED."pdf_kunci_url",
        "pdf_reading_soal_url" = EXCLUDED."pdf_reading_soal_url",
        "pdf_reading_kunci_url" = EXCLUDED."pdf_reading_kunci_url",
        "reading_questions" = EXCLUDED."reading_questions",
        "choukai_questions" = EXCLUDED."choukai_questions",
        "updated_at" = now();
    `;
  }

  // 4. Seed questions (769 questions total)
  console.log("Seeding questions across all 25 chapters...");
  let totalInsertedQuestions = 0;
  for (const [chapterNum, babData] of Object.entries(CHAPTERS_DATA as Record<string, any>)) {
    const questions = babData.questions || [];
    for (const q of questions) {
      const qId = `q_${chapterNum}_${String(q.id).padStart(2, "0")}`;
      await client`
        INSERT INTO "questions" (
          "id", "chapter_num", "question_number", "session",
          "section_ja", "section_id", "category", "question_type",
          "question_ja", "question_ruby", "question_romaji", "question_id",
          "image_url", "audio_src", "dialogue", "options", "correct_answer",
          "explanation_summary", "explanation_logic", "explanation_distractor", "explanation_grammar"
        ) VALUES (
          ${qId},
          ${chapterNum},
          ${q.id},
          ${q.session || "reading"},
          ${q.section_ja || ""},
          ${q.section_id || ""},
          ${q.category || ""},
          ${q.type || "teks"},
          ${q.question_ja || ""},
          ${q.question_ruby || ""},
          ${q.question_romaji || ""},
          ${q.question_id || ""},
          ${q.image || q.imageUrl || ""},
          ${q.audioSrc || ""},
          ${q.dialogue ? JSON.stringify(q.dialogue) : null},
          ${JSON.stringify(q.options || [])},
          ${String(q.correctAnswer)},
          ${q.explanation?.summary || ""},
          ${q.explanation?.logic || ""},
          ${q.explanation?.distractor || ""},
          ${q.explanation?.grammarRule || ""}
        )
        ON CONFLICT ("id") DO UPDATE SET
          "session" = EXCLUDED."session",
          "section_ja" = EXCLUDED."section_ja",
          "section_id" = EXCLUDED."section_id",
          "category" = EXCLUDED."category",
          "question_type" = EXCLUDED."question_type",
          "question_ja" = EXCLUDED."question_ja",
          "question_ruby" = EXCLUDED."question_ruby",
          "question_romaji" = EXCLUDED."question_romaji",
          "question_id" = EXCLUDED."question_id",
          "image_url" = EXCLUDED."image_url",
          "audio_src" = EXCLUDED."audio_src",
          "dialogue" = EXCLUDED."dialogue",
          "options" = EXCLUDED."options",
          "correct_answer" = EXCLUDED."correct_answer",
          "explanation_summary" = EXCLUDED."explanation_summary",
          "explanation_logic" = EXCLUDED."explanation_logic",
          "explanation_distractor" = EXCLUDED."explanation_distractor",
          "explanation_grammar" = EXCLUDED."explanation_grammar";
      `;
      totalInsertedQuestions++;
    }
  }
  console.log(`Successfully seeded ${totalInsertedQuestions} questions.`);

  // 5. Seed vocabulary (1.500 words total)
  let vocabJsPath = path.resolve(__dirname, "../../data/kosakata_data.js");
  if (!fs.existsSync(vocabJsPath)) {
    vocabJsPath = path.resolve(process.cwd(), "data/kosakata_data.js");
  }
  if (!fs.existsSync(vocabJsPath)) {
    vocabJsPath = path.resolve(process.cwd(), "../kosakata_data.js");
  }

  console.log(`Loading vocabulary from: ${vocabJsPath}`);
  const vocabJsContent = fs.readFileSync(vocabJsPath, "utf8");
  const extractVocabFn = new Function(vocabJsContent + "\nreturn { KOSAKATA_DATA };");
  const { KOSAKATA_DATA } = extractVocabFn();

  let totalInsertedVocab = 0;
  for (const [babKey, babObj] of Object.entries(KOSAKATA_DATA as Record<string, any>)) {
    const babNum = Number(babKey);
    const words = babObj.words || [];
    for (const w of words) {
      const vId = `vocab_${String(babNum).padStart(2, "0")}_${String(w.id).padStart(2, "0")}`;
      await client`
        INSERT INTO "vocabulary" (
          "id", "bab_num", "word_order", "raw", "kanji", "hiragana", "romaji",
          "arti", "kategori", "kategori_jp", "contoh", "contoh_arti"
        ) VALUES (
          ${vId},
          ${babNum},
          ${w.id},
          ${w.raw || ""},
          ${w.kanji || ""},
          ${w.hiragana || ""},
          ${w.romaji || ""},
          ${w.arti || ""},
          ${w.kategori || ""},
          ${w.kategori_jp || ""},
          ${w.contoh || ""},
          ${w.contoh_arti || ""}
        )
        ON CONFLICT ("id") DO UPDATE SET
          "raw" = EXCLUDED."raw",
          "kanji" = EXCLUDED."kanji",
          "hiragana" = EXCLUDED."hiragana",
          "romaji" = EXCLUDED."romaji",
          "arti" = EXCLUDED."arti",
          "kategori" = EXCLUDED."kategori",
          "kategori_jp" = EXCLUDED."kategori_jp",
          "contoh" = EXCLUDED."contoh",
          "contoh_arti" = EXCLUDED."contoh_arti";
      `;
      totalInsertedVocab++;
    }
  }
  console.log(`Successfully seeded ${totalInsertedVocab} vocabulary items.`);

  // 6. Seed Default Users: Admin (sensei.wahyu) & Siswa (ahmad.syahroni)
  console.log("Seeding default accounts (Admin: sensei.wahyu & Student: ahmad.syahroni)...");
  const hashedPin = await hashPassword("123456");

  const defaultUsers = [
    {
      id: "usr_admin_sensei_wahyu",
      name: "Sensei Wahyu",
      username: "sensei.wahyu",
      displayUsername: "sensei.wahyu",
      email: "sensei.wahyu@imm.internal",
      role: "admin",
      className: "Instruktur LPK",
      pin: "123456",
    },
    {
      id: "usr_student_ahmad_syahroni",
      name: "Ahmad Syahroni",
      username: "ahmad.syahroni",
      displayUsername: "ahmad.syahroni",
      email: "ahmad.syahroni@imm.internal",
      role: "student",
      className: "Angkatan 35-A",
      pin: "123456",
    },
  ];

  for (const u of defaultUsers) {
    // Upsert User
    await client`
      INSERT INTO "user" (
        "id", "name", "username", "display_username", "email",
        "email_verified", "role", "class_name", "banned", "created_at", "updated_at"
      ) VALUES (
        ${u.id}, ${u.name}, ${u.username}, ${u.displayUsername}, ${u.email},
        true, ${u.role}, ${u.className}, false, now(), now()
      )
      ON CONFLICT ("username") DO UPDATE SET
        "name" = EXCLUDED."name",
        "email" = EXCLUDED."email",
        "role" = EXCLUDED."role",
        "class_name" = EXCLUDED."class_name",
        "updated_at" = now();
    `;

    // Upsert Credential Account for Better Auth
    const accountId = `acc_${u.username}`;
    await client`
      INSERT INTO "account" (
        "id", "user_id", "account_id", "provider_id", "password", "created_at", "updated_at"
      ) VALUES (
        ${accountId}, ${u.id}, ${u.id}, 'credential', ${hashedPin}, now(), now()
      )
      ON CONFLICT ("id") DO UPDATE SET
        "password" = EXCLUDED."password",
        "updated_at" = now();
    `;
  }

  console.log("Seeding completed successfully!");
}

// Auto-run if executed directly via CLI
if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  runSeeder()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeder failed:", err);
      process.exit(1);
    });
}

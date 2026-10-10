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

  // 6. Reset old users and Seed Official Accounts (2 Sensei + 17 Students)
  await resetAndSeedOfficialAccounts();

  console.log("Seeding completed successfully!");
}

export const INITIAL_USERS = [
  // Sensei / Pengawas (Admin)
  {
    id: "usr_sensei_rusdi",
    name: "Sensei Rusdi",
    username: "sensei.rusdi",
    displayUsername: "sensei.rusdi",
    email: "rusdi@imm.internal",
    role: "admin",
    className: "Instruktur LPK",
    password: "[REDACTED]",
  },
  {
    id: "usr_sensei_test",
    name: "Sensei Test",
    username: "sensei.test",
    displayUsername: "sensei.test",
    email: "test@imm.internal",
    role: "admin",
    className: "Sensei Penguji",
    password: "[REDACTED]",
  },

  // 17 Siswa (Student - Angkatan 35-A)
  {
    id: "usr_nafisatun",
    name: "Nafisatun",
    username: "nafisatun",
    displayUsername: "nafisatun",
    email: "nafisatun@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_santi",
    name: "Santi",
    username: "santi",
    displayUsername: "santi",
    email: "santi@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_stefanni_haryanto",
    name: "Stefanni Haryanto",
    username: "stefanni.haryanto",
    displayUsername: "stefanni.haryanto",
    email: "stefanni.haryanto@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_heru_prayoga",
    name: "Heru Prayoga",
    username: "heru.prayoga",
    displayUsername: "heru.prayoga",
    email: "heru.prayoga@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_fikri_muzakki",
    name: "Fikri Muzakki",
    username: "fikri.muzakki",
    displayUsername: "fikri.muzakki",
    email: "fikri.muzakki@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_wahyu_jaka",
    name: "Wahyu Jaka Permadi",
    username: "wahyu.jaka",
    displayUsername: "wahyu.jaka",
    email: "wahyu.jaka@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_andre_ananta",
    name: "Andre Ananta Wianddin",
    username: "andre.ananta",
    displayUsername: "andre.ananta",
    email: "andre.ananta@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_andi_saputra",
    name: "Andi Saputra",
    username: "andi.saputra",
    displayUsername: "andi.saputra",
    email: "andi.saputra@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_candra_afiansah",
    name: "Candra Afiansah",
    username: "candra.afiansah",
    displayUsername: "candra.afiansah",
    email: "candra.afiansah@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_syarifudin_asyrof",
    name: "Syarifudin Asyrof",
    username: "syarifudin.asyrof",
    displayUsername: "syarifudin.asyrof",
    email: "syarifudin.asyrof@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_andre_purnomo",
    name: "Andre Purnomo",
    username: "andre.purnomo",
    displayUsername: "andre.purnomo",
    email: "andre.purnomo@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_desi_wiyanti",
    name: "Desi Wiyanti",
    username: "desi.wiyanti",
    displayUsername: "desi.wiyanti",
    email: "desi.wiyanti@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_aprilianzah",
    name: "Aprilianzah",
    username: "aprilianzah",
    displayUsername: "aprilianzah",
    email: "aprilianzah@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_farrel_ardiansyah",
    name: "Muhammad Farrel Ardiansyah",
    username: "farrel.ardiansyah",
    displayUsername: "farrel.ardiansyah",
    email: "farrel.ardiansyah@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_hayyu_pradana",
    name: "Hayyu Alunafa Pradana",
    username: "hayyu.pradana",
    displayUsername: "hayyu.pradana",
    email: "hayyu.pradana@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_ahmad_choirul",
    name: "Ahmad Choirul Muallif",
    username: "ahmad.choirul",
    displayUsername: "ahmad.choirul",
    email: "ahmad.choirul@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
  {
    id: "usr_hamdani_lubis",
    name: "Hamdani Lubis",
    username: "hamdani.lubis",
    displayUsername: "hamdani.lubis",
    email: "hamdani.lubis@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: "[REDACTED]",
  },
];

export async function resetAndSeedOfficialAccounts(forcePurge = false) {
  // Check if legacy users exist (sensei.wahyu or ahmad.syahroni) or if sensei.rusdi is missing
  const oldUsers = await client`SELECT count(*)::int as count FROM "user" WHERE "username" IN ('sensei.wahyu', 'ahmad.syahroni');`;
  const newAdmin = await client`SELECT count(*)::int as count FROM "user" WHERE "username" = 'sensei.rusdi';`;

  const needsPurge = forcePurge || oldUsers[0]?.count > 0 || newAdmin[0]?.count === 0;

  if (needsPurge) {
    console.log("Purging old user accounts and recreating clean slate with official 19 users...");
    // Clear foreign key reference from system_settings before purging users
    await client`UPDATE "system_settings" SET "updated_by" = NULL;`;
    // Deleting all users cascades to account, session, exam_sessions, and user_chapter_access
    await client`DELETE FROM "user";`;
  } else {
    console.log("Official user schema already active. Upserting accounts...");
  }

  for (const u of INITIAL_USERS) {
    const hashedPw = await hashPassword(u.password);

    await client`
      INSERT INTO "user" (
        "id", "name", "username", "display_username", "email",
        "email_verified", "role", "class_name", "pdf_access_allowed", "banned", "created_at", "updated_at"
      ) VALUES (
        ${u.id}, ${u.name}, ${u.username}, ${u.displayUsername}, ${u.email},
        true, ${u.role}, ${u.className}, true, false, now(), now()
      )
      ON CONFLICT ("username") DO UPDATE SET
        "name" = EXCLUDED."name",
        "email" = EXCLUDED."email",
        "role" = EXCLUDED."role",
        "class_name" = EXCLUDED."class_name",
        "pdf_access_allowed" = EXCLUDED."pdf_access_allowed",
        "updated_at" = now();
    `;

    const accountId = `acc_${u.username}`;
    await client`
      INSERT INTO "account" (
        "id", "user_id", "account_id", "provider_id", "password", "created_at", "updated_at"
      ) VALUES (
        ${accountId}, ${u.id}, ${u.id}, 'credential', ${hashedPw}, now(), now()
      )
      ON CONFLICT ("id") DO UPDATE SET
        "password" = EXCLUDED."password",
        "updated_at" = now();
    `;
  }
  console.log(`Successfully prepared ${INITIAL_USERS.length} official accounts.`);
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

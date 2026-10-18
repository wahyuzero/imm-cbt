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

  // 6. Ensure Official Accounts (2 Sensei + 17 Students) — non-destructive (BUG-14/BUG-23)
  await resetAndSeedOfficialAccounts();

  console.log("Seeding completed successfully!");
}

function loadCredentialMap(): Record<string, string> {
  const map: Record<string, string> = {};
  const credPaths = [
    process.env.CREDENTIALS_FILE,
    "/home/wxsys/Jepun/credentials/user_password.txt",
    path.resolve(process.cwd(), "credentials/user_password.txt"),
    path.resolve(process.cwd(), "../credentials/user_password.txt"),
    path.resolve(process.cwd(), "../../credentials/user_password.txt"),
  ].filter(Boolean) as string[];

  for (const cp of credPaths) {
    if (fs.existsSync(cp)) {
      try {
        const lines = fs.readFileSync(cp, "utf8").split("\n");
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 2) {
            map[parts[0]] = parts[1];
          }
        }
        break;
      } catch (e) {
        // ignore
      }
    }
  }
  return map;
}

const CREDENTIAL_MAP = loadCredentialMap();
const getPassword = (username: string) => {
  return (
    CREDENTIAL_MAP[username] ||
    process.env[`PASSWORD_${username.toUpperCase().replace(/\./g, "_")}`] ||
    process.env.DEFAULT_SEED_PASSWORD ||
    "ImmCbt2026!"
  );
};

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
    password: getPassword("sensei.rusdi"),
  },
  {
    id: "usr_sensei_test",
    name: "Sensei Test",
    username: "sensei.test",
    displayUsername: "sensei.test",
    email: "test@imm.internal",
    role: "admin",
    className: "Sensei Penguji",
    password: getPassword("sensei.test"),
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
    password: getPassword("nafisatun"),
  },
  {
    id: "usr_santi",
    name: "Santi",
    username: "santi",
    displayUsername: "santi",
    email: "santi@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("santi"),
  },
  {
    id: "usr_stefanni_haryanto",
    name: "Stefanni Haryanto",
    username: "stefanni.haryanto",
    displayUsername: "stefanni.haryanto",
    email: "stefanni.haryanto@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("stefanni.haryanto"),
  },
  {
    id: "usr_heru_prayoga",
    name: "Heru Prayoga",
    username: "heru.prayoga",
    displayUsername: "heru.prayoga",
    email: "heru.prayoga@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("heru.prayoga"),
  },
  {
    id: "usr_fikri_muzakki",
    name: "Fikri Muzakki",
    username: "fikri.muzakki",
    displayUsername: "fikri.muzakki",
    email: "fikri.muzakki@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("fikri.muzakki"),
  },
  {
    id: "usr_wahyu_jaka",
    name: "Wahyu Jaka Permadi",
    username: "wahyu.jaka",
    displayUsername: "wahyu.jaka",
    email: "wahyu.jaka@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("wahyu.jaka"),
  },
  {
    id: "usr_andre_ananta",
    name: "Andre Ananta Wianddin",
    username: "andre.ananta",
    displayUsername: "andre.ananta",
    email: "andre.ananta@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("andre.ananta"),
  },
  {
    id: "usr_andi_saputra",
    name: "Andi Saputra",
    username: "andi.saputra",
    displayUsername: "andi.saputra",
    email: "andi.saputra@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("andi.saputra"),
  },
  {
    id: "usr_candra_afiansah",
    name: "Candra Afiansah",
    username: "candra.afiansah",
    displayUsername: "candra.afiansah",
    email: "candra.afiansah@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("candra.afiansah"),
  },
  {
    id: "usr_syarifudin_asyrof",
    name: "Syarifudin Asyrof",
    username: "syarifudin.asyrof",
    displayUsername: "syarifudin.asyrof",
    email: "syarifudin.asyrof@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("syarifudin.asyrof"),
  },
  {
    id: "usr_andre_purnomo",
    name: "Andre Purnomo",
    username: "andre.purnomo",
    displayUsername: "andre.purnomo",
    email: "andre.purnomo@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("andre.purnomo"),
  },
  {
    id: "usr_desi_wiyanti",
    name: "Desi Wiyanti",
    username: "desi.wiyanti",
    displayUsername: "desi.wiyanti",
    email: "desi.wiyanti@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("desi.wiyanti"),
  },
  {
    id: "usr_aprilianzah",
    name: "Aprilianzah",
    username: "aprilianzah",
    displayUsername: "aprilianzah",
    email: "aprilianzah@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("aprilianzah"),
  },
  {
    id: "usr_farrel_ardiansyah",
    name: "Muhammad Farrel Ardiansyah",
    username: "farrel.ardiansyah",
    displayUsername: "farrel.ardiansyah",
    email: "farrel.ardiansyah@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("farrel.ardiansyah"),
  },
  {
    id: "usr_hayyu_pradana",
    name: "Hayyu Alunafa Pradana",
    username: "hayyu.pradana",
    displayUsername: "hayyu.pradana",
    email: "hayyu.pradana@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("hayyu.pradana"),
  },
  {
    id: "usr_ahmad_choirul",
    name: "Ahmad Choirul Muallif",
    username: "ahmad.choirul",
    displayUsername: "ahmad.choirul",
    email: "ahmad.choirul@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("ahmad.choirul"),
  },
  {
    id: "usr_hamdani_lubis",
    name: "Hamdani Lubis",
    username: "hamdani.lubis",
    displayUsername: "hamdani.lubis",
    email: "hamdani.lubis@imm.internal",
    role: "student",
    className: "Angkatan 35-A",
    password: getPassword("hamdani.lubis"),
  },
];

export async function resetAndSeedOfficialAccounts(forcePurge = false) {
  // BUG-14: jalur purge destruktif (DELETE FROM "user" + cek user legacy) dihapus total.
  // Parameter forcePurge dipertahankan demi kompatibilitas pemanggil lama (route admin),
  // tetapi tidak lagi melakukan penghapusan massal apa pun.
  if (forcePurge) {
    console.warn(
      "resetAndSeedOfficialAccounts: permintaan purge diterima namun dinonaktifkan (BUG-14). " +
        "Tidak ada user yang dihapus; hanya memastikan akun resmi hadir."
    );
  }

  // Bootstrap admin: hitung admin yang ada; bila nol, loop di bawah akan INSERT
  // admin default (ON CONFLICT DO NOTHING) tanpa menghapus siapa pun.
  const adminCount = await client`SELECT count(*)::int as count FROM "user" WHERE "role" = 'admin';`;
  if ((adminCount[0]?.count ?? 0) === 0) {
    console.log("No admin account found. Bootstrapping default sensei accounts (non-destructive)...");
  } else {
    console.log(`Found ${adminCount[0]?.count} admin account(s). Ensuring seed users without overwriting edits...`);
  }

  for (const u of INITIAL_USERS) {
    // BUG-14: ON CONFLICT DO NOTHING — baris user yang sudah ada dipertahankan apa
    // adanya (role, email, class_name, pdf_access_allowed hasil edit sensei tidak
    // ditimpa); nilai seed hanya berlaku untuk baris baru. Tanpa target konflik
    // eksplisit agar benturan unik username/email/id sama-sama tidak melempar error.
    await client`
      INSERT INTO "user" (
        "id", "name", "username", "display_username", "email",
        "email_verified", "role", "class_name", "pdf_access_allowed", "banned", "created_at", "updated_at"
      ) VALUES (
        ${u.id}, ${u.name}, ${u.username}, ${u.displayUsername}, ${u.email},
        true, ${u.role}, ${u.className}, ${u.role === "admin"}, false, now(), now()
      )
      ON CONFLICT DO NOTHING;
    `;

    // BUG-23: id aktual user bisa berbeda dari id seed (mis. username seeded pernah
    // dihapus lalu diregistrasi ulang → id baru). Resolve id aktual via username
    // sebelum membuat account agar tidak melanggar FK.
    const userRows = await client`SELECT "id" FROM "user" WHERE "username" = ${u.username} LIMIT 1;`;
    const actualUserId = userRows[0]?.id;
    if (!actualUserId) {
      console.warn(`Seeder: user "${u.username}" tidak ditemukan setelah upsert — akun credential dilewati.`);
      continue;
    }

    // Hanya isi akun credential bila user belum memilikinya — mencegah akun ganda
    // yang membuat lookup password better-auth ambigu pada user hasil re-registrasi.
    const existingAccount = await client`
      SELECT "id" FROM "account" WHERE "user_id" = ${actualUserId} AND "provider_id" = 'credential' LIMIT 1;
    `;
    if (existingAccount.length > 0) {
      continue;
    }

    const hashedPw = await hashPassword(u.password);
    const accountId = `acc_${u.username}`;
    // Kunci konflik account di schema hanya PK "id" (tidak ada unique index
    // provider_id+account_id), jadi ON CONFLICT ("id") DO NOTHING dengan id
    // deterministik acc_<username> sudah menjadikan boot berulang idempoten.
    await client`
      INSERT INTO "account" (
        "id", "user_id", "account_id", "provider_id", "password", "created_at", "updated_at"
      ) VALUES (
        ${accountId}, ${actualUserId}, ${actualUserId}, 'credential', ${hashedPw}, now(), now()
      )
      ON CONFLICT ("id") DO NOTHING;
    `;
  }
  console.log(`Successfully ensured ${INITIAL_USERS.length} official accounts (non-destructive).`);
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

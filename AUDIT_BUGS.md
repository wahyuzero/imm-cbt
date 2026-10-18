# AUDIT BUG TЕРKONFIRMASI — Choukai_Web (IMM Japan CBT Lab)

Tanggal audit: 2026-10-11 · Commit: 5a9a164 · Metode: baca kode penuh (app.js 5.857 baris, backend ~3.000 baris TS), skrip validasi data (769 soal, 1.804 kosakata), simulasi Node untuk bukti runtime, verifikasi silang 3 agen audit independen.

---

> ## ✅ STATUS REMEDIASI (2026-10-18) — 26/26 BUG DIPERBAIKI DI KODE
>
> Dieksekusi orkestrasi multi-agen (7 agen paralel + verifikasi build + QA silang 2 ronde, 14 agen total) di atas audit 2026-10-11. Verifikasi akhir: `node --check app.js` bersih, `tsc --noEmit` bersih, `build_public_data.js` menghasilkan 769 soal / 25 bab dengan 0 kunci bocor, `git fsck` sehat.
>
> | Bug | Status | Bug | Status | Bug | Status |
> |---|---|---|---|---|---|
> | 01 ID rusak shiken server | ✅ fixed (normalisasi `_dbId` + kutip onclick) | 10 rate-limit bypass XFF | ✅ fixed (X-Real-IP + koreksi hop privat) | 19 data loss progress lokal | ✅ fixed (merge-preserving) |
> | 02 field backend≠frontend | ✅ fixed (mapping ke bentuk lokal) | 11 stored XSS panel sensei | ✅ fixed (escapeHtml/escapeAttr + sanitasi backend) | 20 XSS reflektif pencarian | ✅ fixed (escapeAttr) |
> | 03 kunci 769 soal ke browser | ✅ fixed (Docker multi-stage + data.js steril + guard build) | 12 bypass login offline | ✅ fixed (wajib verifikasi mock store) | 21 answer lintas bab | ✅ fixed (scope chapterNum) |
> | 04 rahasia hardcoded | ✅ fixed kode + history rewrite LOKAL (lihat tindakan operasional) | 13 default PDF terbalik | ✅ fixed (+data migration existing students) | 22 validasi input minim | ✅ fixed (regex opsi/pin/username) |
> | 05 crash score null | ✅ fixed (null-safe + entri legacy null = pending) | 14 seeder destruktif | ✅ fixed (tanpa DELETE FROM user; user upsert DO NOTHING) | 23 FK edge seeder account | ✅ fixed (resolve id aktual) |
> | 06 crash tombol Hasil | ✅ fixed (guard r.answers + notice server) | 15 submit abaikan expiresAt | ✅ fixed (finalisasi EXPIRED) | 24 jebakan nginx location | ✅ fixed (^~ /api/) |
> | 07 statistik 0 benar | ✅ fixed (server-graded seragam, salin counts) | 16 race double-submit | ✅ fixed (_isSubmitting + modal ditutup) | 25 Tailwind CDN | ✅ fixed (vendored 407KB lokal) |
> | 08 spinner selamanya | ✅ fixed (+retry lintas tab via pendingSessionId) | 17 logout tak bersih | ✅ fixed (timer/audio/autoNext/state) | 26 filter kategori kosakata | ✅ fixed (dinamis dari data, 20 kategori) |
> | 09 oracle isCorrect | ✅ fixed (strip saat IN_PROGRESS) | 18 localStorage bocor | ✅ fixed (namespace per-user + reset marker admin) | | |
>
> **Arsitektur kunci yang berubah:** (1) `safeQuestions` backend dinormalisasi ke bentuk lokal (`id` numerik + `_dbId`) di `startExam`; (2) semua mode HTTP kini **server-graded** — `data.js` di image Docker disterilkan dari kunci/pembahasan via `scripts/build_public_data.js` + guard gagal-build bila bocor; (3) progress lokal merge-preserving + marker `resultsResetAt` sinkron reset admin; (4) localStorage namespaced per-user (`choukai_progress__<username>` dst.); (5) rate limiter sadar-topologi-proxy (traefik→nginx→backend).
>
> ### ⚠️ TINDAKAN OPERASIONAL YANG MASIH WAJIB (di luar repo, tidak bisa dikerjakan agen)
> 1. **BUG-04:** riwayat git lokal sudah ditulis ulang (kredensial lama hilang dari `rev-list --all`, fsck bersih), TAPI remote GitHub `origin/master` MASIH memuat commit lama yang bisa diunduh publik → wajib `git push --force origin master`, purge cache/fork GitHub (via Support), lalu **rotasi password DB di server live + regenerasi BETTER_AUTH_SECRET** (nilai lama dianggap compromised).
> 2. **BUG-10 (limitasi terdokumentasi):** bila SELURUH hop XFF privat (klien NAT yang men-stamp IP privat), bucket rate-limit bisa bersama → 429 massal; topologi proxy tercatat di komentar `rateLimiter.ts`.
> 3. **BUG-25:** `assets/vendor/tailwindcdn.js` adalah snapshot Play CDN — upgrade Tailwind major harus re-vendor manual.

Status tiap butir: ✅ = terkonfirmasi lewat bukti kode + verifikasi silang (bukan spekulasi).

---

## 🔴 KRITIS

### BUG-01 ✅ Kontrak ID soal rusak total di mode Shiken server (siswa via HTTP) — jawaban tak pernah tersimpan, skor pasti 0
- **Lokasi:** `app.js:2112` (onclick), `app.js:1013-1014` (dbQId), `backend/src/routes/exam.ts:117` (safeQuestions), `backend/src/db/seed.ts:88` (format ID DB).
- **Kode:**
  - app.js:2112 → `onclick="window.app.selectOption(${q.id}, '${opt.id}')"` — `q.id` **tanpa tanda kutip**.
  - app.js:1013 → `` const dbQId = `q_${chNum}_${String(questionId).padStart(2, "0")}` ``
  - seed.ts:88 → ID DB = string `"q_08_05"`.
- **Mekanisme kegagalan (dibuktikan runtime via Node):**
  1. Siswa (non-admin) mulai ujian shiken via HTTP → `app.js:982` mengganti `currentChapter.questions` dengan `safeQuestions` backend yang `id`-nya string `"q_08_05"`.
  2. Render menghasilkan `onclick="window.app.selectOption(q_08_05, 'A')"` → klik tombol opsi = **ReferenceError: q_08_05 is not defined** → jawaban tidak terpilih.
  3. Jalur keyboard (app.js:1346) memanggil `selectOption("q_08_05", ...)` → `dbQId = "q_08_q_08_05"` → `POST /api/v1/exam/answer` balas **404 "ID Soal tidak valid"** → error ditelan diam-diam (handler hanya alert untuk "dibatasi"/TERMINATED).
  4. Submit → server menghitung dari `exam_answers` yang kosong → **skor 0 untuk semua siswa**.
- **Kenanya hanya siswa:** admin tidak menjalani penggantian questions (kondisi `role !== "admin"`), ID tetap numerik lokal → jalur admin/E2E test normal, sehingga bug tersembunyi dari pengujian dev.
- **Perbaikan:** kutip argumen onclick (`'${q.id}'`), hapus rekonstruksi dbQId (pakai `q.id` apa adanya), atau normalisasi `safeQuestions` ke bentuk lokal.

### BUG-02 ✅ Nama field backend ≠ frontend — teks soal & gambar KOSONG di mode Shiken siswa
- **Lokasi:** `app.js:2040-2130` (renderer ujian) vs `exam.ts` safeQuestions.
- **Pemetaan rusak:** frontend memakai `q.question_ja`, `q.question_ruby`, `q.image`, `q.type` — backend mengirim `questionJa`, `questionRuby`, `imageUrl`, `questionType`. `options`, `audioSrc`, `dialogue`, `session` cocok.
- **Dampak:** siswa shiken HTTP melihat soal tanpa teks (undefined) dan soal bergambar tanpa gambar; furigana mati. Ujian tidak dapat dikerjakan bermakna.
- **Diverifikasi:** grep pemakaian field di blok renderer vs daftar field safeQuestions.

### BUG-03 ✅ Seluruh kunci jawaban (769 butir) dikirim ke browser — anti-cheat backend sia-sia
- **Lokasi:** `index.html:121` (`<script src="data.js?v=62">`), `Dockerfile:3` (COPY semua), `.dockerignore` tidak mengecualikan `data.js`.
- **Bukti:** `grep -c correctAnswer data.js` = **769**.
- **Dampak:** siswa buka DevTools → Sources → data.js → kunci semua bab terbaca. Komentar exam.ts "correctAnswer omitted for integrity!" jadi tidak bermakna.

### BUG-04 ✅ Rahasia otentikasi hardcoded + kredensial produksi ter-commit di repo
- **Lokasi:** `backend/src/lib/auth.ts:61` (`secret: process.env.BETTER_AUTH_SECRET || "***REMOVED-AUTH-SECRET***"`), `backend/src/db/index.ts:8` & `drizzle.config.ts:6` (fallback `postgres://imm_admin:***REMOVED-DB-PASSWORD***@...`), `backend/.env.example` (TER-COMMIT via `git ls-files`, berisi nilai yang sama + host Coolify nyata `postgres-hack-primary-circuit-j3epky` + domain `imm.frugaldev.biz.id`).
- **Dampak:** jika env var tidak terisi saat deploy, session cookie ditandatangani konstanta publik → siapa pun yang membaca repo bisa memalsukan session **admin**. Kredensial DB produksi ikut tersebar di riwayat git.

### BUG-05 ✅ Dashboard crash `TypeError` ketika entri progress bernilai `score: null`
- **Lokasi:** `app.js:1673` (`prog.score.toFixed(0)`), `app.js:1669` (`totalScoreSum += prog.score`), `app.js:1811` (rata-rata), sumber null: `app.js:1156` (`score: isServerShiken ? null : totalScore`).
- **Skenario:** siswa submit shiken server lalu kembali ke dashboard sebelum `/api/v1/exam/submit` merespons (atau setelah gagal — lihat BUG-08) → localStorage menyimpan `score: null` → render dashboard melempar `null.toFixed(0)` → **seluruh dashboard blank/crash** hingga localStorage dibersihkan manual.

### BUG-06 ✅ Tombol "Hasil" crash — progress versi-server tidak punya field `answers`
- **Lokasi:** `app.js:3097-3107` (`fetchChaptersStatus` menimpa progress bentuk server-lite: hanya chapter/score/readingScore/choukaiScore/passed), `app.js:2192` (`qList.filter((q) => r.answers[q.id] !== q.correctAnswer)`).
- **Dampak:** setiap siswa HTTP yang skornya disinkronkan server → klik "Hasil" → `TypeError: Cannot read properties of undefined (reading ...)` → tampilan hasil tidak pernah muncul.

---

## 🟠 TINGGI

### BUG-07 ✅ Statistik hasil selalu "0 benar" di shiken server — angka salah disimpan permanen
- **Lokasi:** `app.js:908-919` (strip `correctAnswer` anti-cheat) vs `app.js:1126-1136` (grading lokal tetap dijalankan) vs `app.js:1201-1206` (respons server hanya menimpa skor, BUKAN `readingCorrect/choukaiCorrect/correctCount`).
- **Dampak:** hasil ujian menampilkan "Total Benar: 0 dari 33" walau skor server 100/100; angka 0 ikut tersimpan ke localStorage & laporan.

### BUG-08 ✅ Submit server gagal → spinner "Memeriksa Lembar Ujian..." selamanya
- **Lokasi:** `app.js:1226-1228` (`catch` hanya `console.warn`, tidak mereset `isGrading`/fallback skor), `app.js:1186` (`if (!activeSession) return;` — tercapai saat `/exam/start` sebelumnya gagal karena `.catch`-nya mengembalikan null sementara `startExamPromise` tetap truthy).
- **Dampak turunan:** `shareResultWhatsApp()` (app.js:1269-1276) memanggil `r.readingScore.toFixed(1)` pada null → TypeError (crash tombol kirim nilai).

### BUG-09 ✅ Oracle kebenaran real-time saat ujian berjalan — skor 100 tanpa ilmu bahasa
- **Lokasi:** `backend/src/routes/exam.ts:375-397` (`GET /exam/sessions/:id` mengembalikan baris `exam_answers` mentah berisi `isCorrect` **tanpa gate status IN_PROGRESS**) + `/exam/answer` menyimpan `isCorrect` per jawaban.
- **Eksploitasi:** jawab opsi A → GET session → baca `isCorrect` → jika salah ganti B/C/D → maksimal 4 request per soal = skor sempurna.

### BUG-10 ✅ Rate limiter dapat dilewati total — brute-force PIN tanpa hambatan
- **Lokasi:** `backend/src/middlewares/rateLimiter.ts:23-25` (key = `X-Forwarded-For` entri PERTAMA = dikontrol klien), `nginx.conf:19` (`$proxy_add_x_forwarded_for` menambah remote_addr di belakang → entri pertama tetap milik klien), `backend/src/lib/auth.ts:20-23` (rateLimit Better Auth **dinonaktifkan**).
- **Dampak:** kirim header `X-Forwarded-For: <acak>` per request → bucket baru terus → limit 120/menit & 60/menit lolos → PIN 6 digit (default reset "123456") di-brute-force bebas.

### BUG-11 ✅ Stored XSS di Panel Sensei via nama/username/className registrasi
- **Lokasi sink (render tanpa escape):** `app.js:3664` (`${u.name}` di daftar user admin), `app.js:3516` & `4520` (`${s.studentName}`/`${r.studentName}` monitoring & hasil), `app.js:5360`; sumber: `backend/src/routes/auth.ts:88` (`name: String(name).trim()` — tanpa sanitasi/karakter terbatas), `username` juga tanpa restriksi charset (auth.ts:56-58 hanya cek panjang).
- **Dampak:** siswa mendaftar dengan nama `<img src=x onerror="...">` → skrip jalan di sesi admin (escalation siswa→admin). Bonus: `app.js:3676` hanya escape `'` di atribut onclick — `"` pada nama memecah atribut HTML.

### BUG-12 ✅ Auth bypass mode offline (file://) — password apa pun ≥ 4 karakter
- **Lokasi:** `app.js:3288-3289` — `if (foundOfficial && p.length >= 4)` — password **tidak pernah dibandingkan**, hanya panjangnya.
- **Dampak:** di lab yang menjalankan web dari file://, siapa pun login sebagai `sensei.rusdi`/`sensei.test` (admin) dengan password "1234" → kontrol penuh panel lokal.

---

## 🟡 SEDANG

### BUG-13 ✅ Default akses PDF terbalik antar 3 file — siswa baru mendapat semua PDF
- **Lokasi:** `backend/src/db/migrate.ts:208,212` (`BOOLEAN DEFAULT true NOT NULL`) vs `backend/src/db/schema.ts:16,142` (`.default(false)` + komentar "Hanya Sensei") vs `backend/src/lib/auth.ts:52` (`defaultValue: true`).
- **Mekanisme:** `register-student` INSERT tanpa kolom `pdf_access_allowed` → default DB (true) yang berlaku, bukan default schema (false) → semua siswa self-register lolos unduh PDF semua bab.

### BUG-14 ✅ Auto-seeder tiap boot: menimpa konfigurasi admin & berpotensi menghapus SELURUH data ujian
- **Lokasi:** `backend/src/index.ts:93-100` (migrate+seed tiap start kecuali AUTO_MIGRATE="false"), `backend/src/db/seed.ts:447-483`.
- **Skenario A (rutin):** Sensei mengubah role/kelas/PDF-toggle akun seeded → restart container → upsert seeder mengembalikan nilai awal (kolom `role,email,class_name,pdf_access_allowed` di-ON CONFLICT UPDATE).
- **Skenario B (destruktif):** admin menghapus user `sensei.rusdi` lewat panel → boot berikutnya `newAdmin.count === 0` → `DELETE FROM "user"` **menyapu semua user + cascade seluruh exam_sessions/exam_answers/user_chapter_access**.

### BUG-15 ✅ `/exam/submit` tidak memeriksa `expiresAt`/status EXPIRED
- **Lokasi:** `backend/src/routes/exam.ts:245-372` — `expiresAt` hanya dipakai di `/exam/answer` (baris 201), tidak di submit; gate hanya `SUBMITTED | TERMINATED_BY_ADMIN`.
- **Dampak:** sesi kadaluarsa difinalisasi jadi `SUBMITTED` bernilai; monitoring admin menandai baris yang sama `isExpired` — gradebook inkonsisten.

### BUG-16 ✅ Race double-submit ujian (tanpa guard) + modal konfirmasi tak tertutup saat auto-submit timer
- **Lokasi:** `app.js:1177-1187` — `submitExam()` tak punya flag `_isSubmitting`; saat `currentExamSession` masih null (start pending), body async menunggu `startExamPromise` SEBELUM meng-nulkan-nya → `submitExam()` kedua (timer habis + tombol "Ya, Kumpulkan") masuk lagi ke cabang server → dua POST `/exam/submit` dengan sessionId sama. Idempoten di sisi server (isAlreadyFinalized) sehingga dampak terbatas, tapi modal `confirm_submit` dibiarkan terbuka saat auto-submit membuat pemicu kedua mudah terjadi.

### BUG-17 ✅ `logout()` tidak menghentikan timer ujian/audio/auto-next
- **Lokasi:** `app.js:3343-3362` — tidak ada `clearInterval(this.timerInterval)` / `cancelAutoNext()` / `pauseAudio()` (bandingkan `goToDashboard()` yang membersihkan ketiganya).
- **Dampak:** logout di tengah ujian shiken → hitungan terus jalan → di layar login muncul `alert("Waktu ujian telah berakhir!...")` → hasil disimpan & dirender dalam kondisi sudah logout.

### BUG-18 ✅ State localStorage global per-browser, bukan per-user — nilai bocor antar akun
- **Lokasi:** `app.js:274-280` (`choukai_progress`), juga `choukai_student_profile`, `choukai_memorized_words`; `logout()` tidak membersihkan.
- **Dampak:** di mesin lab bersama (mode file:// didukung), siswa B login setelah siswa A → dashboard menampilkan nilai & tombol Hasil milik A.

### BUG-19 ✅ `fetchChaptersStatus` menghapus progress lokal non-admin tanpa skor server (data loss)
- **Lokasi:** `app.js:3110` — `else if (role !== "admin") delete this.progress[ch.chapterNum]`.
- **Dampak:** hasil ujian yang submit servernya gagal (lihat BUG-08) atau dikerjakan offline **dihapus permanen** saat sinkronisasi berikutnya; entri lokal yang lebih kaya (answers/mode/tanggal) juga ditimpa bentuk server-lite (pemicu BUG-06).

### BUG-20 ✅ XSS reflektif atribut lewat input pencarian kosakata
- **Lokasi:** `app.js:2887` — `value="${this.kosakataSearch}"` — input mentah pengguna dire-interpolasi ke atribut saat render ulang (mis. ganti dropdown Bab).
- **Payload contoh:** `" onfocus="alert(1)" autofocus data-x="`.

### BUG-21 ✅ `/exam/answer` menerima questionId dari bab mana pun
- **Lokasi:** `backend/src/routes/exam.ts:210-212` — lookup `questions.id` tanpa cek `q.chapterNum === session.chapterNum`.
- **Dampak:** polusi tabel `exam_answers` + memperluas oracle BUG-09 ke soal bab lain. Skor submit tak terpengaruh (iterasi hanya bab sesi).

---

## ⚪ RENDAH

### BUG-22 ✅ Validasi input minimal di backend
- `selectedOption` disimpan verbatim tanpa dicek terhadap daftar `options` soal (blob multi-KB bisa masuk `exam_answers`); `pin` registrasi tanpa panjang minimum (auth.ts:37-40 hanya cek keberadaan). `backend/src/routes/exam.ts:226`, `auth.ts:37-40`.

### BUG-23 ✅ Edge-case FK pada seeder akun
- `backend/src/db/seed.ts:467-483` — upsert user konflik di `username` (id lama dipertahankan) tapi INSERT `account` memakai `user_id` fixed `u.id` → jika username seeded dihapus lalu diregistrasi ulang (id baru `usr_<uuid>`), boot berikutnya pelanggaran FK → seed terpotong (bootstrap menelan error).

### BUG-24 ✅ (Konfigurasi, laten) Regex location nginx ekstensi statis mengalahkan prefix `/api/`
- `nginx.conf:44` — location regex `\.(jpg|...|js|mp3|pdf)$` menang atas prefix `/api/` (regex > prefix biasa di nginx) → rute API masa depan yang berakhiran ekstensi tersebut akan 404 dari static handler, bukan di-proxy. Saat ini tidak ada rute API berekstensi demikian (sudah diverifikasi terhadap daftar rute) — murni jebakan laten.

### BUG-25 ✅ (Catatan operasional) Tailwind via CDN di produksi
- `index.html:11` — `https://cdn.tailwindcss.com` (Play CDN): tanpa internet, seluruh styling hilang; juga bukan build produksi yang disarankan Tailwind.

### BUG-26 ✅ (UX) 38 kata kosakata tak bisa difilter kategori
- `app.js:2779-2794` dropdown kategori hardcode tidak memuat nilai `Kata Sifat-i` (16), `Kata Sifat-na` (19), `Satuan Bilangan` (1), `Tata Bahasa` (1), `Kata Partikel` (1) yang dipakai data — kata tetap tampil di "Semua Kategori", hanya filternya kosong.

---

## ✅ Diperiksa dan dinyatakan BERSIH (bukan bug)

- **Integritas data.js + kosakata_data.js:** 25 bab, 769 soal — semua `correctAnswer` valid & cocok `===` dengan salah satu opsi, opsi selalu 4 & tak kosong, ID 1..N kontinu tanpa duplikat, choukai tepat id 26-33, semua path audio (18 MP3 bab + 144 per-soal), 122 gambar, dan 26 PDF ada di disk. Metadata `CHAPTERS_INDEX` 100% cocok dengan array data. Kosakata: 35 deck / 1.804 kata tanpa duplikat & kolom `total_words` akurat.
- **Handler onclick index.html:** semua 8 method (`goToDashboard`, `openAdminPanel`, `openPdfLibraryModal`, `goToKosakata`, `openModal`, `openAuthModal`, `logout`, `toggleTheme`) ada di kelas app.
- **Otentikasi rute backend:** semua rute terlindungi via `authMiddleware`; seluruh `/admin/*` lewat `adminGuard`; sesi ujian scoped kepemilikan `userId` — tidak ditemukan IDOR.
- **Skor server tidak mempercayai klien:** `/exam/submit` menghitung ulang dari `exam_answers` (kelemahannya di BUG-01/09, bukan di perhitungan).
- **Password hashing** scrypt via better-auth; reset PIN mencabut session aktif.
- **Rate limiter Map** dibersihkan tiap 5 menit (tidak ada memory leak).
- **CORS** whitelist ketat per-request, cocok untuk cookie auth.

## 📝 Catatan dokumen (bukan bug kode)
- `AGENTS.md` §11.1 menyatakan hanya Bab 08-11 yang punya choukai (33 soal); data aktual: **Bab 08-25** (18 bab × 8 = 144 soal listening, sesuai §10). Index, data, app.js, dan aset saling konsisten — hanya dokumen yang tertinggal.

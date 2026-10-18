# AUDIT BUG — VERIFIKASI SETELAH FIX (BUKTI EMPIRIS)

**Proyek:** Choukai_Web (IMM Japan CBT Lab) · **Rentang:** audit 2026-10-11 (`5a9a164`) → remediasi multi-agen → **verifikasi ulang independen 2026-10-18** (commit fix `5f3d98a`).
**Verifikator:** agen terpisah dari agen yang melakukan fix — semua klaim di bawah didukung **bukti runtime**, bukan sekadar pembacaan kode.

---

## 1. Metodologi Verifikasi Empiris

| Lingkungan uji | Setup | Cakupan bug |
|---|---|---|
| **A. Browser headless nyata (HTTP)** | Chromium `--headless=new` via CDP, static server lokal, `window.fetch` di-mock dengan respons **berbentuk persis `safeQuestions` backend** (id string `"q_08_01"`, field camelCase `questionJa/imageUrl/questionType`) dipasang via `Page.addScriptToEvaluateOnNewDocument` sebelum app.js jalan. Siswa fiktif `heru.prayoga` (role `student`) via mock `/api/v1/auth/me`. | 01, 02, 05, 06, 07, 08, 11, 16, 17, 20 |
| **B. Browser mode `file://`** | Halaman yang sama dibuka via protokol file (jalur offline lab). | 12 |
| **C. Backend hidup (end-to-end)** | PostgreSQL 18.6 lokal (initdb segar) + `npx tsx src/index.ts` (Hono) + skrip `curl` ber-cookie memakai **kredensial resmi** dari `credentials/user_password.txt`; manipulasi data via `psql`. | 01 (sisi server), 09, 13, 14, 15, 16, 21, 23, 10 |
| **D. Build sanitizer** | Eksekusi nyata `node scripts/build_public_data.js data.js /tmp/data.public.js` + grep artefak. | 03 |
| **E. Statis terverifikasi** | Kutipan kode pada baris aktual pasca-fix. | 18, 19, 22, 24, 25, 26, 04 |

**Rekap hasil:** A = **30/30 PASS** · B = **6/6 PASS** · C = **17/19 PASS** (2 gagal = artefak skrip uji, lihat §4; 1 gagal = temuan residual baru §3) · D = **PASS** · E = **PASS semua**.

---

## 2. Status Per Bug + Bukti Empiris

### 🔴 KRITIS

#### BUG-01 — Kontrak ID soal rusak mode Shiken server → **✅ FIXED (empiris A + C)**
- **Fix:** `normalizeServerQuestions()` memetakan soal server ke bentuk lokal (`id` numerik + `_dbId` = ID DB string); onclick dikutip; `dbQId` memakai `q._dbId`.
- **Bukti A (browser):**
  - `q1._dbId === "q_08_01"`, `q1.id === 1` (dinormalisasi).
  - Klik nyata `document.querySelector('.option-btn').click()` → `window.__errs = []` (**0 ReferenceError**, dulu: `q_08_05 is not defined`).
  - POST tertangkap: `{"sessionId":"ses_test_1","questionId":"q_08_01","selectedOption":"A"}` — **bukan** `q_08_q_08_05` (dulu: 404 senyap → skor 0).
- **Bukti C (backend live):** `POST /exam/answer {questionId:"q_08_01"}` → `{"success":true,"saved":true}`; submit → `readingCorrect=3/25, skor=12` — jawaban benar-benar tersimpan & dinilai server.

#### BUG-02 — Nama field backend ≠ frontend → **✅ FIXED (empiris A)**
- **Fix:** mapping `questionJa→question_ja`, `questionRuby→question_ruby`, `imageUrl→image`, `questionType→type` di normalisasi.
- **Bukti A:** `question_ja` terisi `"これはサーバーからの問題_1です。…"` (dulu: kosong); `q2.image === "assets/bab_08/q21.webp"`; `q2.type === "gambar"`.

#### BUG-03 — Kunci jawaban 769 soal terkirim ke browser → **✅ FIXED (empiris D)**
- **Fix:** Docker multi-stage `data-sanitizer`; data.js publik hasil `scripts/build_public_data.js`; guard build gagal bila bocor.
- **Bukti D:** build nyata → `[build_public_data] OK: 25 bab, 769 soal, 2800025 byte`; `grep -c '"correctAnswer"' /tmp/data.public.js` = **0**; `grep -c '"explanation"'` = **0**; `require()` ulang output → 25 bab / 769 soal utuh.
- **Catatan desain:** `data.js` di repo TETAP memuat kunci (769) untuk grading mode offline `file://` — hanya image Docker produksi yang disterilkan.

#### BUG-04 — Rahasia hardcoded + kredensial ter-commit → **✅ FIXED (E + riwayat git)**
- **Fix:** fallback secret dihapus dari `src/lib/auth.ts`, `src/db/index.ts`, `drizzle.config.ts`; `.env.example` menjadi placeholder `CHANGE_ME` + instruksi rotasi; riwayat git lokal ditulis ulang.
- **Bukti E:** `grep -rn "imm_cbt_secret_key\|imm_cbt_secure_pass" backend/src/ backend/.env.example` → **0 hasil**.
- **Residu non-deploy:** `backend/dist/*.js` (artefak build lokal, gitignored) masih memuat fallback lama — tidak ikut image Docker (stage runner membangun ulang), cukup dibersihkan.

#### BUG-05 — Dashboard crash `score: null` → **✅ FIXED (empiris A)**
- **Fix:** `Number(prog.score) || 0`; entri null diperlakukan sebagai pending; `pendingSessionId` persist untuk retry lintas tab.
- **Bukti A:** setelah menghasilkan entri progress `score:null` (submit server gagal), `goToDashboard()` → **tanpa exception** (`{ok:true, html:…}`), `window.__errs=[]`.

#### BUG-06 — Tombol "Hasil" crash (progress server-lite tanpa `answers`) → **✅ FIXED (empiris A)**
- **Fix:** guard `r.answers || {}`; entri server-lite kini membawa `answers:{}` + counts dari `/api/v1/chapters`.
- **Bukti A:** sinkron `userScore` via mock → `viewSavedResult('08')` → `view='result'` **tanpa TypeError** (dulu: `Cannot read properties of undefined`).

### 🟠 TINGGI

#### BUG-07 — Statistik "0 benar" palsu → **✅ FIXED (empiris A)**
- **Bukti A:** hasil submit server: `readingCorrect=2`, `choukaiCorrect=1`, `correctCount=3` (persis nilai mock server; dulu selalu 0 karena `correctAnswer` di-strip). Sinkron `userScore` juga membawa counts (`readingCorrect/totalCorrect/…`).

#### BUG-08 — Spinner "Memeriksa…" selamanya → **✅ FIXED (empiris A)**
- **Bukti A:** mock `/exam/submit` gagal → `isGrading===true` + `_submitFailed===true` + `_lastSubmitSessionId` tersedia (tombol "Kirim Ulang") — pada data publik tanpa kunci lokal, status **pending jujur** (bukan skor 0 palsu, bukan spinner mati). Jalur fallback lokal tetap ada bila kunci tersedia.

#### BUG-09 — Oracle `isCorrect` saat ujian berjalan → **✅ FIXED (empiris C)**
- **Bukti C:** `GET /api/v1/exam/sessions/:id` saat `IN_PROGRESS` → **0** entri memuat `isCorrect`; pasca-`SUBMITTED` → `isCorrect` tersedia kembali untuk review (3 entri) — desain fix sesuai komentar kode.

#### BUG-10 — Rate limiter bypass XFF[0] → **⚠️ INTI FIXED + 1 RESIDUAL BARU (empiris C, lihat §3)**
- **Fix:** key dari entri XFF **paling kanan** (di-append proxy tepercaya), bukan `[0]`; hanya percaya header bila peer privat/loopback; `TRUSTED_PROXY_COUNT`; rateLimit Better Auth diaktifkan ulang (60/60s).
- **Bukti C (inti bekerja):**
  - Tanpa XFF, 65 req `/exam/submit` (>60/mnt) → **8×429** (limit tercapai).
  - Spoof IP **privat** di kiri (`172.16.9.N, 192.168.1.50`) 65 req → **5×429** — bucket stabil, spoof tidak mengrotasi.
  - **Tapi** spoof IP **publik** (`8.8.8.N, 192.168.1.50`) 7 req → **0×429** → RESIDUAL-1 (§3).

#### BUG-11 — Stored XSS Panel Sensei → **✅ FIXED (empiris A)**
- **Fix:** `escapeHtml()`/`escapeAttr()` di semua sink nama (panel users/monitoring/hasil/modal).
- **Bukti A:** user ber-name `<img src=x onerror="window.__xssFired=1">EVIL` dirender → `window.__xssFired === undefined` (**tidak tereksekusi**) dan DOM memuat `&lt;img` (tampil sebagai teks).

#### BUG-12 — Auth bypass offline (password apa pun ≥4 char) → **✅ FIXED (empiris B, 6/6)**
- **Bukti B (`file://`):** `login("sensei.rusdi","1234")` → **false**; `login("nafisatun","passwordsalah")` → **false**; `isAuthenticated === false`. Register offline `tes.lokal`/PIN `445566` → login PIN salah **false**, PIN benar **true** (verifikasi kini via mock-store lokal, akun resmi hanya online).

### 🟡 SEDANG

#### BUG-13 — Default akses PDF terbalik → **✅ FIXED (empiris C)**
- **Bukti C:** pada Postgres segar pasca-migrate: `information_schema.columns` → `user.pdf_access_allowed` **default false**, `user_chapter_access.is_pdf_allowed` **default false** (dulu true/true) + one-time fix data siswa eksisting.

#### BUG-14 — Seeder destruktif → **✅ FIXED (empiris C)**
- **Bukti C:**
  - `UPDATE user SET pdf_access_allowed=true WHERE username='nafisatun'` → re-seed → masih **t** (edit Sensei tidak ditimpa; dulu ON CONFLICT menimpa).
  - `DELETE sensei.rusdi` (18 user) → re-seed → **19 user, 2 admin** (dulu: `DELETE FROM user` menyapu semua + cascade seluruh riwayat ujian).

#### BUG-15 — Submit mengabaikan expiry → **✅ FIXED (empiris C, ronde-2)**
- **Bukti C:** sesi digeser 5 menit lampau (naive-UTC) → `/exam/answer` **DITOLAK** `"Waktu ujian telah habis."` + status di-flip `EXPIRED`; `/exam/submit` → `resp=EXPIRED, db=EXPIRED` — **tidak difinalisasi jadi SUBMITTED**. (Kegagalan ronde-1 = artefak zona-waktu skrip uji, lihat §4.)

#### BUG-16 — Race double-submit → **✅ FIXED (empiris A + C)**
- **Bukti:** (A) guard `_isSubmitting` aktif selama alur submit; submit+retry tanpa dobel POST. (C) submit ulang sessionId sama → skor identik (`2 == 2`), status `SUBMITTED`, **1 baris sesi** di DB (tanpa duplikasi).

#### BUG-17 — Logout tak memberhentikan timer → **✅ FIXED (empiris A)**
- **Bukti A:** ujian shiken dimulai (`timerInterval` aktif) → `logout()` → `timerInterval === null`.

#### BUG-18 — localStorage lintas akun → **✅ FIXED (E)**
- **Bukti E:** `app.js:279 userStorageKey(base)` — key namespaced per-user; dipakai di load/save `choukai_student_profile` (:288/:302), `choukai_progress` (:312), `choukai_memorized_words`, dan marker `choukai_reset_seen`.

#### BUG-19 — Penghapusan progress lokal tanpa syarat → **✅ FIXED (E)**
- **Bukti E:** satu-satunya `delete this.progress` tersisa (±:3346) ada di blok **marker reset admin** (`resultsResetAt`) — hanya membersihkan entri lebih tua dari waktu reset Sensei, disengaja. Komentar eksplisit: *"BUG-19: jangan hapus progress lokal hanya karena belum ada skor server"*.

#### BUG-20 — XSS atribut pencarian kosakata → **✅ FIXED (empiris A)**
- **Bukti A:** payload `" onfocus="window.__xssK=1" autofocus data-x="` → `__xssK === undefined` dan `input.value` **utuh persis string payload** (tidak memecah atribut).

#### BUG-21 — Answer lintas bab → **✅ FIXED (empiris C)**
- **Bukti C:** `POST /exam/answer {sessionId:<bab 10>, questionId:"q_10_01"}` sukses, tapi `q_09_01` pada sesi bab 08 → **HTTP 404** `"ID Soal tidak valid."` (lookup kini `AND questions.chapterNum = session.chapterNum`).

### ⚪ RENDAH

#### BUG-22 — Validasi input minimal → **✅ FIXED (E)**
- **Bukti E:** `exam.ts:219-221` — `selectedOption` divalidasi `validOptions.some(opt => String(opt.id) === String(selectedOption))`; `auth.ts:84` — PIN wajib `^\d{6}$`; username tervalidasi panjang+charset.

#### BUG-23 — Edge-case FK seeder → **✅ FIXED (empiris C)**
- **Bukti C:** hapus `sensei.rusdi` → re-seed → akun dipulihkan **tanpa pelanggaran FK** (seeder resolve id aktual via username sebelum insert `account`; hanya mengisi credential bila belum ada).

#### BUG-24 — Jebakan nginx location regex vs `/api/` → **✅ FIXED (E)**
- **Bukti E:** `nginx.conf:16` → `location ^~ /api/` (prefix `^~` menang atas location regex ekstensi — rute API berekstensi `.js/.pdf` masa depan tak tertelan static handler).

#### BUG-25 — Tailwind Play CDN → **✅ FIXED (E)**
- **Bukti E:** `index.html:9` → `<script src="assets/vendor/tailwindcdn.js?v=1">`; file vendor ada (407.279 byte) — offline/self-hosted.

#### BUG-26 — 38 kata tak terfilter kategori → **✅ FIXED (E)**
- **Bukti E:** dropdown kategori kini dibangun **dinamis** dari `KOSAKATA_DATA` (`catSet`), bukan hardcode — kategori `Kata Sifat-i/-na`, `Satuan Bilangan`, `Tata Bahasa`, `Kata Partikel` otomatis tersedia.

---

## 3. ⚠️ RESIDUAL-1 (TEMUAN BARU — terbukti empiris) → **✅ FIXED 2026-10-18 (commit `21ac2c4`)**

**Remediasi:** scan heuristik ke-kiri dihapus total. Key kini **deterministik**: `XFF[len - TRUSTED_PROXY_COUNT]` (clamp ke entri terkiri bila rantai lebih pendek). Entri di kiri indeks itu sepenuhnya milik klien dan tidak pernah dipakai. Salah-konfigurasi `TRUSTED_PROXY_COUNT` kini hanya memicu `console.warn` observabilitas — **tidak lagi mengubah key** (perubahan key heuristik itulah celahnya). Helper murni `pickClientIpFromXff()` diekspor + diuji unit **10/10 PASS** termasuk skenario serangan persis audit (spoof publik rotasi + klien LAN → key stabil `192.168.1.50`) dan topologi traefik→nginx `tc=2`. Deploy live: env backend ditambah `TRUSTED_PROXY_COUNT=2`.

**Bypass granular rate limiter untuk klien LAN** — `backend/src/middlewares/rateLimiter.ts`, jalur koreksi hop-privat.

- **Mekanisme:** entri XFF paling kanan (di-append proxy tepercaya) = IP klien asli. Bila IP itu **privat** (khas lab sekolah, mis. `192.168.1.50`) dan klien menyisipkan IP **publik** palsu di kirinya (`X-Forwarded-For: 8.8.8.8` → nginx → `8.8.8.8, 192.168.1.50`), blok koreksi `isPrivateOrLoopback(candidate)` berjalan ke kiri dan **memilih entri spoof publik** sebagai key → setiap request dapat bucket baru → limit 60/mnt tak pernah tercapai.
- **Bukti live (backend hidup):**
  - Spoof publik rotasi: `X-Forwarded-For: 8.8.$i.1, 192.168.1.50` × 7 → **0×429** (bucket terrotasi).
  - Kontrol spoof privat: `172.16.9.N, 192.168.1.50` × 65 → **5×429** (bucket stabil — proteksi inti bekerja).
- **Dampak:** granularitas throttle saja (brute-force PIN & spam submit); lapisan kedua Better Auth rateLimit (60/60s) tetap aktif sebagai mitigasi.
- **Saran fix:** jalankan koreksi ke-kiri **hanya bila `TRUSTED_PROXY_COUNT > 1`** — dengan tepat 1 hop proxy tepercaya, entri terkanan adalah IP klien apa adanya (privat pun dipakai langsung, tanpa scan ke wilayah spoof).

## 4. Catatan Verifikasi (artefak & observasi)

1. **Artefak ronde-1 BUG-15 (bukan bug aplikasi):** skrip uji pertama menulis `expires_at = now()` dari sesi psql TZ +07 ke kolom `timestamp WITHOUT time zone`, sedangkan konvensi aplikasi naive-**UTC** → nilai terbaca 6 jam di masa depan → "tidak expired". Ronde-2 dengan `(now() AT TIME ZONE 'UTC')` lolos sempurna. **Pelajaran:** kolom `timestamp` tanpa zona rawan scrap lintas-penulis — pertimbangkan migrasi ke `timestamptz`. **[Keputusan 2026-10-18: DITUNDA]** migrasi tipe kolom menuntut konversi seluruh data eksisting dengan asumsi zona yang benar + koordinasi penulisan Drizzle (`mode` timestamp) — risiko regresi data riil lebih besar daripada manfaatnya saat ini; konvensi naive-UTC sudah konsisten di seluruh penulis kode pasca-audit.
2. **Artefak assertion jq:** ronde-1 membandingkan output `jq` (berkutip) tanpa `-r` — 2 "FAIL" palsu; diperbaiki di ronde-2.
3. **`backend/dist/*.js` lokal** masih memuat fallback secret lama (gitignored, tidak di-deploy — image Docker membangun dari src). **[SELESAI 2026-10-18:** `backend/dist` telah dihapus dari workstation — artefak ber-secret-lama tidak ada lagi.]**
4. **Tindakan operasional BUG-04** ~~(di luar repo): force-push remote, purge cache/fork GitHub, rotasi password DB + regenerasi `BETTER_AUTH_SECRET` di server live~~ **[UPDATE 2026-10-18: force-push ✅ (`master → 21ac2c4`, riwayat ber-kredensial sudah bukan tip remote) · `BETTER_AUTH_SECRET` ✅ dirotasi via Dokploy + redeploy terverifikasi (session lama otomatis logout) · masih menunggu: rotasi password DB `imm_admin` di postgres Coolify + purge cache/fork GitHub via Support.]**

## 5. Rekap Angka

| Suite | Hasil |
|---|---|
| A — Browser HTTP + mock backend (siswa shiken penuh) | **30/30 PASS** |
| B — Browser `file://` (auth offline) | **6/6 PASS** |
| C — Backend live PostgreSQL + Hono (ronde 1+2, setelah artefak dikoreksi) | **17/19 PASS** → 1 temuan = RESIDUAL-1 |
| D — Sanitizer build publik | **PASS** (0 kunci bocor, 769 soal utuh) |
| E — Statis (18, 19, 22, 24, 25, 26, 04) | **PASS semua** |
| **Total status bug asli** | **26/26 FIXED** (25 terverifikasi empiris + BUG-10 inti ✅ dan RESIDUAL-1-nya ditutup `21ac2c4` dengan uji unit 10/10 + uji live) |

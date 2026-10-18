#!/usr/bin/env node
/**
 * build_public_data.js — Sanitizer bank soal untuk distribusi publik (BUG-03).
 *
 * data.js asli berisi `correctAnswer` + `explanation` untuk seluruh 769 soal.
 * File hasil sanitasi (data.public.js) mendefinisikan struktur global yang sama
 * persis (CHAPTERS_INDEX, BAB_01_DATA..BAB_25_DATA, CHAPTERS_DATA, blok window
 * dan module.exports) TETAPI tanpa field sensitif, sehingga aman dikirim ke
 * browser pada image Docker produksi. Mode offline file:// tetap memakai
 * data.js penuh dari repo (grading lokal).
 *
 * CLI: node scripts/build_public_data.js <input.js> <output.js>
 *
 * Tanpa dependensi eksternal (Node murni, CommonJS).
 */
"use strict";

const fs = require("fs");
const path = require("path");

/** Properti yang TIDAK BOLEH ada di build publik (dihapus rekursif). */
const SENSITIVE_KEYS = new Set([
  "correctAnswer",
  "explanation",
  "explanationSummary",
  "explanationLogic",
  "explanationDistractor",
  "explanationGrammar",
]);

function fail(msg) {
  console.error("[build_public_data] FATAL: " + msg);
  process.exit(1);
}

/** Muat data.js dan kembalikan objek { NAME: value } untuk semua const global-nya. */
function loadOriginal(absInput) {
  const code = fs.readFileSync(absInput, "utf8");

  // Kumpulkan nama deklarasi `const NAME = ...` level atas file.
  const declRe = /(?:^|\n)const\s+([A-Za-z_$][\w$]*)\s*=/g;
  const names = [];
  let m;
  while ((m = declRe.exec(code)) !== null) {
    if (!names.includes(m[1])) names.push(m[1]);
  }
  if (names.length === 0) fail("tidak ada deklarasi const yang ditemukan di " + absInput);

  // Evaluasi file dalam scope fungsi bersih (window/module tidak terdefinisi di
  // sini, jadi kedua blok ekspor di ekor file dilewati tanpa efek samping).
  let factory;
  try {
    factory = new Function(
      code + "\n;return {" + names.map((n) => JSON.stringify(n) + ": " + n).join(", ") + "};"
    );
  } catch (e) {
    fail("gagal meng-compile " + absInput + ": " + e.message);
  }
  let data;
  try {
    data = factory();
  } catch (e) {
    fail("gagal mengevaluasi " + absInput + ": " + e.message);
  }
  for (const n of names) {
    if (data[n] === undefined) fail("konstanta " + n + " tidak terbaca dari hasil evaluasi");
  }
  return { names: names, data: data };
}

/** Deep-clone + hapus rekursif semua properti sensitif. */
function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value !== null && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      if (SENSITIVE_KEYS.has(key)) continue; // dibuang
      out[key] = sanitize(value[key]);
    }
    return out;
  }
  return value;
}

/** Pastikan TIDAK ADA properti sensitif tersisa (verifikasi pasca-sanitasi). */
function assertClean(node, trail) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => assertClean(v, trail + "[" + i + "]"));
    return;
  }
  if (node !== null && typeof node === "object") {
    for (const key of Object.keys(node)) {
      if (SENSITIVE_KEYS.has(key)) fail("properti sensitif masih ada di " + trail + "." + key);
      assertClean(node[key], trail + "." + key);
    }
  }
}

function countQuestions(data) {
  let total = 0;
  const perChapter = {};
  for (const [num, ch] of Object.entries(data.CHAPTERS_DATA)) {
    const n = Array.isArray(ch.questions) ? ch.questions.length : 0;
    perChapter[num] = n;
    total += n;
  }
  return { total: total, perChapter: perChapter };
}

function main() {
  const [, , inputArg, outputArg] = process.argv;
  if (!inputArg || !outputArg) {
    console.error("Pemakaian: node scripts/build_public_data.js <input.js> <output.js>");
    process.exit(1);
  }
  const absIn = path.resolve(inputArg);
  const absOut = path.resolve(outputArg);

  const { names, data } = loadOriginal(absIn);

  const before = countQuestions(data);
  const sanitized = {};
  for (const n of names) sanitized[n] = sanitize(data[n]);
  assertClean(sanitized, "root");

  const after = countQuestions(sanitized);
  if (
    Object.keys(before.perChapter).length !== Object.keys(after.perChapter).length ||
    Object.keys(sanitized.CHAPTERS_DATA).length !== Object.keys(data.CHAPTERS_DATA).length
  ) {
    fail("jumlah bab berubah: " + Object.keys(before.perChapter).length + " -> " + Object.keys(after.perChapter).length);
  }
  for (const [num, n] of Object.entries(before.perChapter)) {
    if (after.perChapter[num] !== n) {
      fail("jumlah soal bab " + num + " berubah: " + n + " -> " + after.perChapter[num]);
    }
  }
  if (before.total !== after.total) {
    fail("total soal berubah: " + before.total + " -> " + after.total);
  }
  if (before.total === 0) fail("total soal 0 — data sumber tidak terbaca dengan benar");

  // Susun ulang file JS dengan bentuk deklarasi sama seperti aslinya.
  const babNames = names.filter((n) => /^BAB_\d+_DATA$/.test(n));
  const lines = [];
  lines.push("/**");
  lines.push(" * Data Modul & Bank Soal Choukai CBT Platform — BUILD PUBLIK (SANITIZED)");
  lines.push(" * Kurikulum IMM Japan テキスト (Bab 01 s.d. Bab 25)");
  lines.push(" *");
  lines.push(" * !!! FILE HASIL OTOMATIS — JANGAN EDIT MANUAL !!!");
  lines.push(" * Dihasilkan oleh scripts/build_public_data.js dari data.js sumber.");
  lines.push(" * Field kunci jawaban beserta seluruh penjelasannya telah DIHAPUS");
  lines.push(" * untuk distribusi publik (anti-cheat, BUG-03).");
  lines.push(" * Penilaian mode HTTP dilakukan penuh di sisi server.");
  lines.push(" */");
  lines.push("const CHAPTERS_INDEX = " + JSON.stringify(sanitized.CHAPTERS_INDEX, null, 2) + ";");
  lines.push("");
  for (const n of babNames) {
    lines.push("const " + n + " = " + JSON.stringify(sanitized[n], null, 2) + ";");
    lines.push("");
  }
  lines.push("const CHAPTERS_DATA = " + JSON.stringify(sanitized.CHAPTERS_DATA, null, 2) + ";");
  lines.push("");
  lines.push('if (typeof window !== "undefined") {');
  lines.push("  window.CHAPTERS_INDEX = CHAPTERS_INDEX;");
  lines.push("  window.CHAPTERS_DATA = CHAPTERS_DATA;");
  for (const n of babNames) lines.push("  window." + n + " = " + n + ";");
  lines.push("}");
  lines.push("");
  lines.push('if (typeof module !== "undefined" && module.exports) {');
  lines.push("  module.exports = {");
  lines.push("    CHAPTERS_INDEX,");
  lines.push("    CHAPTERS_DATA,");
  for (const n of babNames) lines.push("    " + n + ",");
  lines.push("  };");
  lines.push("}");

  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, lines.join("\n") + "\n", "utf8");

  // Verifikasi akhir: file output tidak boleh mengandung string kunci sensitif.
  const written = fs.readFileSync(absOut, "utf8");
  for (const key of SENSITIVE_KEYS) {
    if (written.includes('"' + key + '"')) fail('string "' + key + '" masih ada di output');
  }
  // Dan output harus bisa dievaluasi ulang dengan jumlah soal identik.
  const recheck = new Function(
    written + "\n;return { CHAPTERS_DATA: CHAPTERS_DATA };"
  )();
  const recount = countQuestions(recheck);
  if (recount.total !== before.total) {
    fail("verifikasi ulang output gagal: total soal " + recount.total + " != " + before.total);
  }

  console.log(
    "[build_public_data] OK: " +
      Object.keys(after.perChapter).length +
      " bab, " +
      after.total +
      " soal, " +
      Buffer.byteLength(written, "utf8") +
      " byte -> " +
      absOut
  );
}

main();

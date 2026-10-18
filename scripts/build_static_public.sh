#!/usr/bin/env bash
# ============================================================================
# build_static_public.sh — Bundler paket hosting statis NON-Docker (RESIDUAL #15)
#
# MASALAH: data.js (kunci jawaban 769 soal) hidup di repo karena mode offline
# file:// membutuhkannya. Hosting statis non-Docker yang menyajikan repo mentah
# membocorkan /data.js ke publik. Mitigasi sebelumnya hanya instruksi manual —
# skrip ini mengotomatikkannya menjadi SATU PERINTAH.
#
# OUTPUT: dist_static/ — paket aman siap unggah:
#   * data.public.js  : bank soal tersanitasi (TANPA correctAnswer/explanation)
#   * index.html      : sudah dipatch memuat data.public.js (bukan data.js)
#   * app.js, styles.css, kosakata_data.js, assets/
#   * nginx-block-datajs.conf : snippet wajib disertakan di server block nginx
#
# GUARD: build GAGAL bila (1) data.js mentah ikut terbawa, atau (2) jejak
# correctAnswer/explanation ditemukan di file JS mana pun dalam paket.
# ============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="dist_static"

echo "[build_static_public] Merakit paket hosting statis publik -> $OUT/"
rm -rf "$OUT"
mkdir -p "$OUT"

# 1) Sanitasi bank soal (menghapus correctAnswer + seluruh explanation).
node scripts/build_public_data.js data.js "$OUT/data.public.js"

# 2) index.html dipatch agar memuat data.public.js (versi cache-bust dipertahankan).
sed -E 's#src="data\.js\?v=([0-9]+)"#src="data.public.js?v=\1"#' index.html > "$OUT/index.html"
grep -q 'data\.public\.js' "$OUT/index.html" || {
  echo "[build_static_public] FATAL: referensi data.js tidak ditemukan/dipatch di index.html" >&2
  exit 1
}

# 3) Aset publik lain (data.js mentah sengaja TIDAK dikopi).
cp app.js styles.css kosakata_data.js "$OUT/"
cp -r assets "$OUT/assets"

# 4) Guard anti-bocor: gagal bila kunci jawaban tersisa di paket.
if compgen -G "$OUT/*.js" > /dev/null; then
  if grep -lEq '"(correctAnswer|explanation[A-Za-z]*)"\s*:' $OUT/*.js; then
    echo "[build_static_public] FATAL: jejak kunci jawaban/explanation terdeteksi di paket!" >&2
    exit 1
  fi
fi
if [ -f "$OUT/data.js" ]; then
  echo "[build_static_public] FATAL: data.js mentah ikut terbawa ke paket!" >&2
  exit 1
fi

# 5) Snippet nginx untuk deploy: blokir /data.js bila folder repo disajikan mentah.
cat > "$OUT/nginx-block-datajs.conf" <<'EOF'
# WAJIB disertakan di server block nginx hosting statis non-Docker (RESIDUAL #15).
# data.js mentah (berisi kunci jawaban 769 soal) tidak pernah ada di paket
# dist_static/ — blok 404 ini mengamankan sisa salinan bila root server
# tanpa sengaja menunjuk ke folder repo mentah.
location = /data.js {
    return 404;
}
EOF

echo "[build_static_public] SELESAI. Deploy:"
echo "  1) Unggah SELURUH isi $OUT/ ke root web server."
echo "  2) Sertakan $OUT/nginx-block-datajs.conf ke konfigurasi nginx (lalu nginx -s reload)."
echo "  3) JANGAN pernah mengunggah data.js mentah dari repo."

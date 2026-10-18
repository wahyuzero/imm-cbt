# ===== Stage 1: Sanitasi bank soal (BUG-03) =====
# data.js mentah berisi kunci jawaban + pembahasan 769 soal. Stage ini
# menghapus seluruh field sensitif menjadi data.public.js. Stage final
# HANYA mengambil hasil sanitasi — data.js mentah tidak pernah di-COPY
# ke image produksi.
FROM node:20-alpine AS data-sanitizer
WORKDIR /build
COPY scripts/build_public_data.js ./build_public_data.js
COPY data.js ./data.js
RUN node build_public_data.js data.js data.public.js \
    && if grep -Eq '"(correctAnswer|explanation)"' data.public.js; then \
        echo "FATAL: kunci jawaban bocor di data.public.js" >&2; exit 1; \
    fi

# ===== Stage 2: Web server produksi =====
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

# data.js publik = hasil sanitasi stage 1 (TANPA kunci jawaban/pembahasan).
COPY --from=data-sanitizer /build/data.public.js /usr/share/nginx/html/data.js

# COPY eksplisit saja — JANGAN pernah "COPY ." ke sini: data.js mentah
# (berisi kunci) hanya boleh hidup di repo dan stage sanitizer.
COPY index.html app.js styles.css kosakata_data.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Guard BUG-03: gagal build bila kunci jawaban bocor ke image final
# (menangkap kebocoran masa depan pola "COPY ." maupun lainnya).
RUN if grep -Eq '"(correctAnswer|explanation)"' /usr/share/nginx/html/data.js; then \
        echo "FATAL: /usr/share/nginx/html/data.js masih berisi kunci jawaban!" >&2; exit 1; \
    fi

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

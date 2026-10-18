import { createMiddleware } from "hono/factory";
import { AppEnv } from "../types.js";

interface RateLimiterOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum requests allowed per windowMs
  message?: string;
  statusCode?: 429;
  keyGenerator?: (c: any) => string;
}

interface ClientRecord {
  timestamps: number[];
}

// RESIDUAL BUG-10 (edge topologi): apakah peer langsung berasal dari jaringan
// internal (proxy container seperti nginx/traefik di jaringan Docker/Coolify)?
// Header X-Real-IP/XFF hanya dipercaya dari peer seperti ini — koneksi langsung
// dari IP publik (port backend terekspos) tidak bisa spoof header identitas.
function isPrivateOrLoopback(addr: string): boolean {
  if (!addr) return false;
  const a = addr.replace(/^::ffff:/, "");
  if (a === "::1" || a === "::" || a.startsWith("127.")) return true;
  if (a.startsWith("10.") || a.startsWith("192.168.")) return true;
  const m = a.match(/^172\.(\d+)\./);
  if (m) {
    const n = Number(m[1]);
    if (n >= 16 && n <= 31) return true;
  }
  return false;
}

// RESIDUAL-1 FIX (deterministik): IP klien = entri XFF pada indeks
// [len - TRUSTED_PROXY_COUNT] — entri yang direkam proxy tepercaya pertama.
// Entri di KIRI indeks itu sepenuhnya dikontrol klien dan TIDAK PERNAH dipakai,
// menutup bypass rotasi bucket via IP publik palsu yang ditempel klien LAN di
// kiri rantai (celah scan-heuristik versi lama). Rantai lebih pendek dari
// kedalaman tepercaya → pakai entri terkiri (paling dekat klien yang terekam).
export function pickClientIpFromXff(forwarded: string, trustedCount: number): string | null {
  const tc = Math.max(1, Math.min(10, Number(trustedCount) || 1));
  const parts = forwarded.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const idx = Math.max(0, parts.length - tc);
  return parts[idx] || null;
}

export function createRateLimiter(options: RateLimiterOptions) {
  // RESIDUAL BUG-10: flag anti-spam untuk peringatan misconfig proxy (sekali per proses).
  let proxyDepthWarned = false;
  const {
    windowMs,
    max,
    message = "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
    statusCode = 429,
    keyGenerator = (c) => {
      // BUG-10 + RESIDUAL (edge topologi):
      // (1) Header identitas klien hanya dipercaya bila peer langsung adalah proxy
      //     internal (alamat privat/loopback) — mencegah spoof X-Real-IP/XFF saat
      //     port backend terekspos langsung ke publik.
      // (2) Kedalaman proxy dikonfigurasi via TRUSTED_PROXY_COUNT (default 1 =
      //     klien→nginx→backend). Bila ada tier proxy tambahan di depan nginx
      //     (mis. traefik Coolify), set TRUSTED_PROXY_COUNT=2 di env backend agar
      //     bucket rate-limit tidak menyatu untuk satu kelas (429 massal).
      const incoming = c.env?.incoming;
      const peer = incoming?.socket?.remoteAddress || incoming?.remoteAddress || "";
      if (isPrivateOrLoopback(peer)) {
        const trustedCount = Math.max(1, Number(process.env.TRUSTED_PROXY_COUNT) || 1);
        const forwarded = c.req.header("x-forwarded-for");
        if (forwarded) {
          const parts = forwarded.split(",").map((s: string) => s.trim()).filter(Boolean);
          const candidate = pickClientIpFromXff(forwarded, trustedCount);
          // RESIDUAL-1 FIX: kandidat privat dengan rantai lebih panjang dari
          // kedalaman tepercaya kini HANYA peringatan observabilitas — key TIDAK
          // diubah (mengubah key secara heuristik justru membuka bypass bucket).
          if (candidate && isPrivateOrLoopback(candidate) && parts.length > trustedCount && !proxyDepthWarned) {
            proxyDepthWarned = true;
            console.warn(
              `[PERINGATAN KONFIGURASI] TRUSTED_PROXY_COUNT=${trustedCount} tampak lebih kecil dari rantai proxy aktual (XFF berisi ${parts.length} hop; kandidat adalah IP privat). Bucket rate-limit mungkin menyatu untuk beberapa klien (risiko 429 massal). Set TRUSTED_PROXY_COUNT yang sesuai di environment backend.`
            );
          }
          if (candidate) return candidate;
        }
        const realIp = c.req.header("x-real-ip");
        if (realIp && realIp.trim()) {
          return realIp.trim();
        }
      }
      if (peer) {
        return peer;
      }
      return "unknown-client";
    },
  } = options;

  const hits = new Map<string, ClientRecord>();

  // Cleanup old entries periodically (every 5 minutes)
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        hits.delete(key);
      }
    }
  }, 300000);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return createMiddleware<AppEnv>(async (c, next) => {
    const key = keyGenerator(c);
    const now = Date.now();

    let record = hits.get(key);
    if (!record) {
      record = { timestamps: [] };
      hits.set(key, record);
    }

    // Filter timestamps within the current sliding window
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    const currentCount = record.timestamps.length;
    const remaining = Math.max(0, max - currentCount);
    const resetTime = Math.ceil((now + windowMs) / 1000);

    c.res.headers.set("X-RateLimit-Limit", String(max));
    c.res.headers.set("X-RateLimit-Remaining", String(remaining));
    c.res.headers.set("X-RateLimit-Reset", String(resetTime));

    if (currentCount >= max) {
      const oldest = record.timestamps[0] || now;
      const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      c.res.headers.set("Retry-After", String(retryAfter));
      return c.json(
        {
          success: false,
          error: message,
          retryAfterSeconds: retryAfter,
        },
        statusCode
      );
    }

    record.timestamps.push(now);
    await next();
  });
}

// 1. Rate Limiter untuk Endpoint Autentikasi (Cegah Brute Force PIN/Password)
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 menit
  max: 120, // 120 request per menit per IP (ramah kelas lab CBT & E2E suite)
  message: "Terlalu banyak percobaan autentikasi. Silakan tunggu sejenak sebelum mencoba lagi.",
});

// 2. Rate Limiter untuk Pengumpulan Ujian (Cegah Spam Submission, aman untuk konkurensi lab kelas)
export const examSubmitRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 menit
  max: 60, // 60 submit per menit per IP (mencegah false-positive saat kelas lab 40+ siswa submit serempak)
  message: "Terlalu banyak pengumpulan lembar ujian dari alamat IP ini. Silakan tunggu sejenak.",
});

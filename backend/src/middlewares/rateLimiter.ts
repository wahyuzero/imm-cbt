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

export function createRateLimiter(options: RateLimiterOptions) {
  const {
    windowMs,
    max,
    message = "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
    statusCode = 429,
    keyGenerator = (c) => {
      const forwarded = c.req.header("x-forwarded-for");
      if (forwarded) {
        return forwarded.split(",")[0].trim();
      }
      return c.req.header("x-real-ip") || "unknown-client";
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

// 2. Rate Limiter untuk Pengumpulan Ujian (Cegah Spam Submission)
export const examSubmitRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 menit
  max: 30, // 30 submit per menit per IP
  message: "Terlalu banyak pengumpulan lembar ujian dari alamat IP ini. Silakan tunggu sejenak.",
});

import { headers } from "next/headers";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function sanitizeText(value: string, maxLength = 255) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function getClientIp() {
  const headerStore = headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  current.count += 1;
  return {
    ok: current.count <= limit,
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

export function assertSameOrigin() {
  const headerStore = headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("host");

  if (!origin || !host || new URL(origin).host !== host) {
    throw new Error("Invalid request origin");
  }
}

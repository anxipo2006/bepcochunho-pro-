import { headers } from "next/headers";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function sanitizeText(value: string, maxLength = 255) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export async function getClientIp() {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (buckets.size >= 5000 && !current) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
    if (buckets.size >= 5000) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey) buckets.delete(oldestKey);
    }
  }

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

export async function assertSameOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("host");

  let originHost = "";
  try {
    originHost = origin ? new URL(origin).host.toLowerCase() : "";
  } catch {
    throw new Error("Invalid request origin");
  }

  if (!originHost || !host || originHost !== host.toLowerCase()) {
    throw new Error("Invalid request origin");
  }
}

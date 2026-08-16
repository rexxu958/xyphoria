import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string): { allowed: boolean; remaining: number } {
  const max = Number(process.env.RATE_LIMIT_MAX ?? 60);
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const now = Date.now();

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (bucket.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: max - bucket.count };
}

export function clientKeyFromRequest(request: Request, suffix: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]!.trim() : "unknown";
  return `${ip}:${suffix}`;
}

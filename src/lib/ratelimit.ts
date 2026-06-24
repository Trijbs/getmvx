// Lightweight fixed-window rate limiter backed by Upstash Redis (REST API).
//
// Fails open: if Redis is not configured or is unreachable, the request is
// allowed. Callers here use it to throttle best-effort endpoints (analytics),
// so a Redis outage must never take down the feature it protects.

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

/**
 * Allow at most `limit` requests per `windowSeconds` for a given `key`.
 *
 * Uses an atomic fixed window: INCR the counter, and set the TTL only on the
 * first hit of the window (EXPIRE ... NX), so a burst can't keep extending it.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return { success: true, remaining: limit };
  }

  try {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSeconds), "NX"],
      ]),
      // Don't let a slow Redis hang the request.
      signal: AbortSignal.timeout(1000),
    });

    if (!res.ok) return { success: true, remaining: limit };

    const data = (await res.json()) as Array<{ result?: unknown }>;
    const count = Number(data?.[0]?.result ?? 0);

    return {
      success: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  } catch {
    // Network error, timeout, or malformed response — fail open.
    return { success: true, remaining: limit };
  }
}

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

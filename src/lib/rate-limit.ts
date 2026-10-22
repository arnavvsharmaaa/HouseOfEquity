// Basic fixed-window rate limit per client IP, kept in memory.
// Each serverless instance has its own memory, so on Vercel this is best-effort: it stops a
// single bot hammering one instance, not a distributed attack. Swap for a shared store
// (e.g. Upstash Redis) if spam becomes a problem.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.LEAD_RATE_LIMIT ?? 5);

const hits = new Map<string, number[]>();

export function rateLimit(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return { ok: false as const, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing forever.
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return { ok: true as const };
}

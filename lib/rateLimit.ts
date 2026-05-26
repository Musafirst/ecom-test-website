/**
 * In-memory rate limiter — works per serverless instance.
 * Good enough for a small store. Replace with Upstash Redis for high traffic.
 */

interface Entry { count: number; resetAt: number }

const store = new Map<string, Entry>()

// Prune stale entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 10 * 60 * 1000)

/**
 * @param key      — unique key (e.g. `ip:subscribe:1.2.3.4`)
 * @param limit    — max requests allowed in the window
 * @param windowMs — time window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now()
  let entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs }
    store.set(key, entry)
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, retryAfterSec: 0 }
}

/** Extract real client IP from Vercel / proxy headers */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  )
}

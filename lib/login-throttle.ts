/**
 * Per-IP login throttle.
 *
 * Deliberately in-memory: this project has no database or KV store by design.
 * That means the limit is **per serverless instance**, not global — Vercel can
 * run several instances concurrently and recycles them, so a determined
 * attacker spreading requests around gets more than MAX_ATTEMPTS total. It
 * still turns a fast online guessing loop into a slow one, which is the point.
 *
 * The primary defence is password entropy, not this. If ADMIN_PASSWORD is a
 * long random string (a UUID, say) brute force is infeasible regardless; if
 * it's ever set to something human-guessable, this buys time but won't save
 * you. For a hard global limit you'd need shared state (Vercel KV / Upstash).
 */

const MAX_ATTEMPTS = 8
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_TRACKED_IPS = 5000 // bound memory against a spoofed-IP flood

type Entry = { count: number; firstAttemptAt: number }
const attempts = new Map<string, Entry>()

export function clientIpFrom(request: Request): string {
  // Vercel sets x-forwarded-for; the first entry is the real client.
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

/** Returns seconds to wait if the caller is currently locked out, else null. */
export function retryAfterSeconds(ip: string): number | null {
  const entry = attempts.get(ip)
  if (!entry) return null

  const elapsed = Date.now() - entry.firstAttemptAt
  if (elapsed > WINDOW_MS) {
    attempts.delete(ip)
    return null
  }
  if (entry.count < MAX_ATTEMPTS) return null

  return Math.ceil((WINDOW_MS - elapsed) / 1000)
}

export function recordFailedAttempt(ip: string): void {
  if (attempts.size > MAX_TRACKED_IPS) {
    // Cheapest possible eviction — drop everything and start the window over
    // rather than growing without bound.
    attempts.clear()
  }

  const entry = attempts.get(ip)
  if (!entry || Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttemptAt: Date.now() })
    return
  }
  entry.count += 1
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip)
}

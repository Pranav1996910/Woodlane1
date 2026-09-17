import { createHash, createHmac, timingSafeEqual } from "crypto"

/**
 * Minimal signed-cookie session for the admin dashboard — no database, no
 * session store. The cookie carries its own expiry plus an HMAC signature
 * keyed by a server-only secret, so a session is valid if and only if it
 * verifies against that secret; nothing is persisted or looked up server-side.
 *
 * This replaces the previous `localStorage.adminAuth` flag, which was a
 * client-side-only check — anyone could set it by hand in devtools, and the
 * "password" it gated against (`NEXT_PUBLIC_ADMIN_PASSWORD`) shipped in the
 * browser bundle. The real gate now lives in the API routes under
 * app/api/admin/*, which call requireAdminSession() themselves; the page-level
 * check in app/admin/page.tsx is a UX redirect, not the security boundary.
 */

export const ADMIN_SESSION_COOKIE = "wl_admin_session"
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    // Fail loudly rather than silently accepting every session as invalid
    // (or, worse, falling back to a hardcoded secret) — this must be set.
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add a long random value to .env.local (and to the Vercel project's env vars) before the admin login can work.",
    )
  }
  return secret
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex")
}

/**
 * Constant-time password check. Both sides are hashed to a fixed 32 bytes
 * first: timingSafeEqual throws on length mismatch, so comparing raw strings
 * would need a length check that itself leaks the password's length.
 */
export function verifyAdminPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const a = createHash("sha256").update(submitted).digest()
  const b = createHash("sha256").update(expected).digest()
  return timingSafeEqual(a, b)
}

export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = String(expiresAt)
  return `${payload}.${sign(payload)}`
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  let expected: string
  try {
    expected = sign(payload)
  } catch {
    return false
  }

  // Constant-time comparison — a plain === would leak signature bytes via timing.
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false

  const expiresAt = Number(payload)
  return Number.isFinite(expiresAt) && Date.now() < expiresAt
}

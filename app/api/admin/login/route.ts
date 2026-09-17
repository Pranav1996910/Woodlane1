import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, verifyAdminPassword } from "@/lib/admin-auth"
import { clearAttempts, clientIpFrom, recordFailedAttempt, retryAfterSeconds } from "@/lib/login-throttle"

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin login isn't configured — set ADMIN_PASSWORD in the environment." },
      { status: 500 },
    )
  }

  const ip = clientIpFrom(request)
  const lockedFor = retryAfterSeconds(ip)
  if (lockedFor !== null) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil(lockedFor / 60)} minute(s).` },
      { status: 429, headers: { "Retry-After": String(lockedFor) } },
    )
  }

  const body = await request.json().catch(() => null)
  const password = typeof body?.password === "string" ? body.password : ""

  if (!verifyAdminPassword(password)) {
    recordFailedAttempt(ip)
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }

  let token: string
  try {
    token = createAdminSessionToken()
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }

  clearAttempts(ip)

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours, matches the token's own expiry
  })
  return response
}

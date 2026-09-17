import { del, head, put } from "@vercel/blob"
import type { Door } from "@/lib/doors-fallback"

/**
 * The live door catalogue, stored as one JSON file in Vercel Blob rather than
 * a database — see CLAUDE.md ("Doors catalogue (Vercel Blob)") for why.
 * Server-only: imports `@vercel/blob` with the write token, so this must
 * never be imported from a client component.
 */

const MANIFEST_PATHNAME = "catalogue/doors.json"
// Blob's CDN caches the manifest for this long — keep it short so an admin
// edit is visible to visitors quickly without disabling caching outright.
const MANIFEST_CACHE_SECONDS = 60
const READ_TIMEOUT_MS = 4000

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

/**
 * Returns the current catalogue, or `null` if Blob isn't configured, the
 * manifest doesn't exist yet (nothing uploaded so far), or the read fails for
 * any reason — callers fall back to the bundled static catalogue in that case
 * rather than showing an empty page.
 */
export async function readDoorsManifest(): Promise<Door[] | null> {
  if (!isBlobConfigured()) return null
  try {
    const meta = await head(MANIFEST_PATHNAME)
    const res = await fetch(meta.url, { cache: "no-store", signal: AbortSignal.timeout(READ_TIMEOUT_MS) })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? (data as Door[]) : null
  } catch {
    return null
  }
}

export async function writeDoorsManifest(doors: Door[]): Promise<void> {
  await put(MANIFEST_PATHNAME, JSON.stringify(doors, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: MANIFEST_CACHE_SECONDS,
  })
}

export async function uploadDoorImage(file: File): Promise<{ url: string; pathname: string }> {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg"
  // A random id in the path (not addRandomSuffix) keeps the extension clean
  // and gives every upload a unique, collision-free key up front.
  const pathname = `catalogue/images/${crypto.randomUUID()}.${ext}`
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  })
  return { url: blob.url, pathname: blob.pathname }
}

/** Best-effort — a door whose image was already removed shouldn't block the edit. */
export async function deleteDoorImage(pathname: string | undefined): Promise<void> {
  if (!pathname) return
  try {
    await del(pathname)
  } catch {
    // ignore
  }
}

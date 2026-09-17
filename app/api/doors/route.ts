import { NextResponse } from "next/server"
import { readDoorsManifest } from "@/lib/doors-catalogue"

// Matches the manifest's own edge cache window (see MANIFEST_CACHE_SECONDS in
// lib/doors-catalogue.ts) — no point caching this response longer than the
// data behind it can actually be.
export const revalidate = 60

export async function GET() {
  const doors = await readDoorsManifest()
  return NextResponse.json({ doors: doors ?? [] })
}

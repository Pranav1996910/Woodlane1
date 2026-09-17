import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth"
import {
  deleteDoorImage,
  isBlobConfigured,
  readDoorsManifest,
  uploadDoorImage,
  writeDoorsManifest,
} from "@/lib/doors-catalogue"
import type { Door } from "@/lib/doors-fallback"

// A serverless request body has to fit under the platform's own limit
// (~4.5MB on Vercel's default Node runtime) well before this matters — keep
// comfortably under that so the real error is "your image is too big," not a
// confusing platform-level rejection.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

async function requireAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifyAdminSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function blobNotConfigured() {
  return NextResponse.json(
    { error: "Vercel Blob isn't connected to this project yet (BLOB_READ_WRITE_TOKEN is missing)." },
    { status: 500 },
  )
}

function readTextField(form: FormData, key: string): string {
  const value = form.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function GET() {
  if (!(await requireAdmin())) return unauthorized()
  const doors = (await readDoorsManifest()) ?? []
  return NextResponse.json({ doors })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return unauthorized()
  if (!isBlobConfigured()) return blobNotConfigured()

  const form = await request.formData()
  const name = readTextField(form, "name")
  const category = readTextField(form, "category")
  const description = readTextField(form, "description")
  const image = form.get("image")

  if (!name || !category || !(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "Name, category and an image file are required." }, { status: 400 })
  }
  if (!image.type.startsWith("image/")) {
    return NextResponse.json({ error: "The uploaded file must be an image." }, { status: 400 })
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image must be smaller than 4MB." }, { status: 400 })
  }

  const uploaded = await uploadDoorImage(image)
  const doors = (await readDoorsManifest()) ?? []
  const newDoor: Door = {
    id: crypto.randomUUID(),
    name,
    category,
    description,
    image_url: uploaded.url,
    imagePathname: uploaded.pathname,
  }
  await writeDoorsManifest([newDoor, ...doors])
  return NextResponse.json({ door: newDoor }, { status: 201 })
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return unauthorized()
  if (!isBlobConfigured()) return blobNotConfigured()

  const form = await request.formData()
  const id = readTextField(form, "id")
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 })

  const doors = (await readDoorsManifest()) ?? []
  const index = doors.findIndex((d) => d.id === id)
  if (index === -1) return NextResponse.json({ error: "That door no longer exists." }, { status: 404 })

  const existing = doors[index]
  const name = form.has("name") ? readTextField(form, "name") : existing.name
  const category = form.has("category") ? readTextField(form, "category") : existing.category
  const description = form.has("description") ? readTextField(form, "description") : existing.description
  if (!name || !category) {
    return NextResponse.json({ error: "Name and category can't be empty." }, { status: 400 })
  }

  let image_url = existing.image_url
  let imagePathname = existing.imagePathname
  const image = form.get("image")
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "The uploaded file must be an image." }, { status: 400 })
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be smaller than 4MB." }, { status: 400 })
    }
    const uploaded = await uploadDoorImage(image)
    image_url = uploaded.url
    imagePathname = uploaded.pathname
  }

  const updated: Door = { ...existing, name, category, description, image_url, imagePathname }
  doors[index] = updated
  await writeDoorsManifest(doors)

  // Only once the manifest safely points at the new image do we drop the old
  // one — deleting first and having the manifest write fail would orphan the
  // door with a broken image_url.
  if (image instanceof File && image.size > 0 && existing.imagePathname) {
    await deleteDoorImage(existing.imagePathname)
  }

  return NextResponse.json({ door: updated })
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return unauthorized()
  if (!isBlobConfigured()) return blobNotConfigured()

  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 })

  const doors = (await readDoorsManifest()) ?? []
  const index = doors.findIndex((d) => d.id === id)
  if (index === -1) return NextResponse.json({ error: "That door no longer exists." }, { status: 404 })

  const [removed] = doors.splice(index, 1)
  await writeDoorsManifest(doors)
  await deleteDoorImage(removed.imagePathname)

  return NextResponse.json({ ok: true })
}

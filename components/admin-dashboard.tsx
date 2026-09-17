"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DOOR_CATEGORIES, type Door } from "@/lib/doors-fallback"
import { Loader2, Upload, Trash2, X, Pencil } from "lucide-react"

const emptyForm = { name: "", category: "", description: "" }

function categoryLabel(value: string) {
  return DOOR_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function AdminDashboard() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [doors, setDoors] = useState<Door[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    let cancelled = false
    const loadDoors = async () => {
      try {
        const res = await fetch("/api/admin/doors")
        if (res.status === 401) {
          router.push("/admin/login")
          return
        }
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
        if (!cancelled) setDoors(body.doors ?? [])
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadDoors()
    return () => {
      cancelled = true
    }
  }, [router])

  // Revoke the previous object URL whenever we swap in a new file preview or
  // unmount, so we don't leak memory across a long admin session.
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {})
    router.push("/admin/login")
    router.refresh()
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFile(null)
    setPreviewUrl("")
    setFormError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const startEdit = (door: Door) => {
    setEditingId(door.id)
    setForm({ name: door.name, category: door.category, description: door.description })
    setFile(null)
    setPreviewUrl(door.image_url)
    setFormError("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const processFile = (candidate: File) => {
    if (!candidate.type.startsWith("image/")) {
      setFormError("Please choose an image file.")
      return
    }
    setFile(candidate)
    setPreviewUrl(URL.createObjectURL(candidate))
    setFormError("")
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) processFile(dropped)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.category || (!editingId && !file)) return
    setIsSubmitting(true)
    setFormError("")

    try {
      const body = new FormData()
      body.set("name", form.name)
      body.set("category", form.category)
      body.set("description", form.description)
      if (file) body.set("image", file)
      if (editingId) body.set("id", editingId)

      const res = await fetch("/api/admin/doors", {
        method: editingId ? "PATCH" : "POST",
        body,
      })
      if (res.status === 401) {
        router.push("/admin/login")
        return
      }
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || `Request failed (${res.status})`)

      const saved: Door = result.door
      setDoors((prev) =>
        editingId ? prev.map((d) => (d.id === saved.id ? saved : d)) : [saved, ...prev],
      )
      resetForm()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : String(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteDoor = async (id: string) => {
    if (!confirm("Delete this door? This also removes its image from storage.")) return
    try {
      const res = await fetch(`/api/admin/doors?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      if (res.status === 401) {
        router.push("/admin/login")
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Request failed (${res.status})`)
      }
      setDoors((prev) => prev.filter((d) => d.id !== id))
      if (editingId === id) resetForm()
    } catch (error) {
      alert(error instanceof Error ? error.message : String(error))
    }
  }

  const isEditing = editingId !== null

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">WoodLane Admin</h1>
            <p className="text-muted-foreground">Update your product gallery</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
            Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Add / Edit form */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{isEditing ? "Edit Door" : "Add New Door"}</CardTitle>
                <CardDescription>
                  {isEditing ? "Change any field, or leave the image as-is." : "Fill in details and upload an image"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Door Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Premium Rosewood Main Door"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOOR_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input
                    id="desc"
                    placeholder="Brief description of finish/material"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image {isEditing && <span className="text-muted-foreground">(optional — replaces the current one)</span>}</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] ${
                      dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50"
                    }`}
                  >
                    {previewUrl ? (
                      <div className="relative w-full aspect-square max-w-[160px]">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setFile(null)
                            setPreviewUrl("")
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                          aria-label="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 text-muted-foreground">
                        <Upload className="mx-auto h-10 w-10 opacity-40 mb-2" />
                        <p className="text-sm font-medium text-foreground">Click to browse or drop image</p>
                        <p className="text-xs">JPG, PNG or WEBP, up to 4MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>

                {formError && <p className="text-sm text-destructive">{formError}</p>}

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 py-6"
                    disabled={!form.name || !form.category || (!isEditing && !file) || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditing ? "Saving…" : "Uploading…"}
                      </>
                    ) : isEditing ? (
                      "Save Changes"
                    ) : (
                      "Upload Door"
                    )}
                  </Button>
                  {isEditing && (
                    <Button variant="outline" className="py-6" onClick={resetForm} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory list */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Current Inventory ({doors.length})</h2>

            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-2">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
                <p className="text-sm text-muted-foreground">Fetching catalogue…</p>
              </div>
            ) : loadError ? (
              <div className="text-center py-20 border-2 border-dashed rounded-xl bg-destructive/5">
                <p className="text-destructive">{loadError}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {doors.map((door) => (
                  <Card key={door.id} className="overflow-hidden group relative">
                    <div className="aspect-[4/5] w-full">
                      <img src={door.image_url} alt={door.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase font-bold text-primary">{categoryLabel(door.category)}</p>
                      <h3 className="font-medium text-sm truncate">{door.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{door.description}</p>

                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" onClick={() => startEdit(door)} className="h-8 w-8" aria-label="Edit door">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteDoor(door.id)}
                          className="h-8 w-8"
                          aria-label="Delete door"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && !loadError && doors.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                <p className="text-muted-foreground italic">No doors in the live catalogue yet — add one on the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

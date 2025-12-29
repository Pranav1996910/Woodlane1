"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Upload, Trash2, X } from "lucide-react"

type Door = {
  id: string
  name: string
  description: string
  image_url: string
  category: string
}

const DOOR_CATEGORIES = [
  "Main Doors",
  "Pooja Room Doors",
  "Bedroom Doors",
  "Bathroom Doors",
  "Balcony Doors",
  "Office Doors",
  "P.G. Doors",
]

export default function AdminPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [doors, setDoors] = useState<Door[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newDoor, setNewDoor] = useState({ name: "", description: "", image_url: "", category: "" })
  const [dragActive, setDragActive] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadDoors()
    }
  }, [router])

  const loadDoors = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("doors")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      setDoors(data || [])
    } catch (error) {
      console.error("Error loading doors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  // FIXED: Type-safe file processing using reader.result directly
  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          setNewDoor((prev) => ({ ...prev, image_url: reader.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const addDoor = async () => {
    if (!newDoor.name || !newDoor.description || !newDoor.image_url || !newDoor.category) return

    setIsAdding(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("doors")
        .insert([newDoor])
        .select()

      if (error) throw error
      if (data) {
        setDoors([data[0], ...doors])
        setNewDoor({ name: "", description: "", image_url: "", category: "" })
      }
    } catch (error) {
      console.error("Error adding door:", error)
      alert("Error: Database row limit exceeded (Base64 images are very large).")
    } finally {
      setIsAdding(false)
    }
  }

  const deleteDoor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this door?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("doors").delete().eq("id", id)
      if (error) throw error
      setDoors(doors.filter((door) => door.id !== id))
    } catch (error) {
      console.error("Error deleting door:", error)
    }
  }

  if (!isAuthenticated) return null

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
          {/* Add Form Column */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Add New Door</CardTitle>
                <CardDescription>Fill in details and upload an image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Door Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Premium Rosewood Main Door"
                    value={newDoor.name}
                    onChange={(e) => setNewDoor({ ...newDoor, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newDoor.category} onValueChange={(v) => setNewDoor({ ...newDoor, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {DOOR_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input
                    id="desc"
                    placeholder="Brief description of finish/material"
                    value={newDoor.description}
                    onChange={(e) => setNewDoor({ ...newDoor, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image Upload</Label>
                  {/* Container clicks trigger the hidden file input */}
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
                    {newDoor.image_url ? (
                      <div className="relative w-full aspect-square max-w-[160px]">
                        <img src={newDoor.image_url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setNewDoor({...newDoor, image_url: ""})}}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 text-muted-foreground">
                        <Upload className="mx-auto h-10 w-10 opacity-40 mb-2" />
                        <p className="text-sm font-medium text-foreground">Click to browse or drop image</p>
                        <p className="text-xs">Supports: JPG, PNG, WEBP</p>
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

                <Button
                  onClick={addDoor}
                  className="w-full py-6"
                  disabled={!newDoor.name || !newDoor.image_url || !newDoor.category || isAdding}
                >
                  {isAdding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding to DB...</> : "Upload Door"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* List Column */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Current Inventory ({doors.length})</h2>
            
            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-2">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
                <p className="text-sm text-muted-foreground">Fetching catalog...</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {doors.map((door) => (
                  <Card key={door.id} className="overflow-hidden group relative">
                    <div className="aspect-[4/5] w-full">
                      <img src={door.image_url} alt={door.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase font-bold text-primary">{door.category}</p>
                      <h3 className="font-medium text-sm truncate">{door.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{door.description}</p>
                      
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => deleteDoor(door.id)}
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {!isLoading && doors.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                <p className="text-muted-foreground italic">No products found in the database.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
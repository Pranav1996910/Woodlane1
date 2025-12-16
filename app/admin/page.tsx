"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

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
      const { data, error } = await supabase.from("doors").select("*")
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
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setNewDoor({ ...newDoor, image_url: event.target.result as string })
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const addDoor = async () => {
    if (!newDoor.name || !newDoor.description || !newDoor.image_url || !newDoor.category) {
      return
    }

    setIsAdding(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("doors")
        .insert([
          {
            name: newDoor.name,
            description: newDoor.description,
            image_url: newDoor.image_url,
            category: newDoor.category,
          },
        ])
        .select()

      if (error) throw error
      if (data) {
        setDoors([...doors, data[0]])
        setNewDoor({ name: "", description: "", image_url: "", category: "" })
      }
    } catch (error) {
      console.error("Error adding door:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const deleteDoor = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("doors").delete().eq("id", id)
      if (error) throw error
      setDoors(doors.filter((door) => door.id !== id))
    } catch (error) {
      console.error("Error deleting door:", error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">WoodLane Admin</h1>
            <p className="text-muted-foreground">Manage your door catalog</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Door</CardTitle>
              <CardDescription>Add a new door design to your collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="door-name">Door Name</Label>
                <Input
                  id="door-name"
                  placeholder="e.g., Modern Glass Panel"
                  value={newDoor.name}
                  onChange={(e) => setNewDoor({ ...newDoor, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="door-description">Description</Label>
                <Input
                  id="door-description"
                  placeholder="e.g., Contemporary design with frosted glass"
                  value={newDoor.description}
                  onChange={(e) => setNewDoor({ ...newDoor, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="door-category">Category</Label>
                <Select value={newDoor.category} onValueChange={(value) => setNewDoor({ ...newDoor, category: value })}>
                  <SelectTrigger id="door-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOOR_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="door-image">Upload Image</Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"
                    }`}
                >
                  {newDoor.image_url ? (
                    <div className="space-y-2">
                      <div className="w-32 h-32 mx-auto bg-muted rounded-lg overflow-hidden">
                        <img
                          src={newDoor.image_url || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Image uploaded. Drag another to replace.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drag and drop your image here</p>
                      <p className="text-xs text-muted-foreground">or click to browse</p>
                    </div>
                  )}
                  <input
                    id="door-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setNewDoor({ ...newDoor, image_url: event.target.result as string })
                          }
                        }
                        reader.readAsDataURL(e.target.files[0])
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              <Button
                onClick={addDoor}
                className="w-full"
                disabled={!newDoor.name || !newDoor.description || !newDoor.image_url || !newDoor.category || isAdding}
              >
                {isAdding ? "Adding..." : "Add Door"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Door Inventory</CardTitle>
              <CardDescription>Manage your existing doors</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading doors...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doors.map((door) => (
                    <div key={door.id} className="border rounded-lg overflow-hidden flex flex-col">
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden">
                          <img
                            src={door.image_url || "/placeholder.svg"}
                            alt={door.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold mb-1">{door.name}</h3>
                        <p className="text-xs text-primary mb-2">{door.category}</p>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">{door.description}</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteDoor(door.id)}
                          className="w-full"
                          style={{ backgroundColor: 'white', color: '#dc2626', cursor: 'pointer' }}
                        >
                          Delete Door
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {doors.length === 0 && !isLoading && (
                <p className="text-center text-muted-foreground py-8">No doors added yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

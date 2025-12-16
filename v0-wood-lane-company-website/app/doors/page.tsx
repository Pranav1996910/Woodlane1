"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

type Door = {
  id: string
  name: string
  image_url: string
  category: string
  description: string
}

export default function DoorCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const [doors, setDoors] = useState<Door[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [gridColumns, setGridColumns] = useState(4)

  useEffect(() => {
    const loadDoors = async () => {
      try {
        console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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
    loadDoors()
  }, [])

  const categories = Array.from(new Set(doors.map((d) => d.category)))
  const types = ["Single Door", "Double Door", "Arch Door"]
  const materials = ["Glass", "Solid Wood"]

  const filteredDoors = doors.filter((door) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(door.category)
    return categoryMatch
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const getGridClass = () => {
    switch (gridColumns) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-1 md:grid-cols-2"
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative h-48 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/elegant-wooden-doors-background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              ←
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white text-balance">Door Collection</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Door Collection</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CATEGORY</h3>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const count = doors.filter((d) => d.category === cat).length
                  return (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`category-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                        />
                        <label htmlFor={`category-${cat}`} className="text-sm cursor-pointer">
                          {cat}
                        </label>
                      </div>
                      <span className="text-xs text-muted-foreground">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="hidden md:flex items-center justify-end gap-2 mb-8">
              <Button variant={gridColumns === 1 ? "default" : "ghost"} size="sm" onClick={() => setGridColumns(1)}>
                1 Col
              </Button>
              <Button variant={gridColumns === 2 ? "default" : "ghost"} size="sm" onClick={() => setGridColumns(2)}>
                2 Col
              </Button>
              <Button variant={gridColumns === 3 ? "default" : "ghost"} size="sm" onClick={() => setGridColumns(3)}>
                3 Col
              </Button>
              <Button variant={gridColumns === 4 ? "default" : "ghost"} size="sm" onClick={() => setGridColumns(4)}>
                4 Col
              </Button>
            </div>

            {/* Door Grid */}
            {isLoading ? (
              <p className="text-center text-muted-foreground py-12">Loading doors...</p>
            ) : (
              <div className={`grid ${getGridClass()} gap-6`}>
                {filteredDoors.map((door) => (
                  <Card key={door.id} className="group overflow-hidden border-border hover:shadow-lg transition-all">
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <img
                          src={door.image_url || "/placeholder.svg"}
                          alt={door.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-semibold text-lg mb-1">{door.name}</h3>
                        <p className="text-xs text-muted-foreground">{door.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredDoors.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No doors found matching your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

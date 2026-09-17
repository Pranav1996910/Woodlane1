"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { SlidersHorizontal, PackageOpen, X, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CTA } from "@/components/cta"
import { GalleryLightbox } from "@/components/gallery-lightbox"
import { CatalogueImage } from "@/components/catalogue-image"
import { cn } from "@/lib/utils"
import { fallbackDoors, type Door } from "@/lib/doors-fallback"

const GRID_CLASS = "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// How many doors to render up front, and per "Show more" click. Rendering the
// whole catalogue in one grid doesn't scale as the catalogue grows past a
// couple dozen rows.
const INITIAL_VISIBLE = 12
const VISIBLE_STEP = 12

// A dead/unreachable host doesn't fail fast on its own — a plain fetch to a
// nonexistent one measured ~24s before the browser gave up. Time this out
// explicitly so the bundled catalogue appears almost immediately instead.
const CATALOGUE_TIMEOUT_MS = 3000

function DoorSkeleton() {
  return (
    <div className="aspect-[3/4] animate-pulse overflow-hidden rounded-2xl bg-muted ring-1 ring-border" />
  )
}

export default function DoorsPage() {
  const [doors, setDoors] = useState<Door[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  useEffect(() => {
    const loadDoors = async () => {
      try {
        const res = await fetch("/api/doors", { signal: AbortSignal.timeout(CATALOGUE_TIMEOUT_MS) })
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const body = await res.json()
        const fetched: Door[] = Array.isArray(body?.doors) ? body.doors : []
        // Only trust the live catalogue when it actually has rows; otherwise
        // show the bundled catalogue rather than an empty page (this is the
        // state before any door has ever been uploaded through /admin).
        setDoors(fetched.length > 0 ? fetched : fallbackDoors)
      } catch (error) {
        // Falling back is the designed behaviour, not a failure — keep it out
        // of console.error so it doesn't trip the Next.js dev error overlay.
        const reason = error instanceof Error ? error.message : String(error)
        console.info(`[doors] Live catalogue unavailable (${reason}); showing bundled catalogue.`)
        setDoors(fallbackDoors)
      } finally {
        setIsLoading(false)
      }
    }
    loadDoors()
  }, [])

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const door of doors) {
      counts.set(door.category, (counts.get(door.category) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [doors])

  const filteredDoors = useMemo(
    () =>
      selectedCategories.length === 0
        ? doors
        : doors.filter((door) => selectedCategories.includes(door.category)),
    [doors, selectedCategories],
  )

  const toggleCategory = (category: string) =>
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )

  // Filtering reorders the gallery, so a held index would point at the wrong
  // door, and a stale visible-count would leave "Show more" mid-scroll into
  // the new result set.
  useEffect(() => {
    setLightboxIndex(null)
    setVisibleCount(INITIAL_VISIBLE)
  }, [selectedCategories])

  const visibleDoors = filteredDoors.slice(0, visibleCount)

  const filterPanel = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Category
        </h2>
        {selectedCategories.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedCategories([])}
            className="text-xs font-medium text-accent-foreground/70 underline-offset-4 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {categories.length === 0 && !isLoading ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
          {categories.map(([cat, count]) => {
            const active = selectedCategories.includes(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium capitalize transition-all duration-200 lg:w-full lg:justify-between",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary",
                )}
              >
                <span>{cat}</span>
                <span className={cn("text-xs tabular-nums", active ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Page hero */}
        <section className="relative isolate flex min-h-[46vh] items-end overflow-hidden bg-ink pb-12 pt-32 text-white lg:min-h-[52vh] lg:pb-16 lg:pt-40">
          <Image
            src="/elegant-wooden-doors-background.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />

          <div className="container mx-auto px-4 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-white/55">
              <Link href="/" className="transition-colors hover:text-accent">
                Home
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-white/85">Door collection</span>
            </nav>

            <h1 className="animate-rise mt-5 max-w-3xl text-balance text-4xl font-bold leading-[1.05] lg:text-6xl">
              Every door we build, in one place
            </h1>
            <p className="animate-rise mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/70">
              Browse by room, then send us the ones you like — we&rsquo;ll quote them cut to your
              openings.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-14 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
            {/* Sidebar */}
            <aside className="lg:w-60 lg:shrink-0">
              <div className="lg:sticky lg:top-28">
                <div className="hidden lg:block">{filterPanel}</div>

                {/* Mobile filter toggle */}
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-full"
                    onClick={() => setFiltersOpen((v) => !v)}
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="size-4" />
                      Filter by category
                    </span>
                    {selectedCategories.length > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {selectedCategories.length}
                      </span>
                    )}
                  </Button>
                  {filtersOpen && <div className="mt-5">{filterPanel}</div>}
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="min-w-0 flex-1">
              <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-5">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? (
                    "Loading doors…"
                  ) : visibleDoors.length < filteredDoors.length ? (
                    <>
                      Showing <span className="font-semibold text-foreground">{visibleDoors.length}</span> of{" "}
                      <span className="font-semibold text-foreground">{filteredDoors.length}</span> doors
                      {selectedCategories.length > 0 && " in your selection"}
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{filteredDoors.length}</span>{" "}
                      {filteredDoors.length === 1 ? "door" : "doors"}
                      {selectedCategories.length > 0 && " in your selection"}
                    </>
                  )}
                </p>

                {filteredDoors.length > 0 && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(0)}
                    className="hidden shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary sm:inline-flex"
                  >
                    <Expand className="size-4" />
                    Open gallery
                  </button>
                )}
              </div>

              {/* Active filter pills */}
              {selectedCategories.length > 0 && (
                <div className="mb-7 flex flex-wrap items-center gap-2">
                  {selectedCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium capitalize text-secondary-foreground transition-colors hover:bg-border"
                    >
                      {cat}
                      <X className="size-3" />
                    </button>
                  ))}
                </div>
              )}

              {isLoading ? (
                <div className={cn("grid gap-4", GRID_CLASS)}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <DoorSkeleton key={i} />
                  ))}
                </div>
              ) : filteredDoors.length > 0 ? (
                <>
                  <div className={cn("grid gap-4", GRID_CLASS)}>
                    {visibleDoors.map((door, i) => (
                      <button
                        key={door.id}
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        aria-label={`View ${door.name} in the gallery`}
                        className="reveal group relative isolate block overflow-hidden rounded-2xl bg-ink text-left ring-1 ring-border transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <CatalogueImage
                            src={door.image_url || "/placeholder.svg"}
                            alt={door.name}
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                        </div>

                        {door.category && (
                          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                            {door.category}
                          </span>
                        )}

                        {/* Expand affordance */}
                        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink/50 text-white opacity-0 ring-1 ring-white/25 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <Expand className="size-4" />
                        </span>

                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <h3 className="font-serif text-base font-semibold leading-snug text-white lg:text-lg">
                            {door.name}
                          </h3>
                          {door.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60 lg:text-sm">
                              {door.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {visibleCount < filteredDoors.length && (
                    <div className="mt-10 flex justify-center">
                      <Button
                        variant="outline"
                        className="rounded-full px-8"
                        onClick={() => setVisibleCount((v) => v + VISIBLE_STEP)}
                      >
                        Show {Math.min(VISIBLE_STEP, filteredDoors.length - visibleCount)} more doors
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-secondary/30 px-6 py-20 text-center">
                  <PackageOpen className="mx-auto size-10 text-muted-foreground/60" strokeWidth={1.4} />
                  <h3 className="mt-5 font-serif text-xl font-semibold text-foreground">
                    {selectedCategories.length > 0
                      ? "No doors match those filters"
                      : "The catalogue is being updated"}
                  </h3>
                  <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {selectedCategories.length > 0
                      ? "Try clearing a filter, or tell us what you're after and we'll build it to order."
                      : "New pieces are being photographed. In the meantime, tell us the room and we'll send options directly."}
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {selectedCategories.length > 0 && (
                      <Button variant="outline" className="rounded-full" onClick={() => setSelectedCategories([])}>
                        Clear filters
                      </Button>
                    )}
                    <Button asChild className="rounded-full">
                      <Link href="/contact">Tell us what you need</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <CTA />
      </main>

      <Footer />

      <GalleryLightbox
        items={filteredDoors}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}

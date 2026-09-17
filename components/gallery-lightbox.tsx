"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { CatalogueImage } from "@/components/catalogue-image"
import { cn } from "@/lib/utils"

export type GalleryItem = {
  id: string
  name: string
  image_url: string
  category: string
  description: string
}

/**
 * Full-screen gallery viewer.
 *
 * `index` is the position within `items`; pass null to close. The parent owns
 * the index so the grid and the viewer stay on the same item.
 */
export function GalleryLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: GalleryItem[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}) {
  const open = index !== null && index >= 0 && index < items.length
  const current = open ? items[index] : null

  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const thumbStripRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const touchStartX = useRef<number | null>(null)

  // Reset the loading shimmer whenever we move to a different image.
  const [imageLoaded, setImageLoaded] = useState(false)
  useEffect(() => setImageLoaded(false), [index])

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return
      // Wrap around so the arrows never dead-end.
      onIndexChange((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndexChange],
  )

  // Remember what had focus so we can hand it back on close.
  useEffect(() => {
    if (open) restoreFocusRef.current = document.activeElement as HTMLElement
  }, [open])

  // Keyboard: arrows navigate, Escape closes, Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        go(1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        go(-1)
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, go, onClose])

  // Lock background scroll while open, and restore focus on close.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      restoreFocusRef.current?.focus?.()
    }
  }, [open])

  // Warm the neighbouring images so arrowing through feels instant.
  useEffect(() => {
    if (index === null || items.length < 2) return
    for (const delta of [1, -1]) {
      const neighbour = items[(index + delta + items.length) % items.length]
      if (neighbour) {
        const img = new Image()
        img.src = neighbour.image_url
      }
    }
  }, [index, items])

  // Keep the active thumbnail in view.
  useEffect(() => {
    if (!open) return
    thumbStripRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" })
  }, [index, open])

  if (!open || !current) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${current.name} — image ${index + 1} of ${items.length}`}
      ref={dialogRef}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touchStartX.current = null
      }}
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 text-white lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {current.category}
          </p>
          <h2 className="mt-1 truncate font-serif text-lg font-semibold lg:text-xl">{current.name}</h2>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <span className="text-sm tabular-nums text-white/50">
            {index + 1} / {items.length}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="inline-flex size-10 items-center justify-center rounded-full text-white ring-1 ring-white/20 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 lg:px-20">
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous door"
            className="absolute left-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-ink/60 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:left-6 lg:size-13"
          >
            <ChevronLeft className="size-5 lg:size-6" />
          </button>
        )}

        <div className="relative flex size-full items-center justify-center">
          {!imageLoaded && (
            <div className="absolute size-14 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
          )}
          <CatalogueImage
            key={current.id}
            src={current.image_url || "/placeholder.svg"}
            alt={current.name}
            priority
            sizes="100vw"
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "rounded-lg object-contain shadow-2xl transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next door"
            className="absolute right-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-ink/60 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:right-6 lg:size-13"
          >
            <ChevronRight className="size-5 lg:size-6" />
          </button>
        )}
      </div>

      {/* Caption + CTA */}
      <div className="shrink-0 px-4 pt-5 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm leading-relaxed text-white/65">{current.description}</p>
          <Link
            href="/contact"
            className="shrink-0 whitespace-nowrap rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Enquire about this door
          </Link>
        </div>
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div
          ref={thumbStripRef}
          // `safe center` centres the strip when it fits but falls back to
          // start-alignment when it overflows, so the first thumb stays reachable.
          className="flex shrink-0 gap-2 overflow-x-auto px-4 py-5 [justify-content:safe_center] lg:px-8"
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              data-active={i === index}
              onClick={() => onIndexChange(i)}
              aria-label={`View ${item.name}`}
              aria-current={i === index}
              className={cn(
                "relative size-14 shrink-0 overflow-hidden rounded-lg ring-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-accent lg:size-16",
                i === index
                  ? "ring-accent"
                  : "opacity-45 ring-transparent hover:opacity-90",
              )}
            >
              <CatalogueImage
                src={item.image_url || "/placeholder.svg"}
                alt=""
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

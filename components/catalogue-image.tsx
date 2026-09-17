import Image from "next/image"
import { cn } from "@/lib/utils"

// Vercel Blob's public URL host — matches the remotePattern in
// next.config.mjs. Keep these two in sync.
const OPTIMIZABLE_REMOTE_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//

/**
 * Fill-mode image for door photos, whose `src` comes from the live catalogue
 * (`lib/doors-catalogue.ts`, Vercel Blob) rather than code — see
 * `lib/doors-fallback.ts`. next/image throws a hard render error for a host
 * that isn't allow-listed in `next.config.mjs`'s `images.remotePatterns`, so
 * blindly optimizing whatever `image_url` happens to contain could take the
 * whole page down the moment it points somewhere unconfigured — which is a
 * real possibility here, since it's admin-uploaded, not code.
 *
 * Root-relative paths (`/foo.jpg`, resolve to `public/`) and the Blob host
 * above are the only two sources `image_url` can actually have today, and
 * both are safe — everything else (a manually-edited manifest, a future
 * storage provider) falls back to a plain `<img>` in the same fill/object-fit
 * box rather than risking a crash. Extend the regex above (and the
 * remotePattern in next.config.mjs) if that ever changes.
 */
export function CatalogueImage({
  src,
  alt,
  sizes,
  className,
  priority,
  onLoad,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
  onLoad?: () => void
}) {
  if (src.startsWith("/") || OPTIMIZABLE_REMOTE_HOST.test(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onLoad={onLoad}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={cn("absolute inset-0 size-full", className)}
      onLoad={onLoad}
    />
  )
}

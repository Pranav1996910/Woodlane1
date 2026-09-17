import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * The original WoodLane logo file — a sawblade mark with the wordmark baked
 * into the JPEG itself, on a white square. It's wrapped in a small white
 * chip so it reads as an intentional badge rather than a stray white box
 * when the header sits transparent over the dark hero image.
 *
 * `unoptimized`: this same source is rendered twice on every page (header +
 * footer) at two different sizes. Next's dev-mode image optimizer has a bug
 * where the second differently-sized request for an already-requested source
 * silently never resolves (confirmed: matching the two sizes made it work,
 * mismatched sizes reproduced it every time). The logo is already a small,
 * fixed asset with only two call sites, so skipping the optimizer here has
 * no real cost — safer than fighting a Next.js runtime bug.
 */
export function Logo({
  className,
  size = "default",
  showTagline = false,
}: {
  className?: string
  size?: "default" | "lg"
  showTagline?: boolean
}) {
  const dimension = size === "lg" ? 52 : 40

  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label="WoodLane — home">
      <span className="flex shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-black/5">
        <Image
          src="/images/woodlane.jpeg"
          alt="WoodLane"
          width={dimension}
          height={dimension}
          unoptimized
          className="object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif font-bold tracking-tight",
            size === "lg" ? "text-2xl" : "text-xl lg:text-[1.375rem]",
          )}
        >
          Wood<span className="text-accent">Lane</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.26em] opacity-60">
            Crafting Excellence
          </span>
        )}
      </span>
    </Link>
  )
}

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "15+", label: "Years of craft" },
  { value: "500+", label: "Homes fitted" },
  { value: "7", label: "Door categories" },
  { value: "100%", label: "Seasoned timber" },
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-white">
      {/* Backdrop — this is the homepage's LCP element, so it's fetched with priority. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/elegant-wooden-main-door-with-carved-details.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover animate-fade"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pb-14 pt-32 lg:px-8 lg:pb-20 lg:pt-40">
        <div className="max-w-3xl">
          <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-sm">
            <Star className="size-3.5 fill-accent text-accent" />
            Bengaluru&rsquo;s door specialists
          </p>

          <h1
            className="animate-rise mt-6 text-balance text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
            style={{ animationDelay: "80ms" }}
          >
            Doors that hold
            <br />
            the <span className="italic text-accent">whole house</span> together
          </h1>

          <p
            className="animate-rise mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/75 lg:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            Made-to-measure teak and solid-wood doors, cut and finished in our own
            workshop — from grand carved entrances to quiet bedroom panels.
          </p>

          <div
            className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <Button
              asChild
              size="lg"
              className="group h-13 rounded-full bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/doors">
                Explore the collection
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-full border-white/30 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            >
              <Link href="/contact">Book a consultation</Link>
            </Button>
          </div>
        </div>

        {/* Stat bar */}
        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md sm:grid-cols-4 lg:mt-20">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink/40 px-5 py-6 text-center sm:px-6">
              <dt className="font-serif text-3xl font-bold text-accent lg:text-4xl">{s.value}</dt>
              <dd className="mt-1.5 text-xs uppercase tracking-[0.14em] text-white/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

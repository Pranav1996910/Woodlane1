import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "15+", label: "Years in the trade" },
  { value: "500+", label: "Homes fitted" },
  { value: "100%", label: "Seasoned timber" },
]

export function About() {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Layered imagery */}
          <div className="reveal relative order-2 lg:order-1 lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted sm:aspect-[4/3] lg:aspect-[5/6]">
              <Image
                src="/woodworking-craftsman-working-on-furniture-in-work.jpg"
                alt="A WoodLane craftsman planing a door panel in the workshop"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Overlapping detail shot */}
            <div className="absolute -bottom-8 -right-4 hidden aspect-square w-44 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-[var(--shadow-lift)] sm:block lg:-right-10 lg:w-56">
              <Image
                src="/solid-carved-wooden-main-door.jpg"
                alt="Close detail of hand-carved door panelling"
                fill
                sizes="(min-width: 1024px) 224px, 176px"
                className="object-cover"
              />
            </div>

            {/* Brass accent frame */}
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-4 -z-10 hidden size-40 rounded-2xl border-2 border-accent/40 lg:block"
            />
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <p className="eyebrow">Our workshop</p>
            <h2 className="mt-4 text-balance text-4xl font-bold text-foreground lg:text-5xl">
              Craftsmanship that outlasts the house it&rsquo;s fitted in
            </h2>

            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                WoodLane started in 2009 with one bench, one saw and a stubborn view that a
                door should still swing true fifteen years later.
              </p>
              <p>
                We buy timber whole, season it ourselves, and cut every door to the opening
                it&rsquo;s going into. Carving, jointing and finishing all happen under one roof —
                which is why we can promise the door you were shown is the door that arrives.
              </p>
            </div>

            <figure className="mt-8 border-l-2 border-accent pl-6">
              <Quote className="size-5 text-accent" />
              <blockquote className="mt-3 font-serif text-xl italic leading-relaxed text-foreground">
                &ldquo;Fit it like it&rsquo;s going in your own house.&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm text-muted-foreground">
                The only instruction our installers get.
              </figcaption>
            </figure>

            <dl className="mt-10 grid grid-cols-3 divide-x divide-border border-y border-border py-7">
              {stats.map((s) => (
                <div key={s.label} className="px-2 first:pl-0">
                  <dt className="font-serif text-3xl font-bold text-primary lg:text-4xl">{s.value}</dt>
                  <dd className="mt-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>

            <Button asChild size="lg" variant="outline" className="group mt-9 h-12 rounded-full px-7">
              <Link href="/contact">
                Talk to the workshop
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

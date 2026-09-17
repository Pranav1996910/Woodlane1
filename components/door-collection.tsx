import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const doorCategories = [
  {
    name: "Main Doors",
    description: "Grand carved entrances that set the tone for the whole house.",
    image: "/elegant-wooden-main-door-with-carved-details.jpg",
    category: "main",
    featured: true,
  },
  {
    name: "Pooja Room Doors",
    description: "Traditional motifs, hand-carved.",
    image: "/traditional-pooja-room-wooden-doors-with-spiritual.jpg",
    category: "pooja",
  },
  {
    name: "Bedroom Doors",
    description: "Quiet, solid and softly finished.",
    image: "/modern-bedroom-door-with-sleek-wooden-design.jpg",
    category: "bedroom",
  },
  {
    name: "Bathroom Doors",
    description: "Moisture-sealed for wet areas.",
    image: "/minimalist-bathroom-door-with-moisture-resistant-w.jpg",
    category: "bathroom",
  },
  {
    name: "Balcony Doors",
    description: "Glass and timber, wide open.",
    image: "/glass-and-wood-balcony-sliding-doors-with-natural-.jpg",
    category: "balcony",
  },
  {
    name: "Office Doors",
    description: "Clean lines for workspaces.",
    image: "/professional-office-door-with-modern-frame.jpg",
    category: "office",
  },
  {
    name: "P.G. Doors",
    description: "Hard-wearing for shared homes.",
    image: "/durable-wooden-door-for-shared-residential-space.jpg",
    category: "pg",
  },
]

function DoorCard({
  door,
  index,
  featured = false,
}: {
  door: (typeof doorCategories)[number]
  index: number
  featured?: boolean
}) {
  return (
    <Link
      href="/doors"
      className={cn(
        "reveal group relative isolate overflow-hidden rounded-2xl bg-ink",
        "ring-1 ring-border transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        featured ? "sm:col-span-2 sm:row-span-2" : "",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[4/5] sm:aspect-auto sm:h-full" : "aspect-[4/5]")}>
        <Image
          src={door.image || "/placeholder.svg"}
          alt={door.name}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 50vw, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <span className="absolute left-5 top-5 font-mono text-xs tracking-widest text-white/50">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-6">
        <div>
          <h3
            className={cn(
              "font-serif font-semibold text-white",
              featured ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl",
            )}
          >
            {door.name}
          </h3>
          <p
            className={cn(
              "mt-1.5 text-white/65",
              featured ? "max-w-sm text-sm lg:text-base" : "text-xs lg:text-sm",
            )}
          >
            {door.description}
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}

export function DoorCollection() {
  const [featured, ...rest] = doorCategories

  return (
    <section id="collection" className="bg-secondary/40 py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">The collection</p>
            <h2 className="mt-4 text-balance text-4xl font-bold text-foreground lg:text-5xl">
              A door for every room you walk through
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              Seven categories, each detailed for the way that room is actually used —
              carved and weighted at the entrance, sealed and light at the bathroom.
            </p>
          </div>
          <Link
            href="/doors"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground"
          >
            View all doors
            <span className="flex size-8 items-center justify-center rounded-full ring-1 ring-border transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>

        {/*
          4-column bento: the featured card holds a 2x2 block, the six remaining
          categories fill around it, and a bespoke-enquiry tile closes the last
          row so the grid ends flush.
        */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          <DoorCard door={featured} index={0} featured />
          {rest.map((door, i) => (
            <DoorCard key={door.category} door={door} index={i + 1} />
          ))}

          <Link
            href="/contact"
            className="reveal group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-border bg-background p-6 transition-colors duration-300 hover:border-primary/50 hover:bg-card sm:col-span-2 lg:min-h-[13rem]"
          >
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground lg:text-2xl">
                Something else in mind?
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Sliding, pivot, double-leaf, or a design you saw somewhere else — send us the
                photo and we&rsquo;ll build it to your opening.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Start a bespoke enquiry
              <span className="flex size-8 items-center justify-center rounded-full ring-1 ring-border transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                <ArrowUpRight className="size-4" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

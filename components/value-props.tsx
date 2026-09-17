import { Ruler, TreePine, ShieldCheck, Hammer } from "lucide-react"

const items = [
  {
    icon: Ruler,
    title: "Made to measure",
    body: "Every door is cut to your opening — no trimming a stock size to fit.",
  },
  {
    icon: TreePine,
    title: "Seasoned hardwood",
    body: "Kiln-dried teak, sal and mahogany that won't warp through a monsoon.",
  },
  {
    icon: ShieldCheck,
    title: "Termite treated",
    body: "Pressure-treated core with a hand-rubbed melamine or PU finish.",
  },
  {
    icon: Hammer,
    title: "Fitted by us",
    body: "Frame, hinges, hardware and alignment handled by our own installers.",
  },
]

export function ValueProps() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="reveal">
              <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary ring-1 ring-border">
                <Icon className="size-5" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

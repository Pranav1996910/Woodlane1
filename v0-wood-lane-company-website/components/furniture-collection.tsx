import { Card, CardContent } from "@/components/ui/card"

const furniture = [
  {
    name: "Dining Tables",
    description: "Where memories are made",
    image: "/handcrafted-wooden-dining-table-with-natural-wood-.jpg",
  },
  {
    name: "Cabinets",
    description: "Storage meets sophistication",
    image: "/modern-wooden-cabinet-with-elegant-design-and-stor.jpg",
  },
  {
    name: "Shelving",
    description: "Display your treasures beautifully",
    image: "/wooden-shelving-unit-with-modern-minimalist-design.jpg",
  },
  {
    name: "Desks",
    description: "Workspace designed for inspiration",
    image: "/handcrafted-wooden-desk-with-clean-modern-lines.jpg",
  },
  {
    name: "Bed Frames",
    description: "Rest in timeless comfort",
    image: "/wooden-bed-frame-with-elegant-headboard-design.jpg",
  },
  {
    name: "Seating",
    description: "Comfort crafted to perfection",
    image: "/wooden-chairs-and-benches-with-comfortable-design.jpg",
  },
]

export function FurnitureCollection() {
  return (
    <section id="furniture" className="py-20 lg:py-32 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Furniture Collection
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From dining rooms to bedrooms, our furniture pieces are designed to elevate every corner of your home with
            enduring style and quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {furniture.map((item, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden border-border hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

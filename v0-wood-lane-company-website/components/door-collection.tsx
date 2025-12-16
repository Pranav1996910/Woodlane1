import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const doorCategories = [
  {
    name: "MAIN DOORS",
    description: "Grand entrances that make a lasting first impression",
    image: "/elegant-wooden-main-door-with-carved-details.jpg",
    category: "main",
  },
  {
    name: "POOJA ROOM DOORS",
    description: "Sacred spaces with traditional craftsmanship",
    image: "/traditional-pooja-room-wooden-doors-with-spiritual.jpg",
    category: "pooja",
  },
  {
    name: "BEDROOM DOORS",
    description: "Privacy and style for your personal sanctuary",
    image: "/modern-bedroom-door-with-sleek-wooden-design.jpg",
    category: "bedroom",
  },
  {
    name: "BATHROOM DOORS",
    description: "Moisture-resistant designs for wet areas",
    image: "/minimalist-bathroom-door-with-moisture-resistant-w.jpg",
    category: "bathroom",
  },
  {
    name: "BALCONY DOORS",
    description: "Connect indoor comfort with outdoor beauty",
    image: "/glass-and-wood-balcony-sliding-doors-with-natural-.jpg",
    category: "balcony",
  },
  {
    name: "OFFICE DOORS",
    description: "Professional aesthetics for workspace environments",
    image: "/professional-office-door-with-modern-frame.jpg",
    category: "office",
  },
  {
    name: "P.G. DOORS",
    description: "Durable solutions for shared living spaces",
    image: "/durable-wooden-door-for-shared-residential-space.jpg",
    category: "pg",
  },
]

export function DoorCollection() {
  return (
    <section id="doors" className="py-20 lg:py-32 px-4 lg:px-8 bg-secondary/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Door Collection
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore our comprehensive range of door categories, each designed for specific spaces and purposes with
            meticulous attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doorCategories.map((door, index) => (
            <Link key={index} href={`/doors`}>
              <Card className="group cursor-pointer overflow-hidden border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={door.image || "/placeholder.svg"}
                      alt={door.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{door.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{door.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

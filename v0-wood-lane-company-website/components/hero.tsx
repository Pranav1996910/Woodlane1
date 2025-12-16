import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 text-balance leading-tight">
            Crafted with precision, designed for life
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your space with handcrafted doors that blend timeless design with exceptional quality and
            sustainable materials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/doors`}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                Explore Collection →
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
            <img
              src="/modern-wooden-door-with-glass-panels-in-elegant-ho.jpg"
              alt="Premium wooden door"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
            <img
              src="/handcrafted-wooden-furniture-dining-table-and-chai.jpg"
              alt="Handcrafted furniture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

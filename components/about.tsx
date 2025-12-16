export function About() {
  return (
    <section id="about" className="py-20 lg:py-32 px-4 lg:px-8 bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted order-2 lg:order-1">
            <img src="/woodworking-craftsman-working-on-furniture-in-work.jpg" alt="Craftsmanship" className="w-full h-full object-cover" />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
              Craftsmanship that stands the test of time
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                At WoodLane, we believe that furniture and doors are more than functional pieces—they're investments in
                your home's character and your family's comfort.
              </p>
              <p>
                Founded with a passion for woodworking and sustainable design, we combine traditional craftsmanship with
                modern techniques to create pieces that last generations.
              </p>
              <p>
                Every item in our collection is handcrafted by skilled artisans using responsibly sourced materials,
                ensuring that your purchase supports both quality and environmental stewardship.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-serif font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Sustainable Wood</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

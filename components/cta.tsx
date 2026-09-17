import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <Image
        src="/rustic-wooden-door-with-natural-wood-grain-texture.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-15"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-primary/95 to-primary/75" />

      <div className="container mx-auto px-4 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-balance text-4xl font-bold lg:text-5xl">
              Measuring is free. So is the advice.
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-primary-foreground/75">
              Send us your openings — or just a photo of the doorway — and we&rsquo;ll come back
              with options, timber choices and a fixed quote within two working days.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
            <Button
              asChild
              size="lg"
              className="group h-13 rounded-full bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/contact">
                Request a quote
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-full border-primary-foreground/30 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href="tel:+918147478341">
                <Phone className="size-4" />
                Call the workshop
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

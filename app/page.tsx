import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ValueProps } from "@/components/value-props"
import { DoorCollection } from "@/components/door-collection"
import { Process } from "@/components/process"
import { About } from "@/components/about"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <ValueProps />
        <DoorCollection />
        <Process />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

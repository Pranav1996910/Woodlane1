import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { DoorCollection } from "@/components/door-collection"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <DoorCollection />
      <About />
      <Footer />
    </main>
  )
}

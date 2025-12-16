import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded" />
            <span className="text-xl lg:text-2xl font-serif font-semibold text-foreground">WoodLane</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#doors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Doors
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Quote</Button>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/doors", label: "Doors" },
  { href: "/#collection", label: "Collection" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const PHONE = "+91 81474 78341"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the mobile sheet whenever we land on a new route.
  useEffect(() => setOpen(false), [pathname])

  // Lock body scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/85 text-foreground shadow-[0_1px_20px_-12px_oklch(0.3_0.03_55/0.5)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent text-white",
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <Logo />

            <nav className="hidden items-center gap-9 md:flex">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group relative text-sm font-medium transition-colors",
                      scrolled
                        ? active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                        : active
                          ? "text-white"
                          : "text-white/75 hover:text-white",
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300",
                        active ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className={cn(
                  "hidden items-center gap-2 text-sm font-medium transition-colors lg:flex",
                  scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/75 hover:text-white",
                )}
              >
                <Phone className="size-3.5 text-accent" />
                {PHONE}
              </a>
              <Button
                asChild
                size="lg"
                className={cn(
                  "hidden rounded-full sm:inline-flex",
                  !scrolled && "bg-accent text-accent-foreground hover:bg-accent/90",
                )}
              >
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className={cn(
                  "-mr-2 inline-flex size-10 items-center justify-center rounded-full transition-colors md:hidden",
                  scrolled ? "hover:bg-secondary" : "hover:bg-white/15",
                )}
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col bg-background shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <span className="font-serif text-lg font-semibold">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-col p-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-4 py-3.5 font-serif text-lg text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
                <span className="text-accent">→</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-3 border-t border-border p-5">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Phone className="size-4 text-accent" />
              {PHONE}
            </a>
            <Button asChild className="w-full rounded-full" size="lg">
              <Link href="/contact" onClick={() => setOpen(false)}>
                Get a Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

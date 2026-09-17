import Link from "next/link"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { Logo } from "@/components/logo"

const productLinks = [
  { href: "/doors", label: "All doors" },
  { href: "/#collection", label: "Main doors" },
  { href: "/#collection", label: "Pooja room doors" },
  { href: "/#collection", label: "Bedroom doors" },
  { href: "/#collection", label: "Balcony doors" },
]

const companyLinks = [
  { href: "/#about", label: "About us" },
  { href: "/#process", label: "How we work" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
]

export function Footer() {
  return (
    <footer id="contact" className="grain relative overflow-hidden bg-ink text-ink-foreground">
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo size="lg" showTagline />

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
              Made-to-measure hardwood doors, cut, carved and finished in our own Bengaluru
              workshop since 2009.
            </p>

            <div className="mt-7 flex items-start gap-2.5 text-sm text-white/55">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                Mon&ndash;Sat, 9:30am &ndash; 7:00pm
                <br />
                Sunday by appointment
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="lg:col-span-2" aria-label="Products">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Doors</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/65 transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label="Company">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Company</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/65 transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Visit or call</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href="tel:+918147478341"
                  className="flex items-start gap-3 text-white/65 transition-colors hover:text-accent"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                  +91 81474 78341
                </a>
              </li>
              <li>
                <a
                  href="mailto:woodlanedoors@gmail.com"
                  className="flex items-start gap-3 text-white/65 transition-colors hover:text-accent"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                  woodlanedoors@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=285+4th+Cross+Health+Layout+Annapoorneshwari+Nagar+2nd+Stage+Nagarabhavi+Bengaluru+560091"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 leading-relaxed text-white/65 transition-colors hover:text-accent"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  285, 4th Cross, Health Layout, Annapoorneshwari Nagar, 2nd Stage,
                  Nagarabhavi, Bengaluru, Karnataka 560091
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-sm text-white/45 md:flex-row">
          <p>&copy; {new Date().getFullYear()} WoodLane. All rights reserved.</p>
          <div className="flex gap-7">
            <Link href="/privacy" className="transition-colors hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-accent">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

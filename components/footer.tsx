import Link from "next/link"
import Image from "next/image" // 1. Import the Image component

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* 2. Replaced div with Image component */}
              <Image
                src="./images/woodlane.jpeg"          // Ensure your logo is in the public folder
                alt="WoodLane Logo"
                width={60}               // Adjust width as needed
                height={60}              // Adjust height as needed
                className="object-contain"
                priority                 // Ensures the logo loads fast
              />
              <span className="text-xl font-serif font-semibold">WoodLane</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Crafting premium doors with passion and precision since 2009.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="#doors" className="hover:text-primary-foreground transition-colors">
                  Door Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="#about" className="hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
          <p>© 2025 WoodLane. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

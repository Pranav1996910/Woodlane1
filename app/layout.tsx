import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { ScrollReveal } from "@/components/scroll-reveal"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://woodlane.example"),
  title: {
    default: "WoodLane — Made-to-measure hardwood doors in Bengaluru",
    template: "%s | WoodLane",
  },
  description:
    "Made-to-measure teak and solid-wood doors, cut and finished in our own Bengaluru workshop — from carved main entrances to bedroom, pooja, bathroom and balcony doors.",
  keywords: [
    "wooden doors Bengaluru",
    "teak doors",
    "custom main door",
    "pooja room doors",
    "carved wooden doors",
  ],
  openGraph: {
    title: "WoodLane — Made-to-measure hardwood doors",
    description:
      "Cut, carved and finished in our own workshop. Free measurement and a fixed quote in two working days.",
    type: "website",
    locale: "en_IN",
    siteName: "WoodLane",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#2b1c12",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <ScrollReveal />
      </body>
    </html>
  )
}

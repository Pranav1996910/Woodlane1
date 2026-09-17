"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const companyInfo = {
  phone: "+91 81474 78341",
  email: "woodlanedoors@gmail.com",
  address:
    "285, 4th Cross, Health Layout, Annapoorneshwari Nagar, 2nd Stage, Nagarabhavi, Bengaluru, Karnataka 560091",
  hours: "Mon–Sat, 9:30am – 7:00pm",
}

const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(companyInfo.address)}`

export default function ContactFormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    if (submissionStatus !== "idle") setSubmissionStatus("idle")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to send email via API.")

      setSubmissionStatus("success")
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (error) {
      console.error("Submission Error:", error)
      setSubmissionStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactItems = [
    {
      icon: Phone,
      label: "Call the workshop",
      value: companyInfo.phone,
      href: `tel:${companyInfo.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email us",
      value: companyInfo.email,
      href: `mailto:${companyInfo.email}`,
    },
    {
      icon: MapPin,
      label: "Visit us",
      value: companyInfo.address,
      href: mapsUrl,
      external: true,
    },
    { icon: Clock, label: "Opening hours", value: companyInfo.hours },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Page hero */}
        <section className="relative isolate flex min-h-[42vh] items-end overflow-hidden bg-ink pb-12 pt-32 text-white lg:min-h-[46vh] lg:pb-16 lg:pt-40">
          <Image
            src="/elegant-wooden-doors-background.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 to-ink/45" />

          <div className="container mx-auto px-4 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-white/55">
              <Link href="/" className="transition-colors hover:text-accent">
                Home
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-white/85">Contact</span>
            </nav>

            <h1 className="animate-rise mt-5 max-w-3xl text-balance text-4xl font-bold leading-[1.05] lg:text-6xl">
              Let&rsquo;s talk about your doorway
            </h1>
            <p className="animate-rise mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/70">
              Free measurement across Bengaluru, and a fixed itemised quote within two working days.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Details */}
            <aside className="lg:col-span-5">
              <p className="eyebrow">Get in touch</p>
              <h2 className="mt-4 text-balance text-3xl font-bold text-foreground lg:text-4xl">
                Reach us however suits you
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Prefer to skip the form? Call or WhatsApp the workshop directly — you&rsquo;ll usually
                get one of the people who&rsquo;ll actually build your door.
              </p>

              <ul className="mt-9 space-y-1">
                {contactItems.map(({ icon: Icon, label, value, href, external }) => {
                  const body = (
                    <>
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary ring-1 ring-border transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                        <Icon className="size-4.5" strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                          {label}
                        </span>
                        <span className="mt-1 block text-[0.9375rem] leading-relaxed text-foreground">
                          {value}
                        </span>
                      </span>
                    </>
                  )

                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group flex gap-4 rounded-xl p-3 transition-colors hover:bg-secondary/60"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="group flex gap-4 p-3">{body}</div>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Not sure what you need yet?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Browse the collection first — most people find it easier to point at a door than
                  describe one.
                </p>
                <Link
                  href="/doors"
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  See the door collection
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] lg:p-10">
                <h2 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us the room, rough opening size and any style you have in mind. Fields marked
                  <span aria-hidden="true" className="text-accent-foreground/70">
                    {" "}
                    *
                  </span>{" "}
                  are required.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 …"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Main door for a 3BHK"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Which rooms, roughly what sizes, and any timber or finish you have in mind."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="resize-y"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full rounded-full text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send message"
                    )}
                  </Button>

                  <p aria-live="polite" className="sr-only">
                    {submissionStatus === "success"
                      ? "Message sent"
                      : submissionStatus === "error"
                        ? "Message failed to send"
                        : ""}
                  </p>

                  {submissionStatus === "success" && (
                    <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-success" />
                      <span>
                        <strong className="font-semibold">Message sent.</strong> We&rsquo;ll get back to
                        you within one working day — usually much sooner.
                      </span>
                    </div>
                  )}

                  {submissionStatus === "error" && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
                      <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-destructive" />
                      <span>
                        <strong className="font-semibold">That didn&rsquo;t go through.</strong> Please
                        try again, or call us on{" "}
                        <a
                          href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
                          className="font-semibold underline underline-offset-4"
                        >
                          {companyInfo.phone}
                        </a>
                        .
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export type LegalContent = { heading?: string; text: string }
export type LegalSection = { title: string; content: LegalContent[] }

/** Renders the light `**bold**` markup used in the policy copy. */
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith("**") && chunk.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{chunk}</span>
    ),
  )
}

/**
 * The policy copy is authored as loose text with `- ` bullets and `**bold**`.
 * Group consecutive bullet lines into real lists so it reads as a document
 * rather than a wall of pre-wrapped text.
 */
function renderBody(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  const blocks: ReactNode[] = []
  let bullets: string[] = []

  const flush = () => {
    if (!bullets.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-4 space-y-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="relative pl-5 leading-relaxed">
            <span className="absolute left-0 top-[0.6em] size-1.5 rounded-full bg-accent" />
            {renderInline(b)}
          </li>
        ))}
      </ul>,
    )
    bullets = []
  }

  for (const line of lines) {
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2))
    } else {
      flush()
      blocks.push(
        <p key={`p-${blocks.length}`} className="my-3 leading-relaxed">
          {renderInline(line)}
        </p>,
      )
    }
  }
  flush()

  return blocks
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function LegalPage({
  title,
  intro,
  effectiveDate,
  sections,
  closing,
}: {
  title: string
  intro: string
  effectiveDate: string
  sections: LegalSection[]
  closing?: string
}) {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <section className="relative isolate flex min-h-[36vh] items-end overflow-hidden bg-ink pb-11 pt-32 text-white lg:min-h-[40vh] lg:pb-14 lg:pt-40">
          <Image
            src="/rustic-wooden-door-with-natural-wood-grain-texture.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover opacity-40"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/85 to-ink/60" />

          <div className="container mx-auto px-4 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-white/55">
              <Link href="/" className="transition-colors hover:text-accent">
                Home
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-white/85">{title}</span>
            </nav>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] lg:text-5xl">{title}</h1>
            <p className="mt-4 text-sm text-white/60">Effective {effectiveDate}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-14 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Contents */}
            <nav aria-label="On this page" className="lg:w-64 lg:shrink-0">
              <div className="lg:sticky lg:top-28">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  On this page
                </h2>
                <ol className="mt-5 space-y-2.5 border-l border-border">
                  {sections.map((s) => (
                    <li key={s.title}>
                      <a
                        href={`#${slug(s.title)}`}
                        className="-ml-px block border-l-2 border-transparent pl-4 text-sm leading-snug text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {/* Document */}
            <article className="min-w-0 max-w-2xl flex-1">
              <p className="text-lg leading-relaxed text-muted-foreground">{intro}</p>

              <div className="rule-brass my-10" />

              <div className="space-y-12">
                {sections.map((section) => (
                  <section key={section.title} id={slug(section.title)} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl font-bold text-foreground">{section.title}</h2>
                    <div className="mt-4 text-[0.9375rem] text-muted-foreground">
                      {section.content.map((item, i) => (
                        <div key={i}>
                          {item.heading && (
                            <h3 className="mt-6 text-base font-semibold text-foreground first:mt-0">
                              {item.heading}
                            </h3>
                          )}
                          {renderBody(item.text)}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {closing && (
                <>
                  <div className="rule-brass my-10" />
                  <p className="text-sm text-muted-foreground">{closing}</p>
                </>
              )}

              <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">Questions about this?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Write to us at{" "}
                  <a
                    href="mailto:woodlanedoors@gmail.com"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    woodlanedoors@gmail.com
                  </a>{" "}
                  and we&rsquo;ll come back to you.
                </p>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

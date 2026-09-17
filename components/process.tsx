const steps = [
  {
    step: "01",
    title: "Measure & consult",
    body: "We visit the site, measure every opening and talk through timber, finish and hardware.",
  },
  {
    step: "02",
    title: "Design & quote",
    body: "You get drawings and a fixed, itemised quote — no surprises once the wood is cut.",
  },
  {
    step: "03",
    title: "Craft in workshop",
    body: "Seasoned timber is cut, joined, carved and finished by hand in our Bengaluru workshop.",
  },
  {
    step: "04",
    title: "Fit & finish",
    body: "Our own team installs the frame and door, aligns the hardware and cleans up after.",
  },
]

export function Process() {
  return (
    <section id="process" className="grain relative overflow-hidden bg-ink py-20 text-ink-foreground lg:py-28">
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-white/55">How it works</p>
          <h2 className="mt-4 text-balance text-4xl font-bold lg:text-5xl">
            Four steps from doorway to doorway
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-white/60">
            One team from the first measurement to the final hinge — nothing gets handed
            off to a subcontractor halfway through.
          </p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, body }) => (
            <li key={step} className="reveal group relative bg-ink p-7 transition-colors duration-500 hover:bg-white/[0.04] lg:p-8">
              <span className="font-mono text-sm tracking-[0.2em] text-accent">{step}</span>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
              <span className="mt-6 block h-px w-10 bg-accent/50 transition-all duration-500 group-hover:w-full" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

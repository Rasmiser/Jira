const testimonials = [
  {
    quote:
      "RASMISER is a required gate in every release now. We catch insecure storage and hardcoded secrets before they ever reach the store.",
    name: "Sarah Chen",
    role: "CTO, Meridian Labs",
  },
  {
    quote:
      "The AI-written reports turned a week of manual pentesting into a five-minute scan our developers can actually act on.",
    name: "Marcus Webb",
    role: "Head of Mobile, Flux Systems",
  },
  {
    quote:
      "Wiring it into CI means critical findings fail the build automatically. We haven't shipped a critical bug since.",
    name: "Elena Rodriguez",
    role: "VP Engineering, Beacon AI",
  },
  {
    quote:
      "Mapping every finding to OWASP MASVS made our compliance audit painless. The auditors had everything they needed.",
    name: "James Liu",
    role: "CISO, Prism Analytics",
  },
]

const logos = ["Meridian", "Flux", "Beacon", "Prism", "Northwind", "Vertex"]

export function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Testimonials</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by mobile teams that ship fast
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-xl border border-slate-200 bg-white p-8">
              <blockquote className="text-pretty text-lg leading-relaxed text-slate-800">
                {`"${t.quote}"`}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{t.name}</span>
                  <span className="block text-sm text-slate-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
          {logos.map((logo) => (
            <span key={logo} className="text-lg font-semibold tracking-tight text-slate-400">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

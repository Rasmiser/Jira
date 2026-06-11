import { ShieldCheck } from "lucide-react"

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

const audiences = [
  "Indie developers",
  "Mobile startups",
  "Fintech & banking apps",
  "Healthcare apps",
  "Agencies & consultancies",
  "Enterprise security teams",
]

const standards = [
  { name: "OWASP MASVS", detail: "Mobile App Security Verification Standard" },
  { name: "OWASP Mobile Top 10", detail: "Most critical mobile risks" },
  { name: "CWE", detail: "Common Weakness Enumeration" },
  { name: "CVSS", detail: "Common Vulnerability Scoring System" },
]

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

        <div className="mt-16 border-t border-slate-200 pt-12">
          <p className="text-center text-sm font-medium text-slate-500">Built for teams of every size</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {audiences.map((audience) => (
              <span
                key={audience}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700"
              >
                {audience}
              </span>
            ))}
          </div>

          <p className="mt-12 text-center text-sm font-medium text-slate-500">
            Aligned with recognized security standards
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {standards.map((standard) => (
              <div
                key={standard.name}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-4 py-5 text-center"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-3 text-sm font-semibold text-slate-900">{standard.name}</span>
                <span className="mt-1 text-xs leading-relaxed text-slate-500">{standard.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

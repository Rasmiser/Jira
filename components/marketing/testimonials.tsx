import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Found 12 security issues before launch — including a hardcoded API key that would have been a nightmare. RASMISER is now a required gate in every release.",
    name: "Sarah Chen",
    role: "CTO",
    company: "Meridian Labs",
    initials: "SC",
  },
  {
    quote:
      "The AI-written reports turned a week of manual pentesting into a five-minute scan our developers can actually act on. ROI was instant.",
    name: "Marcus Webb",
    role: "Head of Mobile",
    company: "Flux Systems",
    initials: "MW",
  },
  {
    quote:
      "Wiring it into CI means critical findings fail the build automatically. We haven't shipped a critical vulnerability since we added it six months ago.",
    name: "Elena Rodriguez",
    role: "VP Engineering",
    company: "Beacon AI",
    initials: "ER",
  },
  {
    quote:
      "Mapping every finding to OWASP MASVS made our compliance audit painless. The auditors had everything they needed in one PDF.",
    name: "James Liu",
    role: "CISO",
    company: "Prism Analytics",
    initials: "JL",
  },
  {
    quote:
      "We scan every APK before it hits the Play Store. It caught insecure Bluetooth pairing logic in our IoT companion app that a manual review missed entirely.",
    name: "Aisha Patel",
    role: "Lead Android Engineer",
    company: "NovaTech",
    initials: "AP",
  },
  {
    quote:
      "Our clients ask for security attestation before every release. RASMISER gives us a professional, MASVS-mapped PDF that satisfies enterprise procurement every time.",
    name: "Tom Eriksson",
    role: "Founder",
    company: "SwiftSec Agency",
    initials: "TE",
  },
]

// Placeholder company logos rendered as text wordmarks
const trustedCompanies = [
  "Meridian Labs",
  "Flux Systems",
  "Beacon AI",
  "Prism Analytics",
  "NovaTech",
  "SwiftSec",
  "Axon Mobile",
  "Cirrus Health",
]

export function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Testimonials</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by mobile teams that ship fast
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            From indie devs to enterprise security teams, RASMISER is the last line of defense before every release.
          </p>
        </div>

        {/* Trusted-by logo bar */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustedCompanies.map((name) => (
              <span key={name} className="text-sm font-semibold text-slate-400">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <div>
                <Quote className="h-5 w-5 text-blue-200" aria-hidden="true" />
                <blockquote className="mt-3 text-pretty text-sm leading-relaxed text-slate-700">
                  {`"${t.quote}"`}
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{t.name}</span>
                  <span className="block text-xs text-slate-500">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { Check, ArrowRight, Calculator } from "lucide-react"

type Tier = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything an individual or small team needs to ship secure mobile apps.",
    features: [
      "Unlimited Android & iOS scans",
      "Full OWASP MASVS reports",
      "Runtime protection included",
    ],
    cta: { label: "Start scanning free", href: "/sign-up" },
  },
  {
    name: "Team",
    price: "$30",
    period: "per month",
    description: "Collaboration and workflow integrations for teams shipping on a release cadence.",
    features: [
      "Everything in Free",
      "Shared workspace & roles",
      "Jira sync + CI/CD automation",
    ],
    cta: { label: "Upgrade to Team", href: "/dashboard/billing?plan=team" },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "$60",
    period: "per month",
    description: "Advanced governance, compliance, and support for security-critical organizations.",
    features: [
      "Everything in Team",
      "SSO / SAML & SCIM",
      "Dedicated engineer + SLA",
    ],
    cta: { label: "Upgrade to Enterprise", href: "/dashboard/billing?plan=enterprise" },
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Pricing</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Start free, scale when your team does
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            Unlimited scanning and runtime protection are free forever. Upgrade only when you need collaboration,
            integrations, and enterprise governance.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                tier.featured
                  ? "border-blue-600 bg-white shadow-xl shadow-blue-900/10 ring-1 ring-blue-600"
                  : "border-slate-200 bg-white"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-slate-900">{tier.price}</span>
                <span className="text-sm text-slate-500">{tier.period}</span>
              </div>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600">{tier.description}</p>

              <Link
                href={tier.cta.href}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                  tier.featured
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tier.cta.label}
              </Link>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Compare all plan features
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
            •
          </span>
          <Link
            href="/roi-calculator"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 transition-colors hover:text-slate-900"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Estimate your breach-risk savings
          </Link>
        </div>
      </div>
    </section>
  )
}

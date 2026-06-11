import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { SiteFooter } from "@/components/marketing/site-footer"

export const metadata: Metadata = {
  title: "Pricing | RASMISER",
  description:
    "Simple, transparent pricing for mobile app security. Every core scanning and runtime protection feature is free. Upgrade for team collaboration and enterprise controls.",
}

type Tier = {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
  note?: string
}

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything an individual or small team needs to ship secure mobile apps.",
    features: [
      "Unlimited Android & iOS scans",
      "Full OWASP MASVS vulnerability reports",
      "Plain-English findings & fix guidance",
      "Runtime protection (anti-tamper, TLS pinning)",
      "AI feature security checks",
      "Community support",
    ],
    cta: { label: "Start scanning free", href: "/sign-up" },
    note: "No credit card required",
  },
  {
    name: "Team",
    price: "$0",
    period: "during beta",
    description: "Collaboration and workflow integrations for teams shipping on a release cadence.",
    features: [
      "Everything in Free",
      "Shared workspace & role-based access",
      "Jira issue sync for findings",
      "Scan history & trend tracking",
      "CI/CD scan automation",
      "Priority email support",
    ],
    cta: { label: "Start free", href: "/sign-up" },
    featured: true,
    note: "Free while in beta — no card required",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Advanced governance, compliance, and support for security-critical organizations.",
    features: [
      "Everything in Team",
      "SSO / SAML & SCIM provisioning",
      "Custom MASVS policy & compliance reports",
      "Dedicated security engineer",
      "SLA-backed support",
      "On-prem / private deployment options",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link href="/sign-up" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Start free
          </Link>
        </div>
      </header>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Pricing</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Security that doesn&apos;t cost you a release
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
            Every core scanning and runtime protection feature is free. Pay only when you need enterprise-grade
            governance and support.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-start gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                  tier.featured
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-900/10 ring-1 ring-blue-600"
                    : "border-slate-200 bg-white"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h2 className="text-lg font-semibold text-slate-900">{tier.name}</h2>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{tier.price}</span>
                  {tier.period && <span className="text-sm text-slate-500">/ {tier.period}</span>}
                </div>
                <p className="mt-3 text-pretty leading-relaxed text-slate-600">{tier.description}</p>

                <Link
                  href={tier.cta.href}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
                    tier.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tier.cta.label}
                </Link>
                {tier.note && <p className="mt-3 text-center text-xs text-slate-500">{tier.note}</p>}

                <ul className="mt-8 space-y-3 border-t border-slate-100 pt-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900">Not sure which plan fits?</h2>
            <p className="mt-2 text-pretty leading-relaxed text-slate-600">
              Book a demo and we&apos;ll walk through a real scan of your app and recommend the right setup for your team.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

import Link from "next/link"
import { Check } from "lucide-react"
import { PLAN_LIST } from "@/lib/plans"

function formatPrice(cents: number) {
  if (cents === 0) return "$0"
  return `$${(cents / 100).toFixed(0)}`
}

export function Pricing({ ctaHref }: { ctaHref: string }) {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Pricing</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple plans that scale with your releases
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            Start free, upgrade when you need more scans. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PLAN_LIST.map((plan) => {
            const popular = plan.id === "pro"
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                  popular
                    ? "border-blue-600 shadow-xl shadow-blue-600/10 ring-1 ring-blue-600"
                    : "border-slate-200"
                }`}
              >
                {popular && (
                  <span className="absolute -top-3 left-8 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">
                    {formatPrice(plan.priceInCents)}
                  </span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>

                <Link
                  href={ctaHref}
                  className={`mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.priceInCents === 0 ? "Start free" : `Choose ${plan.name}`}
                </Link>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

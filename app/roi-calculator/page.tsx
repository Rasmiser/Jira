import type { Metadata } from "next"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { RoiCalculator } from "@/components/marketing/roi-calculator"

export const metadata: Metadata = {
  title: "Mobile Breach Cost Calculator",
  description:
    "Estimate the cost of a mobile app data breach versus the cost of continuous security scanning with RASMISER. See your potential annual savings.",
  alternates: { canonical: "/roi-calculator" },
}

export default function RoiCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="px-4 pb-24 pt-32 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">ROI calculator</p>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              What would a mobile breach cost you?
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
              Adjust the inputs to estimate your breach exposure and how much continuous scanning with RASMISER could
              save you each year.
            </p>
          </div>

          <div className="mt-12">
            <RoiCalculator />
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
            Estimates are illustrative and based on publicly reported breach-cost research (such as per-record
            remediation costs and annualized breach likelihood). Actual costs vary by industry, geography, and
            incident. This tool is for planning guidance, not a guarantee.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

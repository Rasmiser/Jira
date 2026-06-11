import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Check, Minus } from "lucide-react"
import { SiteFooter } from "@/components/marketing/site-footer"

export const metadata: Metadata = {
  title: "RASMISER vs Appknox vs NowSecure | Mobile App Security Comparison",
  description:
    "See how RASMISER compares to Appknox and NowSecure on pricing, self-serve scanning, OWASP MASVS coverage, CI/CD integration, and runtime protection.",
}

type Cell = boolean | string

const competitors = ["RASMISER", "Appknox", "NowSecure"]

const rows: { feature: string; values: [Cell, Cell, Cell] }[] = [
  { feature: "Free tier to get started", values: [true, false, false] },
  { feature: "Self-serve scanning (no sales call)", values: [true, false, false] },
  { feature: "Starting price", values: ["$0 / $30 mo", "Custom quote", "Custom quote"] },
  { feature: "Static analysis (SAST)", values: [true, true, true] },
  { feature: "Malware & SDK detection", values: [true, true, true] },
  { feature: "OWASP MASVS mapping", values: [true, true, true] },
  { feature: "Plain-English AI remediation", values: [true, false, false] },
  { feature: "CI/CD security gates", values: [true, true, true] },
  { feature: "Runtime protection (RASP)", values: [true, "Add-on", true] },
  { feature: "Results in minutes", values: [true, "Hours", "Hours"] },
  { feature: "Built for indie & startup teams", values: [true, false, false] },
]

function CellValue({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center">
        <Check className="h-5 w-5 text-emerald-600" aria-label="Yes" />
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center">
        <Minus className="h-5 w-5 text-slate-300" aria-label="No" />
      </span>
    )
  }
  return <span className="text-sm font-medium text-slate-700">{value}</span>
}

export default function ComparePage() {
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
          <Link
            href="/sign-up"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start free
          </Link>
        </div>
      </header>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Comparison</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            RASMISER vs Appknox vs NowSecure
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
            Enterprise mobile security tools are powerful but gated behind sales calls and custom quotes. RASMISER gives
            every team self-serve scanning, transparent pricing, and a free tier to start today.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-900">
                    Capability
                  </th>
                  {competitors.map((name) => (
                    <th
                      key={name}
                      scope="col"
                      className={`px-6 py-4 text-center text-sm font-semibold ${
                        name === "RASMISER" ? "text-blue-700" : "text-slate-700"
                      }`}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? "bg-slate-50/50" : ""}>
                    <th scope="row" className="px-6 py-4 text-sm font-medium text-slate-700">
                      {row.feature}
                    </th>
                    {row.values.map((value, j) => (
                      <td
                        key={competitors[j]}
                        className={`px-6 py-4 text-center ${competitors[j] === "RASMISER" ? "bg-blue-50/40" : ""}`}
                      >
                        <CellValue value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Comparison based on publicly available information about Appknox and NowSecure as of {new Date().getFullYear()}.
            Product names are trademarks of their respective owners.
          </p>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Try it before you talk to anyone</h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-600">
              Upload a build and get a full OWASP MASVS report in minutes — no demo gate, no quote, no credit card.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Start free
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

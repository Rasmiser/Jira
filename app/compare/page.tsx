import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Check, Minus, Clock } from "lucide-react"
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

type Priority = "critical" | "important" | "planned"

interface RoadmapRow {
  feature: string
  description: string
  priority: Priority
  competitorHas: [boolean, boolean] // [Appknox, NowSecure]
}

const roadmapRows: RoadmapRow[] = [
  {
    feature: "SBOM generation (CycloneDX)",
    description: "Binary software bill of materials for every release — including shadow APIs and third-party CVEs.",
    priority: "critical",
    competitorHas: [true, true],
  },
  {
    feature: "Privacy data flow analysis",
    description: "Maps exactly what user data is collected, where it goes, and flags GDPR / HIPAA / CCPA compliance gaps.",
    priority: "critical",
    competitorHas: [false, true],
  },
  {
    feature: "IAST (Interactive Application Security Testing)",
    description: "Correlates SAST and DAST findings with runtime observations to reduce false positives.",
    priority: "critical",
    competitorHas: [false, true],
  },
  {
    feature: "Shadow API discovery",
    description: "Automatically discovers all APIs inside the binary — including undocumented endpoints — and tests each one.",
    priority: "critical",
    competitorHas: [true, false],
  },
  {
    feature: "OWASP MASVS / PCI DSS / GDPR compliance report export",
    description: "Audit-ready, exportable compliance reports for regulated industry sales cycles.",
    priority: "important",
    competitorHas: [true, true],
  },
  {
    feature: "CVSS scoring on all findings",
    description: "Industry-standard severity scores on every finding so security teams can triage by risk, not gut feel.",
    priority: "important",
    competitorHas: [true, false],
  },
  {
    feature: "Full CI/CD integrations (GitHub Actions, Jenkins, GitLab, Bitrise, Azure DevOps)",
    description: "Native pipeline integrations beyond API tokens — pre-built step definitions for all major CI platforms.",
    priority: "important",
    competitorHas: [true, true],
  },
  {
    feature: "AI SDK & library detection inside binaries",
    description: "Identifies AI/ML frameworks and third-party AI services embedded in your binary.",
    priority: "important",
    competitorHas: [false, true],
  },
  {
    feature: "App store monitoring (post-launch)",
    description: "Monitors app stores for fake, cloned, or repackaged versions of your app after release.",
    priority: "planned",
    competitorHas: [true, false],
  },
  {
    feature: "Manual penetration testing as a service (PTaaS)",
    description: "Certified security researchers perform manual penetration testing — results within 3–5 business days.",
    priority: "planned",
    competitorHas: [true, true],
  },
]

const PRIORITY_META: Record<Priority, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "border-red-500/40 bg-red-500/10 text-red-600",
  },
  important: {
    label: "Important",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  },
  planned: {
    label: "Planned",
    className: "border-blue-500/40 bg-blue-500/10 text-blue-600",
  },
}

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

          {/* Roadmap gap table */}
          <div className="mt-16">
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Roadmap</p>
              <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                What&apos;s coming to RASMISER
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-slate-600">
                We conducted a thorough competitive analysis. Here are the features we&apos;re building next, ranked by
                enterprise impact.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th scope="col" className="px-6 py-4 text-sm font-semibold text-slate-900">
                      Feature
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      Appknox
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                      NowSecure
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-blue-700">
                      RASMISER
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roadmapRows.map((row, i) => {
                    const meta = PRIORITY_META[row.priority]
                    return (
                      <tr key={row.feature} className={i % 2 === 1 ? "bg-slate-50/50" : ""}>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-slate-800">{row.feature}</span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">{row.description}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.competitorHas[0] ? (
                            <Check className="mx-auto h-5 w-5 text-emerald-600" aria-label="Yes" />
                          ) : (
                            <Minus className="mx-auto h-5 w-5 text-slate-300" aria-label="No" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.competitorHas[1] ? (
                            <Check className="mx-auto h-5 w-5 text-emerald-600" aria-label="Yes" />
                          ) : (
                            <Minus className="mx-auto h-5 w-5 text-slate-300" aria-label="No" />
                          )}
                        </td>
                        <td className="bg-blue-50/40 px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            On roadmap
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

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

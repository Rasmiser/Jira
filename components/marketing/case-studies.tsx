import { ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react"

const caseStudies = [
  {
    app: "E-commerce app (Android)",
    category: "Retail",
    before: { grade: "D", score: 41 },
    after: { grade: "A", score: 92 },
    findingsFixed: 14,
    highlights: [
      "Removed 3 hardcoded API keys from the binary",
      "Encrypted local storage of session tokens",
      "Enabled TLS certificate pinning",
    ],
  },
  {
    app: "Mobile banking app (iOS)",
    category: "Fintech",
    before: { grade: "C", score: 58 },
    after: { grade: "A", score: 95 },
    findingsFixed: 9,
    highlights: [
      "Patched insecure keychain access flags",
      "Closed an exported component leaking PII",
      "Added jailbreak & tamper detection",
    ],
  },
  {
    app: "Telehealth app (Cross-platform)",
    category: "Healthcare",
    before: { grade: "D", score: 47 },
    after: { grade: "A", score: 90 },
    findingsFixed: 12,
    highlights: [
      "Fixed weak crypto on patient records",
      "Scoped over-broad runtime permissions",
      "Mapped all findings to OWASP MASVS",
    ],
  },
]

export function CaseStudies() {
  return (
    <section id="results" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Sample results</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From failing grade to ship-ready
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            Representative before-and-after results from scanning test apps with RASMISER, then applying the
            recommended fixes. Your numbers will vary by codebase.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article
              key={study.app}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {study.category}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{study.app}</h3>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex flex-1 flex-col items-center rounded-xl border border-rose-200 bg-rose-50 py-4">
                  <ShieldAlert className="h-5 w-5 text-rose-500" aria-hidden="true" />
                  <span className="mt-2 text-3xl font-bold text-rose-600">{study.before.grade}</span>
                  <span className="text-xs text-rose-500">Score {study.before.score}/100</span>
                  <span className="mt-1 text-xs font-medium text-slate-500">Before</span>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                <div className="flex flex-1 flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50 py-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  <span className="mt-2 text-3xl font-bold text-emerald-600">{study.after.grade}</span>
                  <span className="text-xs text-emerald-600">Score {study.after.score}/100</span>
                  <span className="mt-1 text-xs font-medium text-slate-500">After</span>
                </div>
              </div>

              <p className="mt-6 text-sm font-semibold text-slate-900">
                {study.findingsFixed} findings resolved
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {study.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-500">
          Results shown are illustrative scans of sample applications used to demonstrate the platform, not claims
          about specific customers.
        </p>
      </div>
    </section>
  )
}

const steps = [
  {
    number: "01",
    title: "Upload your build",
    description:
      "Drag in an APK, AAB, or IPA, or connect your CI pipeline to send every build automatically. No SDK or source code required.",
  },
  {
    number: "02",
    title: "We scan it in an isolated sandbox",
    description:
      "Your binary runs through static and dynamic analysis in a private container, checked against 300+ rules mapped to OWASP MASVS.",
  },
  {
    number: "03",
    title: "Review a clear, actionable report",
    description:
      "Get findings sorted by severity, each with a plain-English explanation and a suggested fix. Export to PDF or SARIF in one click.",
  },
  {
    number: "04",
    title: "Gate releases and protect at runtime",
    description:
      "Fail builds on critical issues automatically, then add runtime shields to defend your app once it reaches real devices.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">How it works</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From build to secure release in four steps
            </h2>
            <p className="mt-4 text-pretty text-lg text-slate-600">
              No security expertise required. RASMISER handles the hard part and hands your team a checklist they can actually ship against.
            </p>

            <ol className="mt-10 space-y-8">
              {steps.map((s) => (
                <li key={s.number} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                    {s.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-slate-600">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:pl-6">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
              <img
                src="/images/report-light.png"
                alt="An AI-generated security report with a critical finding and a suggested fix"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

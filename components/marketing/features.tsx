import { ScanSearch, FileText, GitBranch, ShieldCheck, BarChart3, Lock } from "lucide-react"

const features = [
  {
    icon: ScanSearch,
    title: "Static & dynamic analysis",
    description:
      "Decompile and inspect APK, AAB, and IPA builds with the MobSF engine, then run 300+ checks across code, config, and runtime behavior.",
  },
  {
    icon: FileText,
    title: "AI-written reports",
    description:
      "Every finding comes with a plain-English explanation, real-world impact, and a concrete suggested fix your developers can act on.",
  },
  {
    icon: ShieldCheck,
    title: "OWASP MASVS coverage",
    description:
      "Each result maps to a MASVS requirement and verification level, so compliance audits become a download instead of a project.",
  },
  {
    icon: GitBranch,
    title: "CI/CD integration",
    description:
      "Trigger scans on every build from GitHub, GitLab, or Bitbucket and automatically fail releases on critical findings.",
  },
  {
    icon: Lock,
    title: "Runtime protection",
    description:
      "Add anti-tampering, root/jailbreak detection, and TLS pinning to shield apps after they ship, no code changes required.",
  },
  {
    icon: BarChart3,
    title: "Threat monitoring",
    description:
      "Watch a live feed of blocked attacks across your protected apps and track your compliance posture over time.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Features</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to secure a mobile release
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            From the first scan to runtime protection in production, RASMISER covers the full lifecycle of mobile app security.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <f.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import {
  FileSearch,
  Bug,
  PackageSearch,
  KeyRound,
  ClipboardCheck,
  GitBranch,
  Server,
  Layers,
  BarChart3,
  Headphones,
} from "lucide-react"

const services = [
  {
    icon: FileSearch,
    title: "Static Analysis (SAST)",
    description: "Decompile and inspect your binary for insecure storage, hardcoded secrets, and weak crypto.",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: Bug,
    title: "Malware Detection",
    description: "Flag malicious code, suspicious SDKs, and known-bad signatures bundled in your build.",
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
  {
    icon: PackageSearch,
    title: "APK / IPA Risk Analysis",
    description: "Assess package integrity, exposed components, debug flags, and tampering exposure.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    icon: KeyRound,
    title: "Permission & Privacy Abuse",
    description: "Detect over-broad permissions and data flows that put user privacy at risk.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Mapping",
    description: "Every finding mapped to OWASP MASVS, Mobile Top 10, CWE, and CVSS for clean audits.",
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
  {
    icon: GitBranch,
    title: "CI/CD Security Gates",
    description: "Automate scans on every release and fail the build when critical issues appear.",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
]

const highlights = [
  {
    icon: Server,
    title: "Scan in minutes",
    description: "Upload a build and get results fast",
  },
  {
    icon: Layers,
    title: "Android & iOS",
    description: "Full coverage for native and cross-platform",
  },
  {
    icon: BarChart3,
    title: "Risk-scored reports",
    description: "Severity-ranked findings with CVSS scores",
  },
  {
    icon: Headphones,
    title: "Guided remediation",
    description: "Plain-English fixes on every finding",
  },
]

export function Services() {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Platform capabilities</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A complete mobile app security platform
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            From static analysis to CI/CD enforcement, RASMISER covers the full mobile threat surface — every finding
            scored, explained, and mapped to industry standards.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <span
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${s.bg} ${s.color}`}
              >
                <s.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <h.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{h.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

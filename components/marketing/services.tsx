import {
  ShieldCheck,
  KeyRound,
  Network,
  Lock,
  Bug,
  GitBranch,
  Smartphone,
  FileText,
} from "lucide-react"

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "OWASP MASVS Coverage",
    description:
      "Every finding mapped to the full MASVS v2 requirement set — STORAGE, CRYPTO, AUTH, NETWORK, PLATFORM, CODE, and RESILIENCE categories.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Bug,
    title: "Vulnerability Categories",
    description:
      "Hardcoded secrets, insecure storage, weak crypto, improper authentication, exposed components, and 290+ more checks per scan.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: FileText,
    title: "Scan Results & Reports",
    description:
      "Severity-ranked findings with CVSS scores, plain-English descriptions, real-world impact assessments, and a one-click PDF export.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Network,
    title: "Network & TLS Analysis",
    description:
      "Detect missing certificate pinning, weak TLS configurations, cleartext traffic, and insecure WebView network access.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: Lock,
    title: "Enterprise Features",
    description:
      "SSO, team workspaces, audit logs, white-label PDF reports, API access, custom severity thresholds, and SIEM integrations.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: KeyRound,
    title: "Permission & Privacy Audit",
    description:
      "Detect over-broad permissions, PII data flows, and privacy-invasive SDK behaviors that put user data — and compliance — at risk.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: GitBranch,
    title: "CI/CD Security Gates",
    description:
      "Trigger scans from GitHub Actions, GitLab CI, or Bitbucket Pipelines and automatically fail the build on critical findings.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Smartphone,
    title: "Android & iOS Support",
    description:
      "Full coverage for APK, AAB, and IPA builds — native Android, native iOS, React Native, Flutter, and Xamarin all supported.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

const complianceStandards = [
  { name: "OWASP MASVS", description: "Mobile App Security Verification Standard" },
  { name: "OWASP Top 10", description: "Most critical mobile risks" },
  { name: "CWE", description: "Common Weakness Enumeration" },
  { name: "CVSS v3.1", description: "Vulnerability Scoring System" },
  { name: "GDPR", description: "Privacy & data protection" },
  { name: "HIPAA", description: "Healthcare compliance" },
]

export function Services() {
  return (
    <section id="security-features" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Security Features</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Complete mobile security coverage
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            From static analysis to runtime protection, RASMISER covers every OWASP MASVS category — so your team
            ships compliant, hardened apps with confidence.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.bg} ${f.color}`}
              >
                <f.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Compliance standards */}
        <div className="mt-16">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
            Aligned to industry standards
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complianceStandards.map((std) => (
              <div
                key={std.name}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{std.name}</p>
                  <p className="text-xs text-slate-500">{std.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

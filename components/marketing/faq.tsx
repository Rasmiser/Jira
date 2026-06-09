import { Plus } from "lucide-react"

const faqs = [
  {
    q: "What file types can I scan?",
    a: "RASMISER supports Android APK and AAB files as well as iOS IPA builds. You can also point it at source code for static analysis. No SDK integration is required to get started.",
  },
  {
    q: "How long does a scan take?",
    a: "Most scans complete in under five minutes from upload to a full report. Larger apps with dynamic analysis enabled may take a little longer, but you can keep working while it runs.",
  },
  {
    q: "Do you store my app binaries?",
    a: "Your builds are analyzed in an isolated, encrypted sandbox and are automatically purged once your report is ready. We never share or retain your binaries.",
  },
  {
    q: "Which standards do you check against?",
    a: "Every finding maps to an OWASP MASVS requirement and verification level (L1/L2), and reports help you demonstrate readiness for frameworks like PCI DSS, GDPR, and HIPAA.",
  },
  {
    q: "Can I integrate it with my CI/CD pipeline?",
    a: "Yes. The Team plan includes a REST API and CLI that drop into GitHub Actions, GitLab, and Bitbucket pipelines, with automatic build gating on critical findings.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan includes three scans per month with static analysis and OWASP MASVS findings, with no credit card required.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">FAQ</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-base font-semibold text-slate-900">{item.q}</span>
                <Plus
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

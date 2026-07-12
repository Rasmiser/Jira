import Link from "next/link"
import { ArrowRight, Upload, CheckCircle2 } from "lucide-react"

const benefits = [
  "No credit card required",
  "Results in under 5 minutes",
  "300+ security checks",
  "OWASP MASVS mapped",
]

export function CtaSection({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="bg-slate-50 pb-24 pt-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-blue-600 px-8 py-16 sm:px-14">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-start lg:text-left">
            <div className="flex-1">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Scan your first build in the next five minutes.
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-lg text-blue-100">
                Upload an APK or IPA and get a full vulnerability report — free, no signup required. Catch the issues
                attackers are already looking for.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 text-base font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition-colors hover:bg-blue-50"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Scan your APK free
                </Link>
                <a
                  href="#live-demo"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-400 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  View demo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Benefit checklist */}
            <div className="shrink-0 rounded-2xl border border-blue-500/50 bg-blue-700/40 p-6 backdrop-blur-sm">
              <ul className="flex flex-col gap-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-blue-100">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-300" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

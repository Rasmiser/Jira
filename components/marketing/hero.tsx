import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function Hero({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20">
      {/* soft background accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-blue-50 to-white" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden="true" />
            OWASP MASVS aligned mobile security
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Ship mobile apps without security surprises
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
            Upload your Android or iOS build and get a full vulnerability report in minutes. RASMISER
            scans every release, explains each finding in plain English, and tells your team exactly how to fix it.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Start scanning free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
              Results in under 5 minutes
            </span>
          </div>
        </div>

        {/* product screenshot */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            <img
              src="/images/scan-dashboard-light.png"
              alt="RASMISER scan results dashboard showing a security grade and vulnerability findings"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

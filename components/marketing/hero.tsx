import Link from "next/link"
import { CheckCircle2, ArrowRight, Upload, Shield } from "lucide-react"

export function Hero({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-0">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] bg-gradient-to-b from-blue-50/60 to-white" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" aria-hidden="true" />
            OWASP MASVS aligned — Android &amp; iOS
          </span>
        </div>

        {/* Single headline */}
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-center text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
          Find mobile app vulnerabilities before attackers do.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-xl leading-relaxed text-slate-600">
          Automated Android &amp; iOS security scanning powered by OWASP MASVS. Upload a build, get a full
          vulnerability report in minutes — free, forever.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Scan your APK free
          </Link>
          <a
            href="#live-demo"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            View live demo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
            Results in under 5 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-blue-600" aria-hidden="true" />
            300+ security checks per scan
          </span>
        </div>

        {/* Product screenshot — flush to bottom of section */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-t-2xl border border-b-0 border-slate-200 bg-slate-900 shadow-2xl shadow-slate-900/20">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-500/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 flex-1 rounded-md bg-white/10 px-3 py-1 text-xs text-white/40">
                app.rasmiser.com/dashboard/scans/...
              </span>
            </div>
            <img
              src="/images/scan-dashboard-light.png"
              alt="RASMISER scan results dashboard showing a security grade, vulnerability findings, and OWASP MASVS compliance"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

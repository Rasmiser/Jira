import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaSection({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-blue-600 px-6 py-16 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Scan your first build in the next five minutes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-blue-100">
            Join the teams catching vulnerabilities before attackers do. Every feature is free — no credit card, no
            plans, no limits.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              Start scanning free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-400 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Explore features
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

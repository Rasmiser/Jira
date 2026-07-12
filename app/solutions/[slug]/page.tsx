import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Check, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import { solutionPages, getSolutionPage } from "@/lib/solutions"

export function generateStaticParams() {
  return solutionPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getSolutionPage(slug)
  if (!page) return {}
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: [page.keyword],
    alternates: { canonical: `/solutions/${page.slug}` },
    openGraph: {
      type: "website",
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/solutions/${page.slug}`,
      siteName: "RASMISER",
    },
    twitter: {
      card: "summary_large_image",
      site: "@rasmiser",
      title: page.metaTitle,
      description: page.metaDescription,
    },
  }
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getSolutionPage(slug)
  if (!page) notFound()

  const Icon = page.icon

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="px-4 pb-16 pt-32 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            <Icon className="h-4 w-4" aria-hidden="true" /> {page.eyebrow}
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {page.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
            {page.subheading}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Scan your app free <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#live-demo"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              See a live demo
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-pretty text-lg leading-relaxed text-slate-700">{page.intro}</p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-slate-900">
            What RASMISER checks
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {page.capabilities.map((cap) => (
              <div key={cap.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{cap.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 flex flex-col gap-6">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6">
                <dt className="font-semibold text-slate-900">{faq.question}</dt>
                <dd className="mt-2 leading-relaxed text-slate-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-slate-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-balance text-3xl font-bold tracking-tight">Ready to find your vulnerabilities?</h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-300">
            Run your first scan free and get a clear, prioritized report in minutes.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get started free <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> No credit card required
          </p>
        </div>
      </section>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  )
}

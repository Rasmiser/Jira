import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare, Clock, ShieldCheck } from "lucide-react"
import { SiteFooter } from "@/components/marketing/site-footer"
import { ContactForm } from "@/components/marketing/contact-form"

export const metadata: Metadata = {
  title: "Contact & Book a Demo | RASMISER",
  description:
    "Talk to the RASMISER team. Book a live demo of mobile app security scanning and runtime protection, or send us a question — we reply within one business day.",
}

const highlights = [
  {
    icon: MessageSquare,
    title: "See it on your app",
    description: "We'll walk through a real scan of an Android or iOS build and the findings it surfaces.",
  },
  {
    icon: Clock,
    title: "Fast response",
    description: "A security engineer gets back to you within one business day — no call center.",
  },
  {
    icon: ShieldCheck,
    title: "MASVS-aligned",
    description: "Every report maps findings to OWASP MASVS so your team knows exactly what to fix.",
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            View pricing
          </Link>
        </div>
      </header>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Contact us</p>
              <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Book a demo or talk to our team
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
                Whether you&apos;re shipping your first app or securing a portfolio of releases, we&apos;ll show you how
                RASMISER finds vulnerabilities and protects your builds at runtime.
              </p>

              <ul className="mt-10 space-y-6">
                {highlights.map((h) => (
                  <li key={h.title} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <h.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{h.title}</h3>
                      <p className="mt-1 leading-relaxed text-slate-600">{h.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Prefer email?</p>
                  <a href="mailto:hello@rasmiser.com" className="text-blue-600 hover:text-blue-700">
                    hello@rasmiser.com
                  </a>
                </div>
              </div>
            </div>

            <ContactForm defaultInquiry="demo" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

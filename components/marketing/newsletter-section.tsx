"use client"

import { useState, useTransition } from "react"
import { track } from "@vercel/analytics"
import { Shield } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"

export function NewsletterSection() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      const res = await subscribeToNewsletter(formData)
      setResult(res)
      if (res.ok) {
        track("newsletter_subscribed")
        form.reset()
      }
    })
  }

  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-white">RASMISER</span>
          </div>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-slate-300">
            AI-powered runtime application security for mobile. Protecting Android, iOS, and cross-platform apps with
            zero code changes.
          </p>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stay in the loop</p>
          <p className="mt-3 text-pretty leading-relaxed text-slate-300">
            Get insights on security risks, AI threats, and product updates.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              disabled={isPending}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-blue-500 disabled:opacity-60 sm:max-w-xs"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200 disabled:opacity-60"
            >
              {isPending ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {result && (
            <p
              role="status"
              className={`mt-3 text-sm ${result.ok ? "text-emerald-400" : "text-red-400"}`}
            >
              {result.message}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useTransition } from "react"
import { submitLead, type LeadResult } from "@/app/actions/lead"

const inquiryOptions = [
  { value: "demo", label: "Book a demo" },
  { value: "sales", label: "Talk to sales" },
  { value: "support", label: "Get support" },
  { value: "general", label: "General question" },
]

const platformOptions = [
  { value: "", label: "Select platform" },
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "cross", label: "Cross-platform" },
  { value: "web", label: "Web" },
  { value: "other", label: "Other" },
]

const teamSizeOptions = [
  { value: "", label: "Select team size" },
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "200+", label: "200+" },
]

export function ContactForm({ defaultInquiry = "demo" }: { defaultInquiry?: string }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<LeadResult | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      const res = await submitLead(formData)
      setResult(res)
      if (res.ok) form.reset()
    })
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-emerald-900">Request received</h3>
        <p className="mt-2 text-pretty leading-relaxed text-emerald-800">{result.message}</p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-6 rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <input type="hidden" name="source" value="contact" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="inquiryType" className="block text-sm font-medium text-slate-900">
            How can we help?
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            defaultValue={defaultInquiry}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
          >
            {inquiryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-900">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            disabled={isPending}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-900">
            Work email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            disabled={isPending}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-900">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Acme Inc."
            disabled={isPending}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="appPlatform" className="block text-sm font-medium text-slate-900">
            App platform
          </label>
          <select
            id="appPlatform"
            name="appPlatform"
            disabled={isPending}
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
          >
            {platformOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="teamSize" className="block text-sm font-medium text-slate-900">
            Team size
          </label>
          <select
            id="teamSize"
            name="teamSize"
            disabled={isPending}
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 disabled:opacity-60 sm:max-w-xs"
          >
            {teamSizeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-slate-900">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Tell us about your app and what you're looking to secure."
            disabled={isPending}
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Sending..." : "Send request"}
      </button>

      {result && !result.ok && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {result.message}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        By submitting, you agree to be contacted about RASMISER. We never share your information.
      </p>
    </form>
  )
}

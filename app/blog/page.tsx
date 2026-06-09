import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteFooter } from "@/components/marketing/site-footer"
import { blogPosts, formatDate } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog | RASMISER",
  description:
    "Security insights for teams shipping new mobile apps: closing vulnerabilities, securing AI features, and shift-left DevSecOps.",
}

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link href="/sign-up" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Start free
          </Link>
        </div>
      </header>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">RASMISER Blog</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Insights on mobile app security
          </h1>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            How we help teams find vulnerabilities, secure emerging technology like AI, and keep clients confident in every release.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-600">
                      {post.category}
                    </span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold leading-snug text-slate-900 group-hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-slate-500">
                    {post.author} · {formatDate(post.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

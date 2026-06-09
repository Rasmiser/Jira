import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { blogPosts, formatDate } from "@/lib/blog"

export function BlogSection() {
  const posts = blogPosts.slice(0, 3)

  return (
    <section id="blog" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">From the blog</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Security insights for teams shipping new apps
            </h2>
            <p className="mt-4 text-pretty text-lg text-slate-600">
              Practical guidance on closing vulnerabilities, securing AI features, and making security a routine part of every release.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            View all posts
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
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
                <h3 className="mt-4 text-lg font-semibold leading-snug text-slate-900 group-hover:text-blue-600">
                  {post.title}
                </h3>
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
  )
}

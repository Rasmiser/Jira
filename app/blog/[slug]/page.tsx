import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SiteFooter } from "@/components/marketing/site-footer"
import { blogPosts, getPostBySlug, formatDate } from "@/lib/blog"
import { getSiteUrl } from "@/lib/site"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post not found | RASMISER" }
  const siteUrl = getSiteUrl()
  const canonicalUrl = `/blog/${slug}`
  return {
    title: `${post.title} | RASMISER Blog`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      siteName: "RASMISER",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image
        ? [{ url: `${siteUrl}${post.image}`, width: 1200, height: 630, alt: post.imageAlt }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@rasmiser",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [`${siteUrl}${post.image}`] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)
  const siteUrl = getSiteUrl()

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `${siteUrl}${post.image}` : undefined,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.role,
    },
    publisher: {
      "@type": "Organization",
      name: "RASMISER",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All posts
          </Link>
          <Link href="/sign-up" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Start free
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-600">{post.category}</span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 border-b border-slate-200 pb-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </span>
          <div className="text-sm">
            <p className="font-semibold text-slate-900">{post.author}</p>
            <p className="text-slate-500">
              {post.role} · {formatDate(post.date)}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl bg-slate-100">
          <img src={post.image || "/placeholder.svg"} alt={post.imageAlt} className="w-full object-cover" />
        </div>

        <p className="mt-10 text-pretty text-xl leading-relaxed text-slate-700">{post.intro}</p>

        <div className="mt-10 space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-slate-700">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">The takeaway</h2>
          <p className="mt-2 leading-relaxed text-slate-700">{post.takeaway}</p>
          <Link
            href="/sign-up"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Scan your app free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Keep reading</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-blue-600">{p.category}</span>
                  <h3 className="mt-1 font-semibold leading-snug text-slate-900 group-hover:text-blue-600">
                    {p.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </main>
  )
}

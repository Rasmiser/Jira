import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"
import { blogPosts } from "@/lib/blog"
import { solutionPages } from "@/lib/solutions"

/**
 * Generates the XML sitemap for Google and other search engines. Includes all
 * public, indexable routes: marketing pages, solution landing pages, the blog
 * index, and every blog post. Private dashboard and auth routes are excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const marketingPaths = ["/pricing", "/compare", "/contact", "/about", "/security", "/privacy", "/terms", "/roi-calculator"]

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...marketingPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]

  const solutionRoutes: MetadataRoute.Sitemap = solutionPages.map((p) => ({
    url: `${siteUrl}/solutions/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...solutionRoutes, ...blogRoutes]
}

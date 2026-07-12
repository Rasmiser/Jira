import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"

/**
 * Tells search engines what they may crawl. Public marketing/content pages are
 * allowed; private app areas and auth pages are disallowed so they don't appear
 * in search results. Points crawlers to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

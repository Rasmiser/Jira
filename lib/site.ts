/**
 * Canonical, absolute site URL used for SEO metadata, sitemap, and robots.
 *
 * Order of preference:
 *  1. NEXT_PUBLIC_SITE_URL  — set this to your custom domain in production
 *     (e.g. https://rasmiser.dev) for the cleanest canonical URLs.
 *  2. The Vercel production domain.
 *  3. The current Vercel deployment URL.
 *  4. localhost for local development.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

"use client"

import { SiteHeader } from "@/components/marketing/site-header"
import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { Services } from "@/components/marketing/services"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { LiveDemo } from "@/components/marketing/live-demo"
import { CaseStudies } from "@/components/marketing/case-studies"
import { Testimonials } from "@/components/marketing/testimonials"
import { BlogSection } from "@/components/marketing/blog-section"
import { Pricing } from "@/components/marketing/pricing"
import { FAQ } from "@/components/marketing/faq"
import { CtaSection } from "@/components/marketing/cta-section"
import { NewsletterSection } from "@/components/marketing/newsletter-section"
import { SiteFooter } from "@/components/marketing/site-footer"
import { useSession } from "@/lib/auth-client"

export default function Home() {
  const { data: session } = useSession()
  const ctaHref = session?.user ? "/dashboard" : "/sign-up"

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <Hero ctaHref={ctaHref} />
      <Features />
      <Services />
      <HowItWorks />
      <LiveDemo />
      <CaseStudies />
      <Testimonials />
      <BlogSection />
      <Pricing />
      <FAQ />
      <CtaSection ctaHref={ctaHref} />
      <NewsletterSection />
      <SiteFooter />
    </main>
  )
}

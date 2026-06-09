"use client"

import { SiteHeader } from "@/components/marketing/site-header"
import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { Services } from "@/components/marketing/services"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Pricing } from "@/components/marketing/pricing"
import { Testimonials } from "@/components/marketing/testimonials"
import { BlogSection } from "@/components/marketing/blog-section"
import { FAQ } from "@/components/marketing/faq"
import { CtaSection } from "@/components/marketing/cta-section"
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
      <Pricing ctaHref={ctaHref} />
      <Testimonials />
      <BlogSection />
      <FAQ />
      <CtaSection ctaHref={ctaHref} />
      <SiteFooter />
    </main>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ContentPage, ContentSection } from "@/components/marketing/content-page"

export const metadata: Metadata = {
  title: "About | RASMISER",
  description:
    "RASMISER builds AI-powered mobile app security — vulnerability scanning and runtime protection aligned to OWASP MASVS — so every team can ship secure apps.",
}

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title="Mobile app security for every team"
      intro="We believe shipping a secure mobile app shouldn't require a dedicated security team or an enterprise budget."
    >
      <ContentSection heading="Why we exist">
        <p>
          Mobile apps move faster than ever, and so do the threats against them. Most teams discover security problems
          only after a release — through an app-store rejection, a failed audit, or a breach. RASMISER was built to flip
          that around: catch vulnerabilities before launch and keep apps protected at runtime, without slowing teams
          down.
        </p>
      </ContentSection>

      <ContentSection heading="What we do">
        <p>
          RASMISER scans Android and iOS builds against the OWASP Mobile Application Security Verification Standard
          (MASVS), explains every finding in plain English, and tells your team exactly how to fix it. Beyond scanning,
          our runtime protection adds anti-tampering, TLS pinning, and threat detection with zero code changes.
        </p>
        <p>
          As AI features become core to modern apps, we also help teams secure the new attack surface they introduce —
          from prompt injection to exposed model keys.
        </p>
      </ContentSection>

      <ContentSection heading="Our approach">
        <p>
          Security tooling is often noisy and hard to act on. We focus on clarity: every report is prioritized, mapped
          to a recognized standard, and paired with concrete remediation. The goal is fewer dashboards to babysit and
          more vulnerabilities actually fixed.
        </p>
      </ContentSection>

      <ContentSection heading="Get in touch">
        <p>
          Want to see RASMISER on your own app?{" "}
          <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-700">
            Book a demo
          </Link>{" "}
          or explore our{" "}
          <Link href="/pricing" className="font-medium text-blue-600 hover:text-blue-700">
            pricing
          </Link>
          .
        </p>
      </ContentSection>
    </ContentPage>
  )
}

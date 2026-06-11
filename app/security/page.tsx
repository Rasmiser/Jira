import type { Metadata } from "next"
import Link from "next/link"
import { ContentPage, ContentSection } from "@/components/marketing/content-page"

export const metadata: Metadata = {
  title: "Security | RASMISER",
  description:
    "How RASMISER protects your data: encryption in transit and at rest, least-privilege access, and OWASP MASVS-aligned practices.",
}

export default function SecurityPage() {
  return (
    <ContentPage
      eyebrow="Security"
      title="How we protect your data"
      intro="Security is our product and our practice. Here's how we handle the apps and data you trust us with."
    >
      <ContentSection heading="Data handling">
        <p>
          Uploaded builds are used solely to perform the security analysis you request. Artifacts are processed in
          isolated environments and are not shared with third parties or used to train external models.
        </p>
      </ContentSection>

      <ContentSection heading="Encryption">
        <p>
          All data is encrypted in transit using TLS, and sensitive data is encrypted at rest. Connections to our
          services use modern cipher suites and certificate validation.
        </p>
      </ContentSection>

      <ContentSection heading="Access control">
        <p>
          We follow least-privilege principles. Access to customer data is restricted to authorized personnel and
          scoped to what is required to operate and support the service. Account data is isolated per user.
        </p>
      </ContentSection>

      <ContentSection heading="Standards">
        <p>
          Our scanning engine is aligned to the OWASP Mobile Application Security Verification Standard (MASVS), and we
          apply the same secure-development practices we recommend to our customers.
        </p>
      </ContentSection>

      <ContentSection heading="Reporting a vulnerability">
        <p>
          If you believe you&apos;ve found a security issue in RASMISER, please email{" "}
          <a href="mailto:security@rasmiser.com" className="font-medium text-blue-600 hover:text-blue-700">
            security@rasmiser.com
          </a>
          . We investigate all reports and aim to respond quickly. You can also{" "}
          <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-700">
            contact our team
          </Link>{" "}
          for any other questions.
        </p>
      </ContentSection>
    </ContentPage>
  )
}

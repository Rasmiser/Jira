import type { Metadata } from "next"
import { ContentPage, ContentSection } from "@/components/marketing/content-page"

export const metadata: Metadata = {
  title: "Privacy Policy | RASMISER",
  description: "How RASMISER collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy explains what information we collect, how we use it, and the choices you have. It is provided for general informational purposes and is not legal advice."
    >
      <ContentSection heading="Information we collect">
        <p>
          We collect information you provide directly — such as your name, email, and company when you create an
          account or contact us — and technical data generated when you use the service, including the application
          builds you submit for analysis and the resulting scan reports.
        </p>
      </ContentSection>

      <ContentSection heading="How we use information">
        <p>
          We use your information to provide and improve the service, perform the security analyses you request,
          communicate with you, and keep the platform secure. We do not sell your personal information.
        </p>
      </ContentSection>

      <ContentSection heading="Data retention">
        <p>
          We retain account information for as long as your account is active. Uploaded builds and scan artifacts are
          retained only as long as needed to provide the service and may be deleted on request.
        </p>
      </ContentSection>

      <ContentSection heading="Third-party services">
        <p>
          We rely on trusted infrastructure providers to operate the service. These providers process data on our
          behalf under appropriate safeguards and are not permitted to use it for their own purposes.
        </p>
      </ContentSection>

      <ContentSection heading="Your choices">
        <p>
          You may access, update, or delete your account information at any time, and you can request deletion of your
          data by contacting us at{" "}
          <a href="mailto:privacy@rasmiser.com" className="font-medium text-blue-600 hover:text-blue-700">
            privacy@rasmiser.com
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection heading="Changes to this policy">
        <p>
          We may update this policy from time to time. Material changes will be reflected on this page with an updated
          revision date.
        </p>
        <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
      </ContentSection>
    </ContentPage>
  )
}

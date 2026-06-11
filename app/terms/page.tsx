import type { Metadata } from "next"
import { ContentPage, ContentSection } from "@/components/marketing/content-page"

export const metadata: Metadata = {
  title: "Terms of Service | RASMISER",
  description: "The terms that govern your use of RASMISER's mobile app security platform.",
}

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="These terms govern your use of RASMISER. They are provided for general informational purposes and are not legal advice. By using the service, you agree to these terms."
    >
      <ContentSection heading="Using the service">
        <p>
          You may use RASMISER only in compliance with these terms and all applicable laws. You are responsible for
          maintaining the security of your account and for all activity that occurs under it.
        </p>
      </ContentSection>

      <ContentSection heading="Acceptable use">
        <p>
          You agree to submit only applications you own or are authorized to analyze. You may not use the service to
          attack, reverse-engineer, or compromise systems you do not have permission to test.
        </p>
      </ContentSection>

      <ContentSection heading="Intellectual property">
        <p>
          You retain all rights to the applications and content you submit. We retain all rights to the RASMISER
          platform, including our scanning engine, reports format, and software.
        </p>
      </ContentSection>

      <ContentSection heading="Disclaimers">
        <p>
          The service is provided &quot;as is.&quot; While we work hard to surface security issues accurately, no
          automated tool can guarantee detection of every vulnerability. Security analysis supplements, but does not
          replace, sound development and review practices.
        </p>
      </ContentSection>

      <ContentSection heading="Limitation of liability">
        <p>
          To the maximum extent permitted by law, RASMISER is not liable for indirect, incidental, or consequential
          damages arising from your use of the service.
        </p>
      </ContentSection>

      <ContentSection heading="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href="mailto:legal@rasmiser.com" className="font-medium text-blue-600 hover:text-blue-700">
            legal@rasmiser.com
          </a>
          .
        </p>
        <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
      </ContentSection>
    </ContentPage>
  )
}

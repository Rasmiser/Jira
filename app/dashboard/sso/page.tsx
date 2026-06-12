import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { KeyRound, Users, ShieldCheck } from "lucide-react"

const PROVIDERS = ["Okta", "Microsoft Entra ID", "Google Workspace", "OneLogin", "Generic SAML 2.0"]

export default async function SsoPage() {
  const { allowed } = await getFeatureAccess("enterprise")
  if (!allowed) {
    return (
      <FeatureLocked
        featureName="SSO / SAML & SCIM provisioning"
        requiredPlan="enterprise"
      />
    )
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="SSO & provisioning"
        description="Let your team sign in with your identity provider and keep membership in sync with SCIM."
        icon={KeyRound}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-foreground" aria-hidden="true" />
            <h2 className="font-medium text-foreground">SAML single sign-on</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Configure your IdP with the ACS URL and entity ID below, then upload the
            IdP metadata to finish setup.
          </p>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                ACS URL
              </dt>
              <dd className="mt-1 break-all font-mono text-foreground">
                https://api.rasmiser.com/sso/saml/acs
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Entity ID
              </dt>
              <dd className="mt-1 break-all font-mono text-foreground">
                urn:rasmiser:sp
              </dd>
            </div>
          </dl>
        </div>

        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-foreground" aria-hidden="true" />
            <h2 className="font-medium text-foreground">SCIM provisioning</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Automatically create, update, and deactivate members from your IdP using
            the SCIM 2.0 endpoint.
          </p>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                SCIM base URL
              </dt>
              <dd className="mt-1 break-all font-mono text-foreground">
                https://api.rasmiser.com/scim/v2
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Bearer token
              </dt>
              <dd className="mt-1 break-all font-mono text-foreground">
                scim_••••••••••••••••
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Supported providers
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {PROVIDERS.map((p) => (
            <span
              key={p}
              className="border border-border bg-card px-3 py-1.5 text-sm text-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

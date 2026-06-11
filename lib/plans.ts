export type PlanId = "free" | "team" | "enterprise"

export interface Plan {
  id: PlanId
  name: string
  description: string
  priceInCents: number
  // monthly scan allowance; null = unlimited
  scanLimit: number | null
  features: string[]
}

// Source of truth for all plans. Stripe checkout creates prices inline from
// priceInCents, so no Stripe dashboard setup is required. Keep these in sync
// with the marketing pricing page (app/pricing/page.tsx).
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Everything an individual or small team needs to ship secure mobile apps.",
    priceInCents: 0,
    scanLimit: null,
    features: [
      "Unlimited Android & iOS scans",
      "Full OWASP MASVS vulnerability reports",
      "Plain-English findings & fix guidance",
      "Runtime protection (anti-tamper, TLS pinning)",
      "Community support",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    description: "Collaboration and workflow integrations for teams shipping on a release cadence.",
    priceInCents: 3000, // $30 / month
    scanLimit: null,
    features: [
      "Everything in Free",
      "Shared workspace & role-based access",
      "Jira issue sync for findings",
      "Scan history & trend tracking",
      "CI/CD scan automation",
      "Priority email support",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "Advanced governance, compliance, and support for security-critical organizations.",
    priceInCents: 6000, // $60 / month
    scanLimit: null,
    features: [
      "Everything in Team",
      "SSO / SAML & SCIM provisioning",
      "Custom MASVS policy & compliance reports",
      "Dedicated security engineer",
      "SLA-backed support",
      "On-prem / private deployment options",
    ],
  },
}

export const PLAN_LIST = Object.values(PLANS)

export function getPlan(id: string | null | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId]
  return PLANS.free
}

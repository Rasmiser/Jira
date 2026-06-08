export type PlanId = "free" | "pro" | "team"

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
// priceInCents, so no Stripe dashboard setup is required for the MVP.
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "For trying out RASMISER on a single app.",
    priceInCents: 0,
    scanLimit: 3,
    features: [
      "3 scans per month",
      "Static analysis (MobSF engine)",
      "OWASP MASVS findings",
      "Community support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For indie developers and small teams shipping regularly.",
    priceInCents: 4900,
    scanLimit: 50,
    features: [
      "50 scans per month",
      "Static & dynamic analysis",
      "AI-generated remediation reports",
      "PDF & SARIF export",
      "Priority email support",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    description: "For security teams with continuous release pipelines.",
    priceInCents: 19900,
    scanLimit: null,
    features: [
      "Unlimited scans",
      "Everything in Pro",
      "CI/CD pipeline integration",
      "Compliance dashboard",
      "Dedicated support",
    ],
  },
}

export const PLAN_LIST = Object.values(PLANS)

export function getPlan(id: string | null | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId]
  return PLANS.free
}

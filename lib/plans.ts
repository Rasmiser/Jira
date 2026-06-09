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
    description: "Everything unlocked — test as much as you want, for free.",
    priceInCents: 0,
    scanLimit: null,
    features: [
      "Unlimited scans",
      "Static analysis (MobSF engine)",
      "OWASP MASVS findings",
      "Community support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "All Pro capabilities, now free during open access.",
    priceInCents: 0,
    scanLimit: null,
    features: [
      "Unlimited scans",
      "Static & dynamic analysis",
      "AI-generated remediation reports",
      "PDF & SARIF export",
      "Priority email support",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    description: "All Team capabilities, now free during open access.",
    priceInCents: 0,
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

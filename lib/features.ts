import type { PlanId } from "@/lib/plans"
import {
  ScanLine,
  FileSearch,
  Sparkles,
  ShieldHalf,
  BrainCircuit,
  LifeBuoy,
  Users,
  GitMerge,
  History,
  Workflow,
  KeyRound,
  ClipboardCheck,
  UserCog,
  BadgeCheck,
  Server,
  Languages,
  type LucideIcon,
} from "lucide-react"

export interface DashboardFeature {
  /** Stable id used for anchors/keys. */
  id: string
  /** Feature label as shown on the pricing page. */
  name: string
  /** Short explanation of what the feature does in the dashboard. */
  description: string
  /** Minimum plan required to access this feature. */
  plan: PlanId
  /** Destination route inside the dashboard. */
  href: string
  icon: LucideIcon
  /** Whether the destination is a pre-existing page or one we added for this. */
  status: "existing" | "new"
}

// Mirrors the marketing pricing page (app/pricing/page.tsx). Every feature
// listed there maps to a real, plan-gated destination in the dashboard.
export const FEATURES: DashboardFeature[] = [
  // --- Free -------------------------------------------------------------
  {
    id: "scans",
    name: "Unlimited Android & iOS scans",
    description:
      "Upload any APK or IPA and get a full security report in minutes — no monthly cap.",
    plan: "free",
    href: "/dashboard/scan/new",
    icon: ScanLine,
    status: "existing",
  },
  {
    id: "masvs-reports",
    name: "Full OWASP MASVS vulnerability reports",
    description:
      "Every scan is graded against the OWASP MASVS standard with categorized findings.",
    plan: "free",
    href: "/dashboard",
    icon: FileSearch,
    status: "existing",
  },
  {
    id: "fix-guidance",
    name: "Plain-English findings & fix guidance",
    description:
      "AI-generated, developer-ready remediation steps and code for each finding.",
    plan: "free",
    href: "/dashboard",
    icon: Sparkles,
    status: "existing",
  },
  {
    id: "runtime-protection",
    name: "Runtime protection",
    description:
      "Apply no-code anti-tamper, TLS pinning, and shielding to block live attacks.",
    plan: "free",
    href: "/dashboard/protection",
    icon: ShieldHalf,
    status: "existing",
  },
  {
    id: "ai-checks",
    name: "AI feature security checks",
    description:
      "Audit AI/LLM features for prompt injection, data leakage, and model abuse risks.",
    plan: "free",
    href: "/dashboard/ai-checks",
    icon: BrainCircuit,
    status: "new",
  },
  {
    id: "localization",
    name: "Translate & Adapt localized content",
    description:
      "Localize app store listings and in-app strings into any market with AI that adapts tone and idioms, not just literal translations.",
    plan: "free",
    href: "/dashboard/localization",
    icon: Languages,
    status: "new",
  },
  {
    id: "community-support",
    name: "Community support",
    description: "Get help from the RASMISER community knowledge base and forums.",
    plan: "free",
    href: "/dashboard/support",
    icon: LifeBuoy,
    status: "new",
  },

  // --- Team -------------------------------------------------------------
  {
    id: "workspace",
    name: "Shared workspace & role-based access",
    description:
      "Invite teammates, assign Owner / Admin / Member roles, and manage shared scans.",
    plan: "team",
    href: "/dashboard/workspace",
    icon: Users,
    status: "new",
  },
  {
    id: "jira-sync",
    name: "Jira issue sync for findings",
    description:
      "Push findings to Jira as tracked issues and keep their status in sync.",
    plan: "team",
    href: "/dashboard/integrations",
    icon: GitMerge,
    status: "new",
  },
  {
    id: "scan-history",
    name: "Scan history & trend tracking",
    description:
      "Compare any two scans to see fixed, introduced, and unchanged issues over time.",
    plan: "team",
    href: "/dashboard/compare",
    icon: History,
    status: "existing",
  },
  {
    id: "cicd-automation",
    name: "CI/CD scan automation",
    description:
      "Generate API tokens and pipeline snippets to scan every build automatically.",
    plan: "team",
    href: "/dashboard/automation",
    icon: Workflow,
    status: "new",
  },
  {
    id: "priority-support",
    name: "Priority email support",
    description: "Skip the queue with priority email support from our team.",
    plan: "team",
    href: "/dashboard/support",
    icon: LifeBuoy,
    status: "new",
  },

  // --- Enterprise -------------------------------------------------------
  {
    id: "sso",
    name: "SSO / SAML & SCIM provisioning",
    description:
      "Connect your identity provider for single sign-on and automated user provisioning.",
    plan: "enterprise",
    href: "/dashboard/sso",
    icon: KeyRound,
    status: "new",
  },
  {
    id: "compliance",
    name: "Custom MASVS policy & compliance reports",
    description:
      "Define org-wide MASVS policies and export audit-ready compliance reports.",
    plan: "enterprise",
    href: "/dashboard/compliance",
    icon: ClipboardCheck,
    status: "new",
  },
  {
    id: "security-engineer",
    name: "Dedicated security engineer",
    description:
      "Work directly with an assigned security engineer for reviews and guidance.",
    plan: "enterprise",
    href: "/dashboard/support",
    icon: UserCog,
    status: "new",
  },
  {
    id: "sla-support",
    name: "SLA-backed support",
    description: "Guaranteed response times backed by a contractual SLA.",
    plan: "enterprise",
    href: "/dashboard/support",
    icon: BadgeCheck,
    status: "new",
  },
  {
    id: "deployment",
    name: "On-prem / private deployment",
    description:
      "Run RASMISER inside your own VPC or on-premises with a private deployment.",
    plan: "enterprise",
    href: "/dashboard/deployment",
    icon: Server,
    status: "new",
  },
]

export function getFeature(id: string): DashboardFeature | undefined {
  return FEATURES.find((f) => f.id === id)
}

export function featuresByPlan(plan: PlanId): DashboardFeature[] {
  return FEATURES.filter((f) => f.plan === plan)
}

/**
 * Competitive gap roadmap items derived from the 2026 MAST competitive analysis.
 *
 * Each item maps to a gap identified vs. Appknox / NowSecure.
 * Priority tiers:
 *   critical  — supply chain / compliance gate / false-positive reduction
 *   important — enterprise triage workflow / DevSecOps expectation
 *   planned   — retention / upsell / niche growth
 */

export type RoadmapPriority = "critical" | "important" | "planned"
export type RoadmapStatus = "planned" | "in-progress" | "shipped"

export interface RoadmapItem {
  id: string
  name: string
  description: string
  priority: RoadmapPriority
  status: RoadmapStatus
  /** Which competitors already have this capability. */
  competitorHas: Array<"Appknox" | "NowSecure">
  /** Jira issue key once the ticket is created (populated server-side). */
  jiraKey?: string
  /** Jira issue URL. */
  jiraUrl?: string
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "sbom",
    name: "SBOM generation (CycloneDX)",
    description:
      "Binary software bill of materials for every release — full visibility into third-party components, shadow APIs, and CVEs. Required for supply chain security contracts.",
    priority: "critical",
    status: "planned",
    competitorHas: ["Appknox", "NowSecure"],
  },
  {
    id: "privacy-flow",
    name: "Privacy data flow analysis",
    description:
      "Maps exactly what user data is collected, where it goes, and whether it is encrypted — flagging GDPR, HIPAA, and CCPA compliance gaps automatically.",
    priority: "critical",
    status: "planned",
    competitorHas: ["NowSecure"],
  },
  {
    id: "iast",
    name: "IAST — Interactive Application Security Testing",
    description:
      "Correlates SAST static findings with live runtime observations to dramatically reduce false positives and surface context-rich findings.",
    priority: "critical",
    status: "planned",
    competitorHas: ["NowSecure"],
  },
  {
    id: "shadow-api",
    name: "Shadow API discovery",
    description:
      "Automatically discovers every API inside the binary — including undocumented endpoints — and tests each with customizable auth methods and payloads.",
    priority: "critical",
    status: "planned",
    competitorHas: ["Appknox"],
  },
  {
    id: "compliance-export",
    name: "Compliance report export (OWASP MASVS, PCI DSS, GDPR, HIPAA)",
    description:
      "Audit-ready, exportable compliance evidence for regulated industry deals. Currently a blocker for enterprise sales cycles in fintech and healthcare.",
    priority: "important",
    status: "planned",
    competitorHas: ["Appknox", "NowSecure"],
  },
  {
    id: "cvss",
    name: "CVSS scoring on all findings",
    description:
      "Industry-standard CVSS severity scores on every finding so security teams can triage by quantified risk rather than intuition.",
    priority: "important",
    status: "planned",
    competitorHas: ["Appknox"],
  },
  {
    id: "cicd-integrations",
    name: "Full CI/CD integrations (GitHub Actions, Jenkins, GitLab, Bitrise, Azure DevOps)",
    description:
      "Native pre-built step definitions for all major CI platforms — beyond API tokens. Currently a friction point in enterprise DevSecOps evaluations.",
    priority: "important",
    status: "planned",
    competitorHas: ["Appknox", "NowSecure"],
  },
  {
    id: "ai-sdk-detection",
    name: "AI SDK & library detection inside binaries",
    description:
      "Identifies embedded AI/ML frameworks and third-party AI services inside the binary — a new differentiator as AI-powered mobile apps proliferate.",
    priority: "important",
    status: "planned",
    competitorHas: ["NowSecure"],
  },
  {
    id: "appstore-monitoring",
    name: "App store monitoring (post-launch)",
    description:
      "Monitors app stores for fake, cloned, or repackaged versions of your app after release — extending the security relationship beyond the scan itself.",
    priority: "planned",
    status: "planned",
    competitorHas: ["Appknox"],
  },
  {
    id: "ptaas",
    name: "Manual penetration testing as a service (PTaaS)",
    description:
      "Certified security researchers perform manual penetration testing with reports delivered within 3–5 business days — a high-margin enterprise tier upsell.",
    priority: "planned",
    status: "planned",
    competitorHas: ["Appknox", "NowSecure"],
  },
]

export const PRIORITY_ORDER: Record<RoadmapPriority, number> = {
  critical: 0,
  important: 1,
  planned: 2,
}

export const PRIORITY_LABEL: Record<RoadmapPriority, string> = {
  critical: "Critical gap",
  important: "Important gap",
  planned: "Planned",
}

export const STATUS_LABEL: Record<RoadmapStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  shipped: "Shipped",
}

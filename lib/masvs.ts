import * as z from "zod"

// ---------------------------------------------------------------------------
// OWASP MASVS compliance report
//
// MASVS (Mobile Application Security Verification Standard) groups mobile
// security controls into categories. This module defines the canonical
// categories and the schema/prompt for an AI-generated compliance assessment
// that maps a scan's findings onto those categories with a readiness verdict
// and a controls checklist.
// ---------------------------------------------------------------------------

export interface MasvsCategory {
  id: string
  name: string
  description: string
}

// The MASVS v2 control groups.
export const MASVS_CATEGORIES: MasvsCategory[] = [
  {
    id: "MASVS-STORAGE",
    name: "Storage",
    description: "Secure storage of sensitive data on the device.",
  },
  {
    id: "MASVS-CRYPTO",
    name: "Cryptography",
    description: "Correct use of cryptography to protect sensitive data.",
  },
  {
    id: "MASVS-AUTH",
    name: "Authentication",
    description: "Secure authentication and authorization mechanisms.",
  },
  {
    id: "MASVS-NETWORK",
    name: "Network",
    description: "Secure network communication and TLS configuration.",
  },
  {
    id: "MASVS-PLATFORM",
    name: "Platform",
    description: "Secure interaction with the mobile platform and IPC.",
  },
  {
    id: "MASVS-CODE",
    name: "Code Quality",
    description: "Security best practices in data handling and code quality.",
  },
  {
    id: "MASVS-RESILIENCE",
    name: "Resilience",
    description: "Resistance to reverse engineering and tampering.",
  },
  {
    id: "MASVS-PRIVACY",
    name: "Privacy",
    description: "Protection of user privacy and minimization of data.",
  },
]

export const masvsSchema = z.object({
  overallReadiness: z
    .number()
    .describe("Overall MASVS readiness percentage 0-100 across all categories."),
  verdict: z
    .enum(["compliant", "partial", "non_compliant"])
    .describe(
      "compliant (>=85% and no critical gaps), partial (mixed), or non_compliant (major gaps).",
    ),
  summary: z
    .string()
    .describe(
      "2-3 sentence executive summary of the app's MASVS compliance posture.",
    ),
  categories: z
    .array(
      z.object({
        id: z
          .string()
          .describe(
            "One of the MASVS category ids, e.g. MASVS-STORAGE, MASVS-NETWORK.",
          ),
        name: z.string().describe("Human-readable category name."),
        status: z
          .enum(["pass", "partial", "fail", "not_applicable"])
          .describe("Compliance status for this category."),
        readiness: z
          .number()
          .describe("Readiness percentage 0-100 for this category."),
        assessment: z
          .string()
          .describe(
            "1-2 sentences tying the verdict to the specific findings (or absence of them) for this app.",
          ),
        controls: z
          .array(
            z.object({
              label: z.string().describe("Short control requirement."),
              met: z.boolean().describe("Whether this control is satisfied."),
            }),
          )
          .describe("Checklist of 2-4 key controls for this category."),
      }),
    )
    .describe("Per-category MASVS assessment, one entry per relevant category."),
})

export type MasvsReport = z.infer<typeof masvsSchema>

export interface MasvsScanContext {
  appName: string
  platform: string
  riskScore: number
  findings: Array<{
    title: string
    severity: string
    category: string
    masvs: string | null
    description: string
  }>
}

export const MASVS_SYSTEM =
  "You are RASMISER's OWASP MASVS compliance auditor. You map static and dynamic mobile security findings onto the MASVS v2 control categories and produce an audit-ready compliance assessment. You are rigorous and evidence-based: every verdict must trace back to the findings provided (or their absence). You never fabricate findings."

export function buildMasvsPrompt(ctx: MasvsScanContext): string {
  const findingLines = ctx.findings.length
    ? ctx.findings
        .map(
          (f) =>
            `- [${f.severity}] ${f.title} (${f.masvs ?? f.category}): ${f.description}`,
        )
        .join("\n")
    : "- No findings were detected in this scan."

  const categoryLines = MASVS_CATEGORIES.map(
    (c) => `- ${c.id} (${c.name}): ${c.description}`,
  ).join("\n")

  return `Assess this mobile application's compliance against the OWASP MASVS v2 control categories.

APP
- Name: ${ctx.appName}
- Platform: ${ctx.platform}
- Risk score (0-100, higher = riskier): ${ctx.riskScore}

MASVS CATEGORIES
${categoryLines}

SCAN FINDINGS
${findingLines}

Guidance:
- Produce one entry per MASVS category that is relevant to a ${ctx.platform} app. If a category has no related findings, treat it as likely passing but note the limited evidence.
- Map each finding to the correct category using its MASVS tag where available.
- A category with a critical or high finding should be "fail" or "partial", never "pass".
- readiness percentages should be consistent with the statuses (pass ~85-100, partial ~50-84, fail <50).
- The controls checklist should reflect the specific findings for this app, not generic items.
- Keep assessments concrete and tied to the actual findings above.`
}

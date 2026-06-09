import * as z from "zod"
import {
  SHIELDS,
  THREAT_META,
  evaluateCompliance,
  type ThreatType,
} from "@/lib/shield-engine"

// ---------------------------------------------------------------------------
// AI Security Analyst
//
// Shared schema + prompt builder for the AI-powered runtime security analysis.
// The model receives a structured snapshot of a protected app (shields,
// threat activity, compliance posture) and returns a prioritized, plain-English
// security briefing with concrete remediation recommendations.
// ---------------------------------------------------------------------------

export const analysisSchema = z.object({
  postureScore: z
    .number()
    .describe(
      "Overall runtime security posture from 0-100. Higher is stronger.",
    ),
  postureGrade: z
    .enum(["A", "B", "C", "D", "F"])
    .describe("Letter grade summarizing the posture score."),
  headline: z
    .string()
    .describe(
      "One concise sentence summarizing the app's current runtime security state.",
    ),
  summary: z
    .string()
    .describe(
      "A 2-3 sentence plain-English assessment of the threat activity and defensive posture.",
    ),
  keyRisks: z
    .array(
      z.object({
        title: z.string().describe("Short risk title."),
        severity: z.enum(["critical", "high", "medium", "low"]),
        detail: z
          .string()
          .describe("Why this matters for this specific app, 1-2 sentences."),
      }),
    )
    .describe("The most important runtime risks, most severe first."),
  recommendations: z
    .array(
      z.object({
        action: z.string().describe("A specific, actionable recommendation."),
        shieldId: z
          .string()
          .nullable()
          .describe(
            "The id of the shield this recommendation enables, or null if not shield-specific.",
          ),
        impact: z
          .enum(["high", "medium", "low"])
          .describe("Expected security impact of taking this action."),
      }),
    )
    .describe("Prioritized recommendations to improve the posture."),
})

export type SecurityAnalysis = z.infer<typeof analysisSchema>

export interface AnalystAppContext {
  appName: string
  platform: string
  protectionLevel: string
  shields: string[]
  attacksBlocked: number
  installCount: number
  riskLevel: string
  events: Array<{
    threatType: string
    severity: string
    action: string
    country: string | null
    deviceModel: string | null
  }>
}

/**
 * Build the model prompt from a protected app's runtime context. Pre-computes
 * shield names, threat distribution, and compliance readiness so the model
 * reasons over clean, labelled data rather than raw ids.
 */
export function buildAnalystPrompt(ctx: AnalystAppContext): string {
  const enabledShields = SHIELDS.filter((s) => ctx.shields.includes(s.id))
  const disabledShields = SHIELDS.filter((s) => !ctx.shields.includes(s.id))

  const threatCounts = new Map<string, number>()
  const blockedByType = new Map<string, number>()
  for (const e of ctx.events) {
    threatCounts.set(e.threatType, (threatCounts.get(e.threatType) ?? 0) + 1)
    if (e.action === "blocked" || e.action === "terminated") {
      blockedByType.set(
        e.threatType,
        (blockedByType.get(e.threatType) ?? 0) + 1,
      )
    }
  }

  const threatLines = [...threatCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => {
      const meta = THREAT_META[type as ThreatType]
      const blocked = blockedByType.get(type) ?? 0
      return `- ${meta?.label ?? type} (${meta?.severity ?? "unknown"} severity): ${count} events, ${blocked} stopped, ${count - blocked} only flagged`
    })
    .join("\n")

  const compliance = evaluateCompliance(ctx.shields)
  const complianceLines = compliance
    .map(
      (c) =>
        `- ${c.framework.name}: ${c.readiness}% ready (${c.status}); missing ${
          c.missing.length === 0
            ? "nothing"
            : c.missing
                .map((id) => SHIELDS.find((s) => s.id === id)?.name ?? id)
                .join(", ")
        }`,
    )
    .join("\n")

  return `Analyze the runtime security posture of this mobile application and produce a prioritized security briefing.

APP
- Name: ${ctx.appName}
- Platform: ${ctx.platform}
- Protection level: ${ctx.protectionLevel}
- Risk level (current): ${ctx.riskLevel}
- Protected installs: ${ctx.installCount}
- Attacks blocked (all time): ${ctx.attacksBlocked}

ENABLED SHIELDS (${enabledShields.length})
${enabledShields.map((s) => `- ${s.name}: ${s.description}`).join("\n") || "- none"}

DISABLED SHIELDS (${disabledShields.length})
${disabledShields.map((s) => `- ${s.name} (id: ${s.id}): mitigates ${s.mitigates.join(", ")}`).join("\n") || "- none"}

RECENT THREAT ACTIVITY (${ctx.events.length} events)
${threatLines || "- no events recorded"}

COMPLIANCE READINESS
${complianceLines}

Guidance:
- Threats that are repeatedly "only flagged" (not stopped) indicate a missing or mis-configured shield. Call these out as key risks and recommend the specific disabled shield (use its id) that would mitigate them.
- The posture score should reflect the balance of threats stopped vs. slipping through, the breadth of enabled shields, and compliance readiness.
- Keep language clear and direct for a security engineer. Avoid generic advice; tie everything to this app's actual data.`
}

export const ANALYST_SYSTEM =
  "You are RASMISER's AI Security Analyst, an expert in mobile application runtime self-protection (RASP), MASVS resilience controls, and threat intelligence. You interpret live runtime telemetry from protected Android and iOS apps and translate it into clear, prioritized, actionable security guidance. You are precise, never alarmist, and always ground findings in the provided data."

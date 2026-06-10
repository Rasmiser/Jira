import * as z from "zod"

// ---------------------------------------------------------------------------
// AI Fix Recommendations
//
// Given a single security finding, the model returns a plain-English
// explanation of why it matters plus an exact, copy-pasteable code fix. The
// result is streamed to the client and cached on the finding row so it only
// needs to be generated once.
// ---------------------------------------------------------------------------

export const fixSchema = z.object({
  whyItMatters: z
    .string()
    .describe(
      "2-3 sentences explaining the real-world impact of this vulnerability and what an attacker could do with it. Concrete, not generic.",
    ),
  fixSummary: z
    .string()
    .describe(
      "1-2 sentences describing the recommended fix at a high level before the code.",
    ),
  language: z
    .string()
    .describe(
      "The language/format of the codeFix, e.g. 'kotlin', 'swift', 'java', 'xml', 'gradle', 'json', 'bash'. Lowercase.",
    ),
  codeFix: z
    .string()
    .describe(
      "An exact, copy-pasteable code snippet or config change that remediates the finding. Include a short comment marking what changed. No markdown fences.",
    ),
  verification: z
    .string()
    .describe(
      "One sentence on how the developer can verify the fix worked.",
    ),
})

export type AiFix = z.infer<typeof fixSchema>

export interface FixFindingContext {
  appName: string
  platform: string
  title: string
  severity: string
  category: string
  masvs: string | null
  description: string
  remediation: string
}

export const FIX_SYSTEM =
  "You are RASMISER's AI remediation engineer, an expert in secure mobile development for Android (Kotlin/Java) and iOS (Swift). For a given OWASP MASVS finding you produce a precise, production-ready code fix. You write idiomatic, minimal code that a developer can paste directly into their project. You never invent APIs and you tailor the language and framework to the app's platform."

export function buildFixPrompt(ctx: FixFindingContext): string {
  return `Produce a concrete code fix for the following security finding.

APP
- Name: ${ctx.appName}
- Platform: ${ctx.platform}

FINDING
- Title: ${ctx.title}
- Severity: ${ctx.severity}
- Category: ${ctx.category}
- MASVS control: ${ctx.masvs ?? "n/a"}
- Description: ${ctx.description}
- Existing high-level remediation: ${ctx.remediation}

Guidance:
- Choose the code language appropriate for the platform (${ctx.platform === "ios" ? "Swift for iOS" : "Kotlin/Java/XML/Gradle for Android"}).
- The codeFix must be specific to this finding, not boilerplate. Show the corrected configuration or code, with a brief inline comment marking the change.
- Keep the snippet focused and minimal — only what is needed to fix this issue.
- Do not wrap the code in markdown fences; return raw code in the codeFix field.`
}

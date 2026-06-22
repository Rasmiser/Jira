import * as z from "zod"
import { localeLabel, type ContentType, type Tone } from "@/lib/locales"

// ---------------------------------------------------------------------------
// AI Translate & Adapt
//
// Given a set of source content segments and a target locale, the model returns
// a culturally adapted translation for each segment (not a literal one-to-one
// translation) plus short adaptation notes and a self-assessed quality score.
// The result is streamed to the client and persisted on the translation row.
// ---------------------------------------------------------------------------

export const localizeSchema = z.object({
  segments: z
    .array(
      z.object({
        key: z
          .string()
          .describe("The exact segment key from the source, unchanged."),
        translated: z
          .string()
          .describe(
            "The translated and culturally adapted text for this segment in the target locale. Preserve placeholders like {name}, %s, and {{count}} exactly. Keep store-listing length conventions in mind.",
          ),
        note: z
          .string()
          .nullable()
          .describe(
            "A short note (max ~12 words) only when a non-literal choice, idiom, or length tradeoff was made. Otherwise null.",
          ),
      }),
    )
    .describe("One entry per source segment, in the same order."),
  adaptationNotes: z
    .string()
    .describe(
      "2-3 sentences summarizing market-specific adaptations made for this locale (tone, formality, idioms, character limits, RTL, date/number formats).",
    ),
  qualityScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "Self-assessed confidence (0-100) that this localization reads naturally to a native speaker in the target market.",
    ),
})

export type AiLocalization = z.infer<typeof localizeSchema>

export interface LocalizeContext {
  appName: string
  contentType: ContentType
  platform: string
  sourceLocale: string
  targetLocale: string
  tone: Tone
  segments: { key: string; text: string }[]
}

export const LOCALIZE_SYSTEM =
  "You are RASMISER's senior app localization specialist. You translate and culturally adapt mobile app content (app store listings and in-app UI strings) for global markets. You do not translate literally — you localize: you adapt tone, idioms, formality, length, and conventions so the copy reads as if it were originally written by a native speaker for that market. You always preserve interpolation placeholders ({name}, %s, {{count}}, %1$s) and any HTML/markdown exactly. For app store listings you respect platform character conventions. You never add, drop, or reorder segments."

const CONTENT_GUIDANCE: Record<ContentType, string> = {
  store_listing:
    "This is app store metadata. Keep titles punchy and within typical store limits (~30 chars title, ~30 chars subtitle). Keywords should be locale-relevant search terms, comma-separated. Optimize description for app store discovery while sounding natural.",
  ui_strings:
    "These are in-app UI strings. Keep them short and action-oriented so they fit buttons and labels. Match platform UI wording conventions for the target language.",
}

export function buildLocalizePrompt(ctx: LocalizeContext): string {
  const segments = ctx.segments
    .filter((s) => s.text.trim().length > 0)
    .map((s) => `- [${s.key}]: ${s.text}`)
    .join("\n")

  return `Localize the following content for a mobile app.

APP
- Name: ${ctx.appName}
- Platform: ${ctx.platform}
- Content type: ${ctx.contentType}
- Desired tone: ${ctx.tone}

SOURCE LOCALE: ${localeLabel(ctx.sourceLocale)}
TARGET LOCALE: ${localeLabel(ctx.targetLocale)}

GUIDANCE
${CONTENT_GUIDANCE[ctx.contentType]}

SOURCE SEGMENTS (translate each, keep the same keys and order)
${segments}

Return one translated entry per source segment using the exact same keys. Adapt for the ${localeLabel(
    ctx.targetLocale,
  )} market rather than translating word for word.`
}

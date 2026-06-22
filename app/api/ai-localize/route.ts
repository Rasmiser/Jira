import { streamText, Output } from "ai"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { localizationProjects, localizationTranslations } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import {
  localizeSchema,
  buildLocalizePrompt,
  LOCALIZE_SYSTEM,
  type LocalizeContext,
} from "@/lib/ai-localize"
import type { ContentType, Tone } from "@/lib/locales"

export const maxDuration = 30

interface SourceSegment {
  key: string
  text: string
}
interface TranslationSegment {
  key: string
  source: string
  translated: string
  note: string | null
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }
  const userId = session.user.id

  const { translationId } = await req.json()
  if (!translationId || typeof translationId !== "string") {
    return new Response("Missing translationId", { status: 400 })
  }

  const trRows = await db
    .select()
    .from(localizationTranslations)
    .where(
      and(
        eq(localizationTranslations.id, translationId),
        eq(localizationTranslations.userId, userId),
      ),
    )
    .limit(1)
  const translation = trRows[0]
  if (!translation) {
    return new Response("Not found", { status: 404 })
  }

  const projRows = await db
    .select()
    .from(localizationProjects)
    .where(
      and(
        eq(localizationProjects.id, translation.projectId),
        eq(localizationProjects.userId, userId),
      ),
    )
    .limit(1)
  const project = projRows[0]
  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  const segments = (project.segments as SourceSegment[]) ?? []

  const ctx: LocalizeContext = {
    appName: project.name,
    contentType: project.contentType as ContentType,
    platform: project.platform,
    sourceLocale: project.sourceLocale,
    targetLocale: translation.locale,
    tone: project.tone as Tone,
    segments,
  }

  // Mark as in-progress so the list reflects state if the user navigates away.
  await db
    .update(localizationTranslations)
    .set({ status: "translating", updatedAt: new Date() })
    .where(
      and(
        eq(localizationTranslations.id, translationId),
        eq(localizationTranslations.userId, userId),
      ),
    )

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: LOCALIZE_SYSTEM,
    prompt: buildLocalizePrompt(ctx),
    output: Output.object({ schema: localizeSchema }),
    onFinish: async ({ text }) => {
      let parsed:
        | {
            segments?: { key: string; translated: string; note: string | null }[]
            adaptationNotes?: string
            qualityScore?: number
          }
        | undefined
      try {
        parsed = JSON.parse(text)
      } catch {
        await db
          .update(localizationTranslations)
          .set({ status: "error", updatedAt: new Date() })
          .where(
            and(
              eq(localizationTranslations.id, translationId),
              eq(localizationTranslations.userId, userId),
            ),
          )
        return
      }

      const byKey = new Map(
        (parsed?.segments ?? []).map((s) => [s.key, s]),
      )
      const merged: TranslationSegment[] = segments.map((s) => ({
        key: s.key,
        source: s.text,
        translated: byKey.get(s.key)?.translated ?? "",
        note: byKey.get(s.key)?.note ?? null,
      }))

      try {
        await db
          .update(localizationTranslations)
          .set({
            segments: merged,
            adaptationNotes: parsed?.adaptationNotes ?? null,
            qualityScore: parsed?.qualityScore ?? null,
            status: "completed",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(localizationTranslations.id, translationId),
              eq(localizationTranslations.userId, userId),
            ),
          )
      } catch (err) {
        console.log("[v0] failed to persist localization:", (err as Error).message)
      }
    },
  })

  return result.toTextStreamResponse()
}

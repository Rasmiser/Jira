import { streamText, Output } from "ai"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { findings, scans } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import {
  fixSchema,
  buildFixPrompt,
  FIX_SYSTEM,
  type FixFindingContext,
} from "@/lib/ai-fix"

export const maxDuration = 30

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }
  const userId = session.user.id

  const { findingId } = await req.json()
  if (!findingId || typeof findingId !== "string") {
    return new Response("Missing findingId", { status: 400 })
  }

  // Scope the lookup to the authenticated user.
  const rows = await db
    .select()
    .from(findings)
    .where(and(eq(findings.id, findingId), eq(findings.userId, userId)))
    .limit(1)
  const finding = rows[0]
  if (!finding) {
    return new Response("Not found", { status: 404 })
  }

  const scanRows = await db
    .select()
    .from(scans)
    .where(and(eq(scans.id, finding.scanId), eq(scans.userId, userId)))
    .limit(1)
  const scan = scanRows[0]

  const ctx: FixFindingContext = {
    appName: scan?.appName ?? "the application",
    platform: scan?.platform ?? "android",
    title: finding.title,
    severity: finding.severity,
    category: finding.category,
    masvs: finding.masvs,
    description: finding.description,
    remediation: finding.remediation,
  }

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: FIX_SYSTEM,
    prompt: buildFixPrompt(ctx),
    output: Output.object({ schema: fixSchema }),
    onFinish: async ({ output }) => {
      const fix = output as
        | { fixSummary?: string; codeFix?: string; language?: string }
        | undefined
      if (!fix?.codeFix) return
      try {
        await db
          .update(findings)
          .set({
            aiFixSummary: fix.fixSummary ?? null,
            aiFixCode: fix.codeFix ?? null,
            aiFixLanguage: fix.language ?? null,
            aiFixGeneratedAt: new Date(),
          })
          .where(and(eq(findings.id, findingId), eq(findings.userId, userId)))
      } catch (err) {
        console.log("[v0] failed to cache AI fix:", (err as Error).message)
      }
    },
  })

  return result.toTextStreamResponse()
}

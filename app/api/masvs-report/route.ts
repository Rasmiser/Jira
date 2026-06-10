import { streamText, Output } from "ai"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { findings, scans } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import {
  masvsSchema,
  buildMasvsPrompt,
  MASVS_SYSTEM,
  type MasvsScanContext,
} from "@/lib/masvs"

export const maxDuration = 60

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }
  const userId = session.user.id

  const { scanId } = await req.json()
  if (!scanId || typeof scanId !== "string") {
    return new Response("Missing scanId", { status: 400 })
  }

  const scanRows = await db
    .select()
    .from(scans)
    .where(and(eq(scans.id, scanId), eq(scans.userId, userId)))
    .limit(1)
  const scan = scanRows[0]
  if (!scan) {
    return new Response("Not found", { status: 404 })
  }

  const findingRows = await db
    .select()
    .from(findings)
    .where(and(eq(findings.scanId, scanId), eq(findings.userId, userId)))

  const ctx: MasvsScanContext = {
    appName: scan.appName,
    platform: scan.platform,
    riskScore: scan.riskScore ?? 0,
    findings: findingRows.map((f) => ({
      title: f.title,
      severity: f.severity,
      category: f.category,
      masvs: f.masvs,
      description: f.description,
    })),
  }

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: MASVS_SYSTEM,
    prompt: buildMasvsPrompt(ctx),
    output: Output.object({ schema: masvsSchema }),
  })

  return result.toTextStreamResponse()
}

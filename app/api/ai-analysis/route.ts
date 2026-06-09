import { streamText, Output } from "ai"
import { getProtectedApp, getThreatEvents } from "@/app/actions/protection"
import {
  analysisSchema,
  buildAnalystPrompt,
  ANALYST_SYSTEM,
  type AnalystAppContext,
} from "@/lib/ai-analyst"

export const maxDuration = 30

export async function POST(req: Request) {
  const { appId } = await req.json()
  if (!appId || typeof appId !== "string") {
    return new Response("Missing appId", { status: 400 })
  }

  // getProtectedApp is scoped to the authenticated user, so this also enforces
  // ownership of the requested app.
  const app = await getProtectedApp(appId)
  if (!app) {
    return new Response("Not found", { status: 404 })
  }

  const events = await getThreatEvents({ appId, limit: 50 })
  const ctx: AnalystAppContext = {
    appName: app.appName,
    platform: app.platform,
    protectionLevel: app.protectionLevel,
    shields: Array.isArray(app.shields) ? (app.shields as string[]) : [],
    attacksBlocked: app.attacksBlocked,
    installCount: app.installCount,
    riskLevel: app.riskLevel,
    events: events.map((e) => ({
      threatType: e.threatType,
      severity: e.severity,
      action: e.action,
      country: e.country,
      deviceModel: e.deviceModel,
    })),
  }

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: ANALYST_SYSTEM,
    prompt: buildAnalystPrompt(ctx),
    output: Output.object({ schema: analysisSchema }),
  })

  return result.toTextStreamResponse()
}

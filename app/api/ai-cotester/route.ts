import { streamText, Output } from "ai"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {
  testCaseSchema,
  buildAuthorPrompt,
  COTESTER_SYSTEM,
  type AuthorContext,
} from "@/lib/ai-cotester"

export const maxDuration = 30

const VALID_PLATFORMS = new Set(["android", "ios", "web", "cross"])

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const description =
    typeof body?.description === "string" ? body.description.trim() : ""
  const platform =
    typeof body?.platform === "string" && VALID_PLATFORMS.has(body.platform)
      ? body.platform
      : "cross"
  const appName =
    typeof body?.appName === "string" && body.appName.trim()
      ? body.appName.trim()
      : null

  if (description.length < 8) {
    return new Response("Description too short", { status: 400 })
  }

  const ctx: AuthorContext = { description, platform, appName }

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: COTESTER_SYSTEM,
    prompt: buildAuthorPrompt(ctx),
    output: Output.object({ schema: testCaseSchema }),
  })

  return result.toTextStreamResponse()
}

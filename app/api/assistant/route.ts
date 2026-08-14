import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai-assistant"

export const maxDuration = 30

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const messages = Array.isArray(body?.messages) ? (body.messages as UIMessage[]) : []

  if (messages.length === 0) {
    return new Response("Missing messages", { status: 400 })
  }

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: ASSISTANT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}

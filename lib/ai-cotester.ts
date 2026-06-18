import * as z from "zod"

// ---------------------------------------------------------------------------
// CoTester — AI test case authoring
//
// Given a plain-English description of what a user wants to verify, the model
// produces a structured, automatable test case: a clear title, a normalized
// scenario, suggested platform/priority/tags, and an ordered list of steps that
// a test runner could execute (action + target + expected result).
//
// The result is streamed to the client and used to pre-fill the authoring form
// so the QA engineer can review and save it to their library.
// ---------------------------------------------------------------------------

export const testStepSchema = z.object({
  action: z
    .string()
    .describe(
      "The concrete interaction to perform, written as an imperative instruction. e.g. 'Tap the Sign in button', 'Enter a valid email in the Email field'.",
    ),
  target: z
    .string()
    .describe(
      "The UI element, screen, or surface the action applies to. e.g. 'Login screen', 'Email input', 'Cart icon'.",
    ),
  expected: z
    .string()
    .describe(
      "The observable result that proves the step succeeded. e.g. 'The home dashboard is displayed', 'An inline error reads \"Email is required\"'.",
    ),
})

export type TestStep = z.infer<typeof testStepSchema>

export const testCaseSchema = z.object({
  title: z
    .string()
    .describe(
      "A short, specific test case title in Title Case. e.g. 'Successful login with valid credentials'. No trailing punctuation.",
    ),
  scenario: z
    .string()
    .describe(
      "A 1-2 sentence normalized description of what this test verifies and why it matters, written in clear plain English.",
    ),
  platform: z
    .enum(["android", "ios", "web", "cross"])
    .describe(
      "The most appropriate platform for this test. Use 'cross' when the flow is platform-agnostic.",
    ),
  priority: z
    .enum(["low", "medium", "high", "critical"])
    .describe(
      "Test priority based on user impact and risk. Auth, payments and data-loss flows are 'critical' or 'high'.",
    ),
  tags: z
    .array(z.string())
    .max(5)
    .describe(
      "1-5 short lowercase tags categorizing the test. e.g. ['authentication', 'smoke', 'regression'].",
    ),
  steps: z
    .array(testStepSchema)
    .min(2)
    .max(12)
    .describe(
      "The ordered steps to execute the test, including setup, the core actions, and verification. Be precise and self-contained.",
    ),
})

export type GeneratedTestCase = z.infer<typeof testCaseSchema>

export interface AuthorContext {
  description: string
  platform: string
  appName: string | null
}

export const COTESTER_SYSTEM =
  "You are RASMISER CoTester, an expert QA automation engineer. You convert plain-English testing intent into precise, deterministic, end-to-end test cases for mobile (Android/iOS) and web apps. Your steps are concrete, atomic, and independently verifiable — each has a clear action, a target element, and an observable expected result. You never invent product features that were not implied by the request; when details are missing you choose sensible, conventional UX behavior. You write for an automated test runner, so steps avoid vague language like 'check that it works'."

export function buildAuthorPrompt(ctx: AuthorContext): string {
  return `Author a complete end-to-end test case from the following intent.

INTENT
${ctx.description}

CONTEXT
- App: ${ctx.appName ?? "the application under test"}
- Preferred platform: ${ctx.platform}

Guidance:
- Produce a clear title, a normalized scenario, and an ordered list of 2-12 atomic steps.
- Each step must have a specific action, the target element/screen, and an observable expected result.
- Include any required setup steps first (e.g. launching the app, navigating to a screen) and a final verification step.
- Choose platform, priority, and tags that fit the intent. Prefer the preferred platform "${ctx.platform}" unless the intent clearly implies another.
- Keep everything self-contained so the test can run without external context.`
}

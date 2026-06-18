"use server"

import { db } from "@/lib/db"
import { testCases, testCaseRuns } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getUserId } from "@/lib/subscription"
import type { TestStep } from "@/lib/ai-cotester"
import { getDevice } from "@/lib/device-cloud"
import { executeTestCase } from "@/lib/test-case-engine"

const VALID_PLATFORMS = new Set(["android", "ios", "web", "cross"])
const VALID_PRIORITIES = new Set(["low", "medium", "high", "critical"])
const VALID_STATUSES = new Set(["draft", "ready", "archived"])

export async function getTestCases() {
  const userId = await getUserId()
  return db
    .select()
    .from(testCases)
    .where(eq(testCases.userId, userId))
    .orderBy(desc(testCases.updatedAt))
}

export async function getTestCase(id: string) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(testCases)
    .where(and(eq(testCases.id, id), eq(testCases.userId, userId)))
    .limit(1)
  return rows[0] ?? null
}

export async function getCaseRuns(caseId: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(testCaseRuns)
    .where(and(eq(testCaseRuns.caseId, caseId), eq(testCaseRuns.userId, userId)))
    .orderBy(desc(testCaseRuns.createdAt))
}

export async function getCaseRun(runId: string) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(testCaseRuns)
    .where(and(eq(testCaseRuns.id, runId), eq(testCaseRuns.userId, userId)))
    .limit(1)
  return rows[0] ?? null
}

function parseSteps(raw: string): TestStep[] {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((s) => s && typeof s === "object")
      .map((s) => ({
        action: String(s.action ?? "").trim(),
        target: String(s.target ?? "").trim(),
        expected: String(s.expected ?? "").trim(),
      }))
      .filter((s) => s.action)
  } catch {
    return []
  }
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8)
}

/** Create a test case (from the AI authoring flow or manual entry). */
export async function createTestCase(formData: FormData) {
  const userId = await getUserId()

  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const platform = String(formData.get("platform") || "cross")
  const priority = String(formData.get("priority") || "medium")
  const status = String(formData.get("status") || "ready")
  const source = String(formData.get("source") || "manual") === "ai" ? "ai" : "manual"
  const tags = parseTags(String(formData.get("tags") || ""))
  const steps = parseSteps(String(formData.get("steps") || "[]"))

  if (!title || !description) return { error: "invalid" as const }
  if (steps.length === 0) return { error: "no_steps" as const }

  const id = crypto.randomUUID()
  await db.insert(testCases).values({
    id,
    userId,
    title,
    description,
    platform: VALID_PLATFORMS.has(platform) ? platform : "cross",
    priority: VALID_PRIORITIES.has(priority) ? priority : "medium",
    status: VALID_STATUSES.has(status) ? status : "ready",
    source,
    tags,
    steps,
  })

  revalidatePath("/dashboard/test-cases")
  redirect(`/dashboard/test-cases/${id}`)
}

/** Update an existing test case's editable fields. */
export async function updateTestCase(formData: FormData) {
  const userId = await getUserId()
  const id = String(formData.get("id") || "")
  if (!id) return { error: "invalid" as const }

  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const platform = String(formData.get("platform") || "cross")
  const priority = String(formData.get("priority") || "medium")
  const status = String(formData.get("status") || "ready")
  const tags = parseTags(String(formData.get("tags") || ""))
  const steps = parseSteps(String(formData.get("steps") || "[]"))

  if (!title || !description) return { error: "invalid" as const }
  if (steps.length === 0) return { error: "no_steps" as const }

  await db
    .update(testCases)
    .set({
      title,
      description,
      platform: VALID_PLATFORMS.has(platform) ? platform : "cross",
      priority: VALID_PRIORITIES.has(priority) ? priority : "medium",
      status: VALID_STATUSES.has(status) ? status : "ready",
      tags,
      steps,
      updatedAt: new Date(),
    })
    .where(and(eq(testCases.id, id), eq(testCases.userId, userId)))

  revalidatePath(`/dashboard/test-cases/${id}`)
  revalidatePath("/dashboard/test-cases")
  return { ok: true as const }
}

export async function deleteTestCase(id: string) {
  const userId = await getUserId()
  await db
    .delete(testCaseRuns)
    .where(and(eq(testCaseRuns.caseId, id), eq(testCaseRuns.userId, userId)))
  await db
    .delete(testCases)
    .where(and(eq(testCases.id, id), eq(testCases.userId, userId)))
  revalidatePath("/dashboard/test-cases")
  redirect("/dashboard/test-cases")
}

/** Execute a test case against a chosen device from the real device cloud. */
export async function runTestCaseOnDevice(formData: FormData) {
  const userId = await getUserId()
  const caseId = String(formData.get("caseId") || "")
  const deviceId = String(formData.get("deviceId") || "")

  const device = getDevice(deviceId)
  if (!device) return { error: "invalid_device" as const }

  const rows = await db
    .select()
    .from(testCases)
    .where(and(eq(testCases.id, caseId), eq(testCases.userId, userId)))
    .limit(1)
  const testCase = rows[0]
  if (!testCase) return { error: "not_found" as const }

  const steps = (testCase.steps as TestStep[]) ?? []
  if (steps.length === 0) return { error: "no_steps" as const }

  const runId = crypto.randomUUID()
  const result = executeTestCase({ runId, steps, device })

  await db.insert(testCaseRuns).values({
    id: runId,
    userId,
    caseId,
    caseTitle: testCase.title,
    deviceId: device.id,
    deviceName: device.name,
    platform: device.platform,
    osVersion: device.osVersion,
    browser: device.browser ?? null,
    status: result.status,
    durationMs: result.durationMs,
    passedSteps: result.passedSteps,
    failedSteps: result.failedSteps,
    totalSteps: result.totalSteps,
    stepResults: result.stepResults,
  })

  await db
    .update(testCases)
    .set({
      lastRunStatus: result.status,
      lastRunAt: new Date(),
      runCount: (testCase.runCount ?? 0) + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(testCases.id, caseId), eq(testCases.userId, userId)))

  revalidatePath(`/dashboard/test-cases/${caseId}`)
  redirect(`/dashboard/test-cases/${caseId}/runs/${runId}`)
}

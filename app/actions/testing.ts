"use server"

import { db } from "@/lib/db"
import { testRuns, testChecks } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getUserId } from "@/lib/subscription"
import {
  runTestSuite,
  getTestTypeMeta,
  type TestType,
  TEST_TYPES,
} from "@/lib/test-engine"

const VALID_TYPES = new Set(TEST_TYPES.map((t) => t.type))

export async function getTestRuns(testType?: TestType) {
  const userId = await getUserId()
  const where = testType
    ? and(eq(testRuns.userId, userId), eq(testRuns.testType, testType))
    : eq(testRuns.userId, userId)
  return db.select().from(testRuns).where(where).orderBy(desc(testRuns.createdAt))
}

export async function getTestRun(id: string) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(testRuns)
    .where(and(eq(testRuns.id, id), eq(testRuns.userId, userId)))
    .limit(1)
  return rows[0] ?? null
}

export async function getTestChecks(runId: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(testChecks)
    .where(and(eq(testChecks.runId, runId), eq(testChecks.userId, userId)))
}

/**
 * Runs one of the six QA test suites against a target and persists the results.
 */
export async function createTestRun(formData: FormData) {
  const userId = await getUserId()

  const testType = String(formData.get("testType") || "") as TestType
  const appName = String(formData.get("appName") || "").trim()
  const platform = String(formData.get("platform") || "android")
  const target = String(formData.get("target") || "").trim() || null

  if (!VALID_TYPES.has(testType)) {
    return { error: "invalid_type" as const }
  }
  if (!appName) {
    return { error: "invalid" as const }
  }

  const runId = crypto.randomUUID()
  const result = runTestSuite({ runId, testType, appName, platform })

  await db.insert(testRuns).values({
    id: runId,
    userId,
    testType,
    appName,
    platform,
    target,
    status: "completed",
    score: result.score,
    grade: result.grade,
    passCount: result.counts.pass,
    warnCount: result.counts.warn,
    failCount: result.counts.fail,
    summary: result.summary,
    completedAt: new Date(),
  })

  if (result.checks.length > 0) {
    await db.insert(testChecks).values(
      result.checks.map((c) => ({
        id: crypto.randomUUID(),
        runId,
        userId,
        name: c.name,
        status: c.status,
        category: c.category,
        detail: c.detail,
        metric: c.metric,
        recommendation: c.recommendation,
      })),
    )
  }

  revalidatePath("/dashboard/testing")
  redirect(`/dashboard/testing/runs/${runId}`)
}

export async function deleteTestRun(id: string) {
  const userId = await getUserId()
  await db
    .delete(testChecks)
    .where(and(eq(testChecks.runId, id), eq(testChecks.userId, userId)))
  await db
    .delete(testRuns)
    .where(and(eq(testRuns.id, id), eq(testRuns.userId, userId)))
  revalidatePath("/dashboard/testing")
}

export { getTestTypeMeta }

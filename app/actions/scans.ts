"use server"

import { db } from "@/lib/db"
import { scans, findings } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getUserId, getUsage } from "@/lib/subscription"
import { runScan } from "@/lib/scan-engine"

export async function getScans() {
  const userId = await getUserId()
  return db
    .select()
    .from(scans)
    .where(eq(scans.userId, userId))
    .orderBy(desc(scans.createdAt))
}

export async function getScan(id: string) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(scans)
    .where(and(eq(scans.id, id), eq(scans.userId, userId)))
    .limit(1)
  return rows[0] ?? null
}

export async function getFindings(scanId: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(findings)
    .where(and(eq(findings.scanId, scanId), eq(findings.userId, userId)))
}

/**
 * Creates a scan from an uploaded file's metadata, runs the (simulated) engine,
 * and persists findings. Enforces the user's monthly plan limit.
 */
export async function createScan(formData: FormData) {
  const userId = await getUserId()

  const usage = await getUsage(userId)
  if (!usage.canScan) {
    return { error: "limit_reached" as const }
  }

  const appName = String(formData.get("appName") || "").trim()
  const fileName = String(formData.get("fileName") || "").trim()
  const platform = String(formData.get("platform") || "android") as
    | "android"
    | "ios"
  const fileSize = Number(formData.get("fileSize") || 0)

  if (!appName || !fileName) {
    return { error: "invalid" as const }
  }

  const scanId = crypto.randomUUID()
  const result = runScan({ scanId, appName, platform })

  await db.insert(scans).values({
    id: scanId,
    userId,
    appName,
    fileName,
    platform,
    fileSize,
    packageName: result.packageName,
    versionName: result.versionName,
    status: "completed",
    riskScore: result.riskScore,
    grade: result.grade,
    criticalCount: result.counts.critical,
    highCount: result.counts.high,
    mediumCount: result.counts.medium,
    lowCount: result.counts.low,
    completedAt: new Date(),
  })

  if (result.findings.length > 0) {
    await db.insert(findings).values(
      result.findings.map((f) => ({
        id: crypto.randomUUID(),
        scanId,
        userId,
        title: f.title,
        severity: f.severity,
        category: f.category,
        masvs: f.masvs,
        description: f.description,
        remediation: f.remediation,
        reference: f.reference,
      })),
    )
  }

  revalidatePath("/dashboard")
  redirect(`/dashboard/scans/${scanId}`)
}

/**
 * Returns two scans (base + target) with their findings, scoped to the current
 * user. Used by the version-comparison view. Returns null for a side that does
 * not exist or does not belong to the user.
 */
export async function getComparison(baseId: string, targetId: string) {
  const userId = await getUserId()

  const [scanRows, findingRows] = await Promise.all([
    db
      .select()
      .from(scans)
      .where(eq(scans.userId, userId)),
    db
      .select()
      .from(findings)
      .where(eq(findings.userId, userId)),
  ])

  const base = scanRows.find((s) => s.id === baseId) ?? null
  const target = scanRows.find((s) => s.id === targetId) ?? null

  return {
    base,
    target,
    baseFindings: findingRows.filter((f) => f.scanId === baseId),
    targetFindings: findingRows.filter((f) => f.scanId === targetId),
  }
}

export async function deleteScan(id: string) {
  const userId = await getUserId()
  await db.delete(findings).where(and(eq(findings.scanId, id), eq(findings.userId, userId)))
  await db.delete(scans).where(and(eq(scans.id, id), eq(scans.userId, userId)))
  revalidatePath("/dashboard")
}

"use server"

import { db } from "@/lib/db"
import { protectedApps, threatEvents, scans } from "@/lib/db/schema"
import { and, desc, eq, gte, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getUserId } from "@/lib/subscription"
import {
  defaultShieldsForLevel,
  generateThreat,
  type ProtectionLevel,
} from "@/lib/shield-engine"

// ---------------------------------------------------------------------------
// Protected apps
// ---------------------------------------------------------------------------

export async function getProtectedApps() {
  const userId = await getUserId()
  return db
    .select()
    .from(protectedApps)
    .where(eq(protectedApps.userId, userId))
    .orderBy(desc(protectedApps.createdAt))
}

export async function getProtectedApp(id: string) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(protectedApps)
    .where(and(eq(protectedApps.id, id), eq(protectedApps.userId, userId)))
    .limit(1)
  return rows[0] ?? null
}

/**
 * Apply no-code runtime protection to an app. The app can either reference an
 * existing completed scan or be entered manually.
 */
export async function protectApp(formData: FormData) {
  const userId = await getUserId()

  const scanId = String(formData.get("scanId") || "").trim() || null
  let appName = String(formData.get("appName") || "").trim()
  let packageName = String(formData.get("packageName") || "").trim() || null
  let platform = String(formData.get("platform") || "android") as
    | "android"
    | "ios"
  let versionName = String(formData.get("versionName") || "").trim() || null
  const level = String(formData.get("protectionLevel") || "standard") as
    | ProtectionLevel
  const selectedShields = formData.getAll("shields").map(String)

  // Hydrate from the referenced scan when present.
  if (scanId) {
    const scanRows = await db
      .select()
      .from(scans)
      .where(and(eq(scans.id, scanId), eq(scans.userId, userId)))
      .limit(1)
    const scan = scanRows[0]
    if (scan) {
      appName = appName || scan.appName
      packageName = packageName || scan.packageName
      platform = (scan.platform as "android" | "ios") || platform
      versionName = versionName || scan.versionName
    }
  }

  if (!appName) {
    return { error: "invalid" as const }
  }

  const shields =
    selectedShields.length > 0 ? selectedShields : defaultShieldsForLevel(level)

  const id = crypto.randomUUID()
  await db.insert(protectedApps).values({
    id,
    userId,
    scanId,
    appName,
    packageName,
    platform,
    versionName,
    status: "protected",
    protectionLevel: level,
    shields,
    installCount: 0,
    attacksBlocked: 0,
    riskLevel: "low",
  })

  // Seed a small initial burst of threat events so the app immediately shows
  // activity in the live feed.
  await generateEventsForApp(id, 6)

  revalidatePath("/dashboard/protection")
  revalidatePath("/dashboard/threats")
  redirect(`/dashboard/protection/${id}`)
}

export async function updateAppShields(formData: FormData) {
  const userId = await getUserId()
  const id = String(formData.get("id") || "")
  const level = String(formData.get("protectionLevel") || "standard") as
    | ProtectionLevel
  const selectedShields = formData.getAll("shields").map(String)

  const shields =
    selectedShields.length > 0 ? selectedShields : defaultShieldsForLevel(level)

  await db
    .update(protectedApps)
    .set({ protectionLevel: level, shields, updatedAt: new Date() })
    .where(and(eq(protectedApps.id, id), eq(protectedApps.userId, userId)))

  revalidatePath(`/dashboard/protection/${id}`)
  revalidatePath("/dashboard/protection")
}

export async function toggleAppStatus(id: string) {
  const userId = await getUserId()
  const app = await getProtectedApp(id)
  if (!app) return
  await db
    .update(protectedApps)
    .set({
      status: app.status === "paused" ? "protected" : "paused",
      updatedAt: new Date(),
    })
    .where(and(eq(protectedApps.id, id), eq(protectedApps.userId, userId)))
  revalidatePath(`/dashboard/protection/${id}`)
  revalidatePath("/dashboard/protection")
}

export async function deleteProtectedApp(id: string) {
  const userId = await getUserId()
  await db
    .delete(threatEvents)
    .where(and(eq(threatEvents.appId, id), eq(threatEvents.userId, userId)))
  await db
    .delete(protectedApps)
    .where(and(eq(protectedApps.id, id), eq(protectedApps.userId, userId)))
  revalidatePath("/dashboard/protection")
  revalidatePath("/dashboard/threats")
}

// ---------------------------------------------------------------------------
// Threat events
// ---------------------------------------------------------------------------

export async function getThreatEvents(opts?: { appId?: string; limit?: number }) {
  const userId = await getUserId()
  const conditions = [eq(threatEvents.userId, userId)]
  if (opts?.appId) conditions.push(eq(threatEvents.appId, opts.appId))

  return db
    .select()
    .from(threatEvents)
    .where(and(...conditions))
    .orderBy(desc(threatEvents.createdAt))
    .limit(opts?.limit ?? 50)
}

export interface ThreatStats {
  totalEvents: number
  blocked: number
  last24h: number
  byType: { threatType: string; count: number }[]
  bySeverity: Record<string, number>
}

export async function getThreatStats(): Promise<ThreatStats> {
  const userId = await getUserId()
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      blocked: sql<number>`count(*) filter (where ${threatEvents.action} in ('blocked','terminated'))::int`,
    })
    .from(threatEvents)
    .where(eq(threatEvents.userId, userId))

  const [{ last24h }] = await db
    .select({ last24h: sql<number>`count(*)::int` })
    .from(threatEvents)
    .where(
      and(eq(threatEvents.userId, userId), gte(threatEvents.createdAt, dayAgo)),
    )

  const byType = await db
    .select({
      threatType: threatEvents.threatType,
      count: sql<number>`count(*)::int`,
    })
    .from(threatEvents)
    .where(and(eq(threatEvents.userId, userId), gte(threatEvents.createdAt, dayAgo)))
    .groupBy(threatEvents.threatType)
    .orderBy(desc(sql`count(*)`))

  const severityRows = await db
    .select({
      severity: threatEvents.severity,
      count: sql<number>`count(*)::int`,
    })
    .from(threatEvents)
    .where(eq(threatEvents.userId, userId))
    .groupBy(threatEvents.severity)

  const bySeverity: Record<string, number> = {}
  for (const r of severityRows) bySeverity[r.severity] = Number(r.count)

  return {
    totalEvents: Number(totals?.total) || 0,
    blocked: Number(totals?.blocked) || 0,
    last24h: Number(last24h) || 0,
    byType: byType.map((r) => ({
      threatType: r.threatType,
      count: Number(r.count),
    })),
    bySeverity,
  }
}

/**
 * Internal: generate `count` realistic threat events for one app and update its
 * aggregate counters / risk level.
 */
async function generateEventsForApp(appId: string, count: number) {
  const app = await getProtectedApp(appId)
  if (!app) return

  const shields = Array.isArray(app.shields) ? (app.shields as string[]) : []
  const platform = (app.platform as "android" | "ios") || "android"

  const rows = Array.from({ length: count }).map(() => {
    const t = generateThreat(platform, shields)
    // spread timestamps over the past few hours for a natural feed
    const minutesAgo = Math.floor(Math.random() * 360)
    return {
      id: crypto.randomUUID(),
      userId: app.userId,
      appId,
      appName: app.appName,
      platform,
      threatType: t.threatType,
      severity: t.severity,
      action: t.action,
      deviceModel: t.deviceModel,
      osVersion: t.osVersion,
      country: t.country,
      countryCode: t.countryCode,
      description: t.description,
      createdAt: new Date(Date.now() - minutesAgo * 60 * 1000),
    }
  })

  await db.insert(threatEvents).values(rows)

  const blocked = rows.filter(
    (r) => r.action === "blocked" || r.action === "terminated",
  ).length
  const hasCritical = rows.some((r) => r.severity === "critical")
  const hasHigh = rows.some((r) => r.severity === "high")
  const newInstalls = Math.floor(Math.random() * 40)

  await db
    .update(protectedApps)
    .set({
      attacksBlocked: app.attacksBlocked + blocked,
      installCount: app.installCount + newInstalls,
      riskLevel: hasCritical ? "high" : hasHigh ? "medium" : "low",
      updatedAt: new Date(),
    })
    .where(eq(protectedApps.id, appId))
}

/**
 * Public action: simulate new live activity across all of a user's protected
 * apps. Called by the "Simulate live traffic" control on the dashboard.
 */
export async function simulateTraffic() {
  const userId = await getUserId()
  const apps = await db
    .select()
    .from(protectedApps)
    .where(
      and(
        eq(protectedApps.userId, userId),
        eq(protectedApps.status, "protected"),
      ),
    )

  for (const app of apps) {
    await generateEventsForApp(app.id, 2 + Math.floor(Math.random() * 4))
  }

  revalidatePath("/dashboard/threats")
  revalidatePath("/dashboard/protection")
  revalidatePath("/dashboard")
  return { generated: apps.length }
}

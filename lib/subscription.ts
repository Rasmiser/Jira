import "server-only"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { subscriptions, scans } from "@/lib/db/schema"
import { and, eq, gte, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { getPlan, type Plan } from "@/lib/plans"

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getUserId() {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

/**
 * Returns the user's subscription row, creating a default "free" row on first
 * access so every authenticated user always has a plan.
 */
export async function getOrCreateSubscription(userId: string) {
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)

  if (existing.length > 0) return existing[0]

  const id = crypto.randomUUID()
  // onConflictDoNothing guards against a race where two concurrent requests
  // (e.g. the page and getUsage) both try to create the first free row.
  await db
    .insert(subscriptions)
    .values({ id, userId, plan: "free", status: "active" })
    .onConflictDoNothing({ target: subscriptions.userId })

  const created = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)
  return created[0]
}

export interface UsageInfo {
  plan: Plan
  used: number
  limit: number | null // null = unlimited
  remaining: number | null
  canScan: boolean
}

function startOfMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export async function getUsage(userId: string): Promise<UsageInfo> {
  const sub = await getOrCreateSubscription(userId)
  const plan = getPlan(sub.plan)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(scans)
    .where(and(eq(scans.userId, userId), gte(scans.createdAt, startOfMonth())))

  const used = Number(count) || 0
  const limit = plan.scanLimit
  const remaining = limit === null ? null : Math.max(0, limit - used)
  const canScan = limit === null || used < limit

  return { plan, used, limit, remaining, canScan }
}

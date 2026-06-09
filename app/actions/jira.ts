"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { and, eq, isNotNull } from "drizzle-orm"
import { db } from "@/lib/db"
import { scans, findings } from "@/lib/db/schema"
import { getUserId } from "@/lib/subscription"
import {
  createJiraIssueForFinding,
  getJiraIssueStatuses,
  isJiraConfigured,
  JIRA_PROJECT_KEY,
} from "@/lib/jira"
import { notifySlackFindingsPushed } from "@/lib/slack"

async function getBaseUrl() {
  const hdrs = await headers()
  const host = hdrs.get("host")
  const proto = hdrs.get("x-forwarded-proto") ?? "https"
  return `${proto}://${host}`
}

export interface SyncResult {
  ok: boolean
  error?: "not_configured" | "no_findings" | "failed"
  created?: number
  skipped?: number
  slackNotified?: boolean
}

/**
 * Pushes every not-yet-synced finding for a scan to Jira as issues, stores the
 * issue keys, and (optionally) sends a Slack summary. Idempotent: findings that
 * already have a jiraIssueKey are skipped.
 */
export async function pushScanToJira(scanId: string): Promise<SyncResult> {
  const userId = await getUserId()

  if (!isJiraConfigured()) {
    return { ok: false, error: "not_configured" }
  }

  const scanRows = await db
    .select()
    .from(scans)
    .where(and(eq(scans.id, scanId), eq(scans.userId, userId)))
    .limit(1)
  const scan = scanRows[0]
  if (!scan) return { ok: false, error: "failed" }

  const rows = await db
    .select()
    .from(findings)
    .where(and(eq(findings.scanId, scanId), eq(findings.userId, userId)))

  const pending = rows.filter((f) => !f.jiraIssueKey)
  if (pending.length === 0) {
    return { ok: true, created: 0, skipped: rows.length }
  }

  const createdIssues: {
    key: string
    url: string
    title: string
    severity: string
  }[] = []

  try {
    for (const f of pending) {
      const issue = await createJiraIssueForFinding({
        title: f.title,
        severity: f.severity,
        category: f.category,
        masvs: f.masvs,
        description: f.description,
        remediation: f.remediation,
        reference: f.reference,
        appName: scan.appName,
        scanId,
      })

      await db
        .update(findings)
        .set({
          jiraIssueKey: issue.key,
          jiraIssueUrl: issue.url,
          jiraStatus: "To Do",
          jiraSyncedAt: new Date(),
        })
        .where(and(eq(findings.id, f.id), eq(findings.userId, userId)))

      createdIssues.push({
        key: issue.key,
        url: issue.url,
        title: f.title,
        severity: f.severity,
      })
    }
  } catch (err) {
    console.error("[v0] pushScanToJira failed:", err)
    // Surface partial success: some issues may have been created.
    if (createdIssues.length === 0) {
      return { ok: false, error: "failed" }
    }
  }

  const baseUrl = await getBaseUrl()
  const slackNotified = await notifySlackFindingsPushed({
    appName: scan.appName,
    scanId,
    reportUrl: `${baseUrl}/dashboard/scans/${scanId}`,
    boardUrl: `${baseUrl}/dashboard/board`,
    issues: createdIssues,
    counts: {
      critical: createdIssues.filter((i) => i.severity === "critical").length,
      high: createdIssues.filter((i) => i.severity === "high").length,
      medium: createdIssues.filter((i) => i.severity === "medium").length,
      low: createdIssues.filter((i) => i.severity === "low").length,
    },
  })

  revalidatePath(`/dashboard/scans/${scanId}`)
  revalidatePath("/dashboard/board")

  return {
    ok: true,
    created: createdIssues.length,
    skipped: rows.length - pending.length,
    slackNotified,
  }
}

export interface BoardCard {
  id: string
  scanId: string
  appName: string
  title: string
  severity: string
  category: string
  jiraIssueKey: string
  jiraIssueUrl: string
  jiraStatus: string
}

export interface BoardColumn {
  id: string
  title: string
  cards: BoardCard[]
}

/**
 * Returns all of the user's Jira-synced findings grouped into Kanban columns by
 * their live Jira status category (To Do / In Progress / Done). Statuses are
 * refreshed from Jira on each load and persisted back to the database.
 */
export async function getJiraBoard(): Promise<{
  configured: boolean
  projectKey: string
  columns: BoardColumn[]
  total: number
}> {
  const userId = await getUserId()

  const baseColumns: BoardColumn[] = [
    { id: "todo", title: "To Do", cards: [] },
    { id: "inprogress", title: "In Progress", cards: [] },
    { id: "done", title: "Done", cards: [] },
  ]

  if (!isJiraConfigured()) {
    return { configured: false, projectKey: "", columns: baseColumns, total: 0 }
  }

  // All synced findings for this user, joined to their scan for the app name.
  const rows = await db
    .select({
      id: findings.id,
      scanId: findings.scanId,
      title: findings.title,
      severity: findings.severity,
      category: findings.category,
      jiraIssueKey: findings.jiraIssueKey,
      jiraIssueUrl: findings.jiraIssueUrl,
      jiraStatus: findings.jiraStatus,
      appName: scans.appName,
    })
    .from(findings)
    .innerJoin(scans, eq(findings.scanId, scans.id))
    .where(and(eq(findings.userId, userId), isNotNull(findings.jiraIssueKey)))

  if (rows.length === 0) {
    return {
      configured: true,
      projectKey: JIRA_PROJECT_KEY,
      columns: baseColumns,
      total: 0,
    }
  }

  // Refresh live statuses from Jira (best effort).
  const keys = rows.map((r) => r.jiraIssueKey!).filter(Boolean)
  let statuses: Awaited<ReturnType<typeof getJiraIssueStatuses>> = {}
  try {
    statuses = await getJiraIssueStatuses(keys)
  } catch (err) {
    console.error("[v0] getJiraIssueStatuses failed, using cached:", err)
  }

  for (const row of rows) {
    const live = statuses[row.jiraIssueKey!]
    const statusName = live?.status ?? row.jiraStatus ?? "To Do"
    const category = live?.statusCategory ?? row.jiraStatus ?? "To Do"

    // Persist refreshed status when it changed.
    if (live && live.status !== row.jiraStatus) {
      await db
        .update(findings)
        .set({ jiraStatus: live.status })
        .where(and(eq(findings.id, row.id), eq(findings.userId, userId)))
    }

    const card: BoardCard = {
      id: row.id,
      scanId: row.scanId,
      appName: row.appName,
      title: row.title,
      severity: row.severity,
      category: row.category,
      jiraIssueKey: row.jiraIssueKey!,
      jiraIssueUrl: row.jiraIssueUrl ?? "#",
      jiraStatus: statusName,
    }

    const cat = category.toLowerCase()
    if (cat.includes("done") || cat.includes("complete")) {
      baseColumns[2].cards.push(card)
    } else if (cat.includes("progress")) {
      baseColumns[1].cards.push(card)
    } else {
      baseColumns[0].cards.push(card)
    }
  }

  return {
    configured: true,
    projectKey: JIRA_PROJECT_KEY,
    columns: baseColumns,
    total: rows.length,
  }
}

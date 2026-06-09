"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { scans, findings } from "@/lib/db/schema"
import { getUserId } from "@/lib/subscription"
import {
  createJiraIssueForFinding,
  isJiraConfigured,
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
    boardUrl: `${baseUrl}/dashboard/scans/${scanId}`,
    issues: createdIssues,
    counts: {
      critical: createdIssues.filter((i) => i.severity === "critical").length,
      high: createdIssues.filter((i) => i.severity === "high").length,
      medium: createdIssues.filter((i) => i.severity === "medium").length,
      low: createdIssues.filter((i) => i.severity === "low").length,
    },
  })

  revalidatePath(`/dashboard/scans/${scanId}`)

  return {
    ok: true,
    created: createdIssues.length,
    skipped: rows.length - pending.length,
    slackNotified,
  }
}


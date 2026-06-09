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
  /** Human-readable detail surfaced to the UI when something goes wrong. */
  message?: string
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
    const detail = extractJiraError(err)
    // Surface partial success: some issues may have been created.
    if (createdIssues.length === 0) {
      return { ok: false, error: "failed", message: detail }
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

/**
 * Pulls the most useful human-readable message out of a jira.js / Axios error
 * so the UI can tell the user exactly what went wrong (auth, project key,
 * issue type, permissions, etc.) instead of a generic failure.
 */
function extractJiraError(err: unknown): string {
  const anyErr = err as {
    response?: {
      status?: number
      data?: {
        errorMessages?: string[]
        errors?: Record<string, string>
      }
    }
    status?: number
    message?: string
  }

  const status = anyErr?.response?.status ?? anyErr?.status
  const data = anyErr?.response?.data

  const messages: string[] = []
  if (data?.errorMessages?.length) messages.push(...data.errorMessages)
  if (data?.errors) messages.push(...Object.values(data.errors))

  if (messages.length) return messages.join(" ")

  if (status === 401) return "Jira authentication failed — check JIRA_EMAIL and JIRA_API_TOKEN."
  if (status === 403) return "Jira denied access — the account lacks permission to create issues in this project."
  if (status === 404) return "Jira project not found — check JIRA_PROJECT_KEY."

  return anyErr?.message || "Could not push to Jira."
}


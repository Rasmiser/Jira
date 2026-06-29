"use server"

import { revalidatePath } from "next/cache"
import { getJiraClient, isJiraConfigured, JIRA_PROJECT_KEY } from "@/lib/jira"
import { ROADMAP_ITEMS, type RoadmapItem } from "@/lib/roadmap"

export interface RoadmapJiraResult {
  ok: boolean
  error?: "not_configured" | "failed"
  message?: string
  created: { id: string; key: string; url: string }[]
  skipped: string[]
}

const PRIORITY_TO_JIRA: Record<string, string> = {
  critical: "Highest",
  important: "High",
  planned: "Medium",
}

/** Atlassian Document Format paragraph builder. */
function adfDoc(sections: { heading: string; text: string }[]) {
  const content: unknown[] = []
  for (const s of sections) {
    content.push({
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: s.heading }],
    })
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: s.text }],
    })
  }
  return { type: "doc", version: 1, content }
}

/**
 * Creates one Jira Story per competitive-gap roadmap item.
 *
 * - Items that already have a jiraKey passed in `existingKeys` are skipped.
 * - Uses the "Story" issue type (appropriate for product features, not bugs).
 * - Assigns priority from the roadmap tier (critical → Highest, etc.).
 * - Idempotent when called with the same `existingKeys` set.
 */
export async function createRoadmapJiraTickets(
  existingKeys: Record<string, { key: string; url: string }> = {},
): Promise<RoadmapJiraResult> {
  if (!isJiraConfigured()) {
    return { ok: false, error: "not_configured", created: [], skipped: [] }
  }

  const jira = getJiraClient()
  const base = (process.env.JIRA_BASE_URL ?? "").replace(/\/$/, "")

  const created: { id: string; key: string; url: string }[] = []
  const skipped: string[] = []

  for (const item of ROADMAP_ITEMS) {
    // Skip if ticket already exists for this roadmap item id
    if (existingKeys[item.id]) {
      skipped.push(item.id)
      continue
    }

    try {
      const issue = await jira.issues.createIssue({
        fields: {
          project: { key: JIRA_PROJECT_KEY },
          summary: `[ROADMAP] ${item.name}`,
          issuetype: { name: "Story" },
          labels: [
            "rasmiser-roadmap",
            `priority-${item.priority}`,
            ...item.competitorHas.map((c) => `competitor-${c.toLowerCase()}`),
          ],
          description: adfDoc([
            {
              heading: "Overview",
              text: item.description,
            },
            {
              heading: "Competitive context",
              text:
                item.competitorHas.length > 0
                  ? `Competitors that already have this capability: ${item.competitorHas.join(", ")}.`
                  : "No current competitor has this feature — first-mover opportunity.",
            },
            {
              heading: "Priority rationale",
              text:
                item.priority === "critical"
                  ? "Classified as a CRITICAL gap — this is a direct blocker for enterprise sales cycles or a major trust signal missing vs. top competitors."
                  : item.priority === "important"
                    ? "Classified as an IMPORTANT gap — expected by enterprise DevSecOps teams; absence creates friction in evaluations."
                    : "Classified as PLANNED — upsell / retention value or niche growth opportunity.",
            },
          ]) as never,
        },
      })

      const jiraKey = issue.key ?? ""
      const url = `${base}/browse/${jiraKey}`

      // Best-effort priority assignment
      const priorityName = PRIORITY_TO_JIRA[item.priority]
      if (priorityName && jiraKey) {
        try {
          await jira.issues.editIssue({
            issueIdOrKey: jiraKey,
            fields: { priority: { name: priorityName } as never },
          })
        } catch {
          // Priority field not configured on this project — skip silently
        }
      }

      created.push({ id: item.id, key: jiraKey, url })
    } catch (err) {
      const detail = extractDetail(err)
      console.error(`[v0] createRoadmapJiraTickets failed for ${item.id}:`, detail)
      return {
        ok: false,
        error: "failed",
        message: `Failed on "${item.name}": ${detail}`,
        created,
        skipped,
      }
    }
  }

  revalidatePath("/dashboard/features")
  revalidatePath("/dashboard/roadmap")

  return { ok: true, created, skipped }
}

// ---------------------------------------------------------------------------

function extractDetail(err: unknown): string {
  const anyErr = err as {
    response?: { status?: number; data?: { errorMessages?: string[]; errors?: Record<string, string> } }
    status?: number
    message?: string
  }

  const data = anyErr?.response?.data
  const messages: string[] = []
  if (data?.errorMessages?.length) messages.push(...data.errorMessages)
  if (data?.errors) messages.push(...Object.values(data.errors))
  if (messages.length) return messages.join(" ")

  const status = anyErr?.response?.status ?? anyErr?.status
  if (status === 401) return "Jira authentication failed — check JIRA_EMAIL and JIRA_API_TOKEN."
  if (status === 403) return "Jira denied access — the account lacks permission to create issues."
  if (status === 404) return "Jira project not found — check JIRA_PROJECT_KEY."

  return anyErr?.message ?? "Unknown error"
}

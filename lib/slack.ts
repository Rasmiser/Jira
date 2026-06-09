import "server-only"

/**
 * Slack Incoming Webhook notifier.
 *
 * Optional env var:
 * - SLACK_WEBHOOK_URL  Create at https://api.slack.com/messaging/webhooks
 *
 * When the webhook is not configured, all functions are graceful no-ops so the
 * rest of the app keeps working without Slack.
 */

export function isSlackConfigured(): boolean {
  return Boolean(process.env.SLACK_WEBHOOK_URL)
}

const SEVERITY_EMOJI: Record<string, string> = {
  critical: ":red_circle:",
  high: ":large_orange_circle:",
  medium: ":large_yellow_circle:",
  low: ":large_blue_circle:",
  info: ":white_circle:",
}

export interface SlackPushSummary {
  appName: string
  scanId: string
  reportUrl: string
  boardUrl: string
  issues: { key: string; url: string; title: string; severity: string }[]
  counts: { critical: number; high: number; medium: number; low: number }
}

/**
 * Posts a formatted message to Slack summarizing the findings that were just
 * pushed to the Jira board. Returns false on failure without throwing.
 */
export async function notifySlackFindingsPushed(
  summary: SlackPushSummary,
): Promise<boolean> {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return false

  const { counts } = summary
  const countLine = [
    counts.critical ? `*${counts.critical}* critical` : null,
    counts.high ? `*${counts.high}* high` : null,
    counts.medium ? `*${counts.medium}* medium` : null,
    counts.low ? `*${counts.low}* low` : null,
  ]
    .filter(Boolean)
    .join("  ·  ")

  const issueLines = summary.issues
    .slice(0, 10)
    .map(
      (i) =>
        `${SEVERITY_EMOJI[i.severity] ?? ":white_circle:"} <${i.url}|${i.key}> ${i.title}`,
    )
    .join("\n")

  const extra =
    summary.issues.length > 10
      ? `\n_…and ${summary.issues.length - 10} more_`
      : ""

  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🛡️ ${summary.issues.length} findings pushed to Jira — ${summary.appName}`,
          emoji: true,
        },
      },
      ...(countLine
        ? [
            {
              type: "section",
              text: { type: "mrkdwn", text: countLine },
            },
          ]
        : []),
      {
        type: "section",
        text: { type: "mrkdwn", text: issueLines + extra || "_No issues_" },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open Kanban board", emoji: true },
            url: summary.boardUrl,
          },
          {
            type: "button",
            text: { type: "plain_text", text: "View scan report", emoji: true },
            url: summary.reportUrl,
          },
        ],
      },
    ],
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch (err) {
    console.error("[v0] Slack notify failed:", err)
    return false
  }
}

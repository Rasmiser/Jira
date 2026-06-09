"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { pushScanToJira, type SyncResult } from "@/app/actions/jira"
import { Loader2, Check, AlertTriangle } from "lucide-react"

const JIRA_MARK =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij48cGF0aCBkPSJNMjkuOTQgMTUuMDZMMTYuOTQgMi4wNkE0LjQgNC40IDAgMCAwIDE2IDEuMTl2NS43NWwwIC4wMSAwIDBhNi43MyA2LjczIDAgMCAwIDYuNzMgNi43M2g0LjQ0bDIuNzggMi43OGE0LjQgNC40IDAgMCAwIC0uMDEgLTEuNHoiIGZpbGw9IiMyNjg0ZmYiLz48cGF0aCBkPSJNMTYgNi45NWwwIC4wMUE2LjczIDYuNzMgMCAwIDAgMjIuNzMgMTMuN2g0LjQ0TDE2Ljk0IDIuMDZBNC40IDQuNCAwIDAgMCAxNiAxLjE5eiIgZmlsbD0iIzI2ODRmZiIvPjwvc3ZnPg=="

export function SendToJiraButton({
  scanId,
  syncedCount,
  totalFindings,
}: {
  scanId: string
  syncedCount: number
  totalFindings: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<SyncResult | null>(null)

  const allSynced = totalFindings > 0 && syncedCount >= totalFindings
  const pendingCount = Math.max(0, totalFindings - syncedCount)

  const handlePush = () => {
    setResult(null)
    startTransition(async () => {
      const res = await pushScanToJira(scanId)
      setResult(res)
      if (res.ok) router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePush}
          disabled={pending || totalFindings === 0 || allSynced}
          className="inline-flex items-center gap-2 border border-[#2684ff]/50 bg-[#2684ff]/10 px-3 py-2 text-sm text-[#4c9aff] transition-colors hover:bg-[#2684ff]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <img src={JIRA_MARK || "/placeholder.svg"} alt="" className="h-4 w-4" aria-hidden="true" />
          )}
          {allSynced
            ? "Synced to Jira"
            : pending
              ? "Pushing…"
              : syncedCount > 0
                ? `Push ${pendingCount} new to Jira`
                : "Send to Jira"}
        </button>
      </div>

      {result && (
        <p
          className={
            "flex items-center gap-1.5 text-xs " +
            (result.ok ? "text-emerald-400" : "text-red-400")
          }
        >
          {result.ok ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {result.created
                ? `${result.created} issue${result.created === 1 ? "" : "s"} created`
                : "Already up to date"}
              {result.slackNotified ? " · Slack notified" : ""}
            </>
          ) : (
            <>
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {result.error === "not_configured"
                ? "Jira is not configured. Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN and JIRA_PROJECT_KEY."
                : result.message || "Could not push to Jira"}
            </>
          )}
        </p>
      )}
    </div>
  )
}

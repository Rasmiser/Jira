"use client"

import { useState, useTransition } from "react"
import { createRoadmapJiraTickets } from "@/app/actions/roadmap-jira"
import { ExternalLink, Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreatedTicket {
  id: string
  key: string
  url: string
}

export function RoadmapJiraButton({
  isConfigured,
}: {
  isConfigured: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [created, setCreated] = useState<CreatedTicket[]>([])
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function handlePush() {
    setError(null)
    startTransition(async () => {
      const result = await createRoadmapJiraTickets({})
      if (!result.ok) {
        setError(
          result.message ??
            (result.error === "not_configured"
              ? "Jira is not configured. Add JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, and JIRA_PROJECT_KEY to your environment."
              : "Failed to create Jira tickets. Check server logs for details."),
        )
        return
      }
      setCreated(result.created)
      setDone(true)
    })
  }

  if (!isConfigured) {
    return (
      <div className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/10 px-5 py-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="text-sm text-foreground">
          Jira is not configured.{" "}
          <span className="text-muted-foreground">
            Add{" "}
            <code className="font-mono text-xs">JIRA_BASE_URL</code>,{" "}
            <code className="font-mono text-xs">JIRA_EMAIL</code>,{" "}
            <code className="font-mono text-xs">JIRA_API_TOKEN</code>, and{" "}
            <code className="font-mono text-xs">JIRA_PROJECT_KEY</code> in{" "}
            <strong>Settings &rarr; Vars</strong> to enable this.
          </span>
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 border border-emerald-500/40 bg-emerald-500/10 px-5 py-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
          <p className="text-sm text-foreground">
            {created.length} Jira{" "}
            {created.length === 1 ? "ticket" : "tickets"} created successfully.
          </p>
        </div>
        {created.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {created.map((t) => (
              <a
                key={t.id}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 border border-border bg-muted px-2.5 py-1 font-mono text-xs text-foreground transition-colors hover:bg-accent"
              >
                {t.key}
                <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="flex items-start gap-3 border border-red-500/40 bg-red-500/10 px-5 py-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
          <p className="text-sm text-foreground">{error}</p>
        </div>
      )}
      <button
        type="button"
        onClick={handlePush}
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          isPending && "cursor-not-allowed opacity-60",
        )}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {isPending ? "Creating tickets…" : "Push all to Jira"}
      </button>
    </div>
  )
}

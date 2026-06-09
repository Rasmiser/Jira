import Link from "next/link"
import { ExternalLink, Inbox } from "lucide-react"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import type { BoardColumn } from "@/app/actions/jira"

const COLUMN_ACCENT: Record<string, string> = {
  todo: "bg-muted-foreground/50",
  inprogress: "bg-sky-400",
  done: "bg-emerald-400",
}

export function KanbanBoard({
  columns,
  total,
}: {
  columns: BoardColumn[]
  total: number
}) {
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-border px-6 py-20 text-center">
        <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-4 text-sm font-medium text-foreground">
          No findings on the board yet
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Open a completed scan report and use{" "}
          <span className="text-foreground">Send to Jira</span> to push findings
          here. They&apos;ll appear in the matching column based on their Jira
          status.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Go to scans
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((col) => (
        <div key={col.id} className="flex flex-col border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${COLUMN_ACCENT[col.id] ?? "bg-muted-foreground/50"}`}
                aria-hidden="true"
              />
              <h2 className="text-sm font-medium text-foreground">
                {col.title}
              </h2>
            </div>
            <span className="inline-flex h-5 min-w-5 items-center justify-center border border-border px-1.5 text-xs text-muted-foreground">
              {col.cards.length}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-3">
            {col.cards.length === 0 ? (
              <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                Nothing here
              </p>
            ) : (
              col.cards.map((card) => (
                <a
                  key={card.id}
                  href={card.jiraIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border border-border bg-background p-3 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <SeverityBadge severity={card.severity} className="shrink-0" />
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
                      {card.jiraIssueKey}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-snug text-foreground">
                    {card.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{card.appName}</span>
                    <span className="shrink-0 border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                      {card.jiraStatus}
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

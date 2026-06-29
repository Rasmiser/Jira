import type { Metadata } from "next"
import { isJiraConfigured } from "@/lib/jira"
import {
  ROADMAP_ITEMS,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type RoadmapPriority,
  type RoadmapStatus,
} from "@/lib/roadmap"
import { RoadmapJiraButton } from "@/components/dashboard/roadmap-jira-button"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Competitive Roadmap | RASMISER",
}

// ---------------------------------------------------------------------------
// Styling helpers
// ---------------------------------------------------------------------------

const PRIORITY_STYLES: Record<
  RoadmapPriority,
  { badge: string; dot: string; group: string }
> = {
  critical: {
    badge: "border-red-500/40 bg-red-500/10 text-red-400",
    dot: "bg-red-400",
    group: "Critical gaps",
  },
  important: {
    badge: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
    group: "Important gaps",
  },
  planned: {
    badge: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400",
    group: "Planned features",
  },
}

const STATUS_STYLES: Record<RoadmapStatus, string> = {
  planned: "border-border bg-muted text-muted-foreground",
  "in-progress": "border-amber-500/40 bg-amber-500/10 text-amber-400",
  shipped: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
}

const PRIORITY_ORDER: RoadmapPriority[] = ["critical", "important", "planned"]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RoadmapPage() {
  const jiraConfigured = isJiraConfigured()

  const criticalCount = ROADMAP_ITEMS.filter((i) => i.priority === "critical").length
  const importantCount = ROADMAP_ITEMS.filter((i) => i.priority === "important").length
  const plannedCount = ROADMAP_ITEMS.filter((i) => i.priority === "planned").length

  return (
    <div className="px-6 py-8 md:px-10">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Competitive roadmap
        </h1>
        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
          Features identified in the 2026 MAST competitive analysis against
          Appknox and NowSecure, ranked by enterprise sales impact. Push them
          all to Jira in one click.
        </p>
      </div>

      {/* Summary stats */}
      <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-border bg-border sm:max-w-lg">
        <Stat label="Critical gaps" value={criticalCount} tone="text-red-400" />
        <Stat label="Important" value={importantCount} tone="text-amber-400" />
        <Stat label="Planned" value={plannedCount} tone="text-blue-400" />
      </div>

      {/* Jira push */}
      <div className="mt-8 flex flex-col gap-3 border border-border bg-card p-6">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Push all gaps to Jira
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Creates one Story per item in your configured Jira project.
            Items already pushed are skipped automatically.
          </p>
        </div>
        <RoadmapJiraButton isConfigured={jiraConfigured} />
      </div>

      {/* Roadmap list grouped by priority */}
      <div className="mt-10 flex flex-col gap-10">
        {PRIORITY_ORDER.map((priority) => {
          const items = ROADMAP_ITEMS.filter((i) => i.priority === priority)
          if (items.length === 0) return null
          const styles = PRIORITY_STYLES[priority]

          return (
            <section key={priority}>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {styles.group}
              </h2>

              <div className="flex flex-col gap-px overflow-hidden border border-border bg-border">
                {items.map((item) => (
                  <div key={item.id} className="bg-card px-5 py-5">
                    {/* Row header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          styles.dot,
                        )}
                        aria-hidden="true"
                      />
                      <h3 className="flex-1 text-sm font-medium text-foreground">
                        {item.name}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                          styles.badge,
                        )}
                      >
                        {PRIORITY_LABEL[item.priority]}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                          STATUS_STYLES[item.status],
                        )}
                      >
                        {STATUS_LABEL[item.status]}
                      </span>
                      {item.jiraKey && (
                        <a
                          href={item.jiraUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.jiraKey}
                          <ExternalLink
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    {/* Meta row */}
                    {item.competitorHas.length > 0 && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Already in:{" "}
                        <span className="font-medium text-foreground">
                          {item.competitorHas.join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: string
}) {
  return (
    <div className="bg-card px-5 py-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 font-display text-3xl tracking-tight", tone)}>
        {value}
      </p>
    </div>
  )
}

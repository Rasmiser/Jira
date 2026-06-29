"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  ROADMAP_ITEMS,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type RoadmapPriority,
  type RoadmapItem,
} from "@/lib/roadmap"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

const PRIORITY_STYLES: Record<
  RoadmapPriority,
  { badge: string; dot: string }
> = {
  critical: {
    badge:
      "border-red-500/40 bg-red-500/10 text-red-400",
    dot: "bg-red-400",
  },
  important: {
    badge:
      "border-amber-500/40 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },
  planned: {
    badge:
      "border-blue-500/40 bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400",
  },
}

const GROUPS: { priority: RoadmapPriority; heading: string }[] = [
  { priority: "critical", heading: "Critical gaps" },
  { priority: "important", heading: "Important gaps" },
  { priority: "planned", heading: "Planned features" },
]

function RoadmapCard({ item }: { item: RoadmapItem }) {
  const [open, setOpen] = useState(false)
  const styles = PRIORITY_STYLES[item.priority]

  return (
    <div className="border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent"
        aria-expanded={open}
      >
        <span
          className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", styles.dot)}
          aria-hidden="true"
        />
        <span className="flex-1 text-sm font-medium text-foreground">
          {item.name}
        </span>
        <span
          className={cn(
            "hidden shrink-0 items-center gap-1 border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider sm:inline-flex",
            styles.badge,
          )}
        >
          {PRIORITY_LABEL[item.priority]}
        </span>
        {item.jiraKey && (
          <a
            href={item.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hidden shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            {item.jiraKey}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
        <span className="shrink-0 text-muted-foreground">
          {open ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
      </button>

      {open && (
        <div className="border-t border-border px-5 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>
              Status:{" "}
              <span className="font-medium text-foreground">
                {STATUS_LABEL[item.status]}
              </span>
            </span>
            {item.competitorHas.length > 0 && (
              <span>
                Competitors with this:{" "}
                <span className="font-medium text-foreground">
                  {item.competitorHas.join(", ")}
                </span>
              </span>
            )}
            {item.jiraKey && (
              <a
                href={item.jiraUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-foreground hover:underline sm:hidden"
              >
                {item.jiraKey}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function RoadmapSection() {
  return (
    <div className="mt-16 border-t border-border pt-12">
      <div>
        <h2 className="font-display text-3xl tracking-tight text-foreground">
          Competitive roadmap
        </h2>
        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
          Features identified in the 2026 competitive analysis against Appknox
          and NowSecure. Ranked by enterprise sales impact.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-10">
        {GROUPS.map(({ priority, heading }) => {
          const items = ROADMAP_ITEMS.filter((i) => i.priority === priority)
          if (items.length === 0) return null
          return (
            <section key={priority}>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {heading}
              </h3>
              <div className="flex flex-col gap-px overflow-hidden border border-border">
                {items.map((item) => (
                  <RoadmapCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

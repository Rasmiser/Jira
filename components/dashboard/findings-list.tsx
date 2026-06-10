"use client"

import { useState } from "react"
import { SeverityBadge } from "./severity-badge"
import { FindingFix } from "./finding-fix"
import { ChevronDown, BookOpen, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FindingItem {
  id: string
  title: string
  severity: string
  category: string
  masvs: string | null
  description: string
  remediation: string
  reference: string | null
  aiFixSummary: string | null
  aiFixCode: string | null
  aiFixLanguage: string | null
}

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
}

export function FindingsList({ findings }: { findings: FindingItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  const sorted = [...findings].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99),
  )

  if (findings.length === 0) {
    return (
      <p className="border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
        No findings recorded for this scan.
      </p>
    )
  }

  return (
    <div className="divide-y divide-border border border-border">
      {sorted.map((f) => {
        const open = openId === f.id
        return (
          <div key={f.id}>
            <button
              onClick={() => setOpenId(open ? null : f.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent"
              aria-expanded={open}
            >
              <SeverityBadge severity={f.severity} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{f.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {f.category}
                  {f.masvs ? ` · ${f.masvs}` : ""}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {open && (
              <div className="space-y-5 border-t border-border bg-muted/30 px-5 py-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {f.description}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                    Remediation
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {f.remediation}
                  </p>
                </div>
                {f.reference && (
                  <a
                    href={f.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Reference
                  </a>
                )}
                <FindingFix
                  findingId={f.id}
                  cached={{
                    summary: f.aiFixSummary,
                    code: f.aiFixCode,
                    language: f.aiFixLanguage,
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

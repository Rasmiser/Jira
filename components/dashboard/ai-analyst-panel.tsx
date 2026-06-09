"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { analysisSchema } from "@/lib/ai-analyst"
import { SHIELDS } from "@/lib/shield-engine"
import { Button } from "@/components/ui/button"
import { SeverityBadge, gradeColor } from "@/components/dashboard/severity-badge"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"

const IMPACT_STYLES: Record<string, string> = {
  high: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  medium: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  low: "border-border bg-muted text-muted-foreground",
}

export function AiAnalystPanel({ appId }: { appId: string }) {
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/ai-analysis",
    schema: analysisSchema,
  })

  const hasResult = Boolean(object)

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles
            className="h-4 w-4 text-foreground"
            aria-hidden="true"
          />
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            AI security analyst
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <Button type="button" variant="ghost" size="sm" onClick={() => stop()}>
              Stop
            </Button>
          )}
          <Button
            type="button"
            variant={hasResult ? "secondary" : "default"}
            size="sm"
            onClick={() => submit({ appId })}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : hasResult ? (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
            {isLoading
              ? "Analyzing"
              : hasResult
                ? "Re-analyze"
                : "Generate analysis"}
          </Button>
        </div>
      </div>

      {!hasResult && !isLoading && !error && (
        <div className="mt-4 border border-dashed border-border px-5 py-8 text-center">
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Run an AI assessment of this app&apos;s runtime telemetry. The analyst
            reviews live threat activity, active shields, and compliance gaps to
            produce a prioritized briefing with concrete next steps.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Analysis failed. Please try again.
        </div>
      )}

      {(hasResult || isLoading) && (
        <div className="mt-4 border border-border bg-card">
          {/* Posture header */}
          <div className="flex flex-wrap items-center gap-5 border-b border-border px-5 py-5">
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "font-display text-5xl tracking-tight",
                  gradeColor(object?.postureGrade),
                )}
              >
                {object?.postureGrade ?? "·"}
              </span>
              <span className="text-sm text-muted-foreground">
                {object?.postureScore != null
                  ? `${object.postureScore}/100`
                  : "scoring…"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-pretty font-medium text-foreground">
                {object?.headline ?? "Reviewing runtime telemetry…"}
              </p>
              {object?.summary && (
                <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {object.summary}
                </p>
              )}
            </div>
          </div>

          {/* Key risks */}
          <div className="grid gap-px bg-border md:grid-cols-2">
            <div className="bg-card px-5 py-5">
              <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Key risks
              </h3>
              <ul className="mt-4 flex flex-col gap-4">
                {(object?.keyRisks ?? []).map((risk, i) =>
                  risk ? (
                    <li key={i} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {risk.severity && (
                          <SeverityBadge severity={risk.severity} />
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {risk.title}
                        </span>
                      </div>
                      {risk.detail && (
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {risk.detail}
                        </p>
                      )}
                    </li>
                  ) : null,
                )}
                {isLoading && (object?.keyRisks?.length ?? 0) === 0 && (
                  <li className="text-xs text-muted-foreground">
                    Identifying risks…
                  </li>
                )}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-card px-5 py-5">
              <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Recommendations
              </h3>
              <ul className="mt-4 flex flex-col gap-4">
                {(object?.recommendations ?? []).map((rec, i) => {
                  if (!rec) return null
                  const shield = rec.shieldId
                    ? SHIELDS.find((s) => s.id === rec.shieldId)
                    : null
                  return (
                    <li key={i} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {rec.impact && (
                          <span
                            className={cn(
                              "inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
                              IMPACT_STYLES[rec.impact] ?? IMPACT_STYLES.low,
                            )}
                          >
                            {rec.impact} impact
                          </span>
                        )}
                        {shield && (
                          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            {shield.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">
                        {rec.action}
                      </p>
                    </li>
                  )
                })}
                {isLoading && (object?.recommendations?.length ?? 0) === 0 && (
                  <li className="text-xs text-muted-foreground">
                    Drafting recommendations…
                  </li>
                )}
              </ul>
            </div>
          </div>

          <p className="border-t border-border px-5 py-2 text-[11px] text-muted-foreground">
            Generated by AI from this app&apos;s runtime telemetry. Review before
            acting on regulated workloads.
          </p>
        </div>
      )}
    </div>
  )
}

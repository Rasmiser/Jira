"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { masvsSchema } from "@/lib/masvs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Check,
  X,
  Minus,
  RefreshCw,
} from "lucide-react"

const STATUS_STYLES: Record<string, string> = {
  pass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  partial: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  fail: "border-red-500/40 bg-red-500/10 text-red-400",
  not_applicable: "border-border bg-muted text-muted-foreground",
}

const STATUS_LABEL: Record<string, string> = {
  pass: "Pass",
  partial: "Partial",
  fail: "Fail",
  not_applicable: "N/A",
}

const VERDICT_STYLES: Record<string, string> = {
  compliant: "text-emerald-400",
  partial: "text-yellow-400",
  non_compliant: "text-red-400",
}

const VERDICT_LABEL: Record<string, string> = {
  compliant: "Compliant",
  partial: "Partially compliant",
  non_compliant: "Non-compliant",
}

export function MasvsReportPanel({ scanId }: { scanId: string }) {
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/masvs-report",
    schema: masvsSchema,
  })

  const hasResult = Boolean(object)

  return (
    <section aria-labelledby="masvs-heading" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-foreground" aria-hidden="true" />
          <h2
            id="masvs-heading"
            className="text-sm font-medium uppercase tracking-wider text-muted-foreground"
          >
            OWASP MASVS compliance
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
            disabled={isLoading}
            onClick={() => submit({ scanId })}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : hasResult ? (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            )}
            {isLoading
              ? "Assessing"
              : hasResult
                ? "Re-assess"
                : "Generate report"}
          </Button>
        </div>
      </div>

      {!hasResult && !isLoading && !error && (
        <div className="mt-4 border border-dashed border-border px-5 py-8 text-center">
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Generate an audit-ready OWASP MASVS compliance report. Each control
            category is assessed against this scan&apos;s findings with a
            readiness score and a controls checklist.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Report generation failed. Please try again.
        </div>
      )}

      {(hasResult || isLoading) && (
        <div className="mt-4 border border-border bg-card">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-5 border-b border-border px-5 py-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl tracking-tight text-foreground">
                {object?.overallReadiness != null
                  ? `${Math.round(object.overallReadiness)}%`
                  : "··"}
              </span>
              <span className="text-sm text-muted-foreground">ready</span>
            </div>
            <div className="min-w-0 flex-1">
              {object?.verdict && (
                <p
                  className={cn(
                    "font-display text-xl",
                    VERDICT_STYLES[object.verdict],
                  )}
                >
                  {VERDICT_LABEL[object.verdict]}
                </p>
              )}
              <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {object?.summary ?? "Mapping findings to MASVS controls…"}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {(object?.categories ?? []).map((c, i) =>
              c ? (
                <div key={c.id ?? i} className="bg-card px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {c.name ?? c.id}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {c.id}
                      </p>
                    </div>
                    {c.status && (
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
                          STATUS_STYLES[c.status] ?? STATUS_STYLES.not_applicable,
                        )}
                      >
                        {STATUS_LABEL[c.status] ?? c.status}
                      </span>
                    )}
                  </div>

                  {typeof c.readiness === "number" && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden bg-muted">
                      <div
                        className={cn(
                          "h-full",
                          c.status === "pass"
                            ? "bg-emerald-500"
                            : c.status === "partial"
                              ? "bg-yellow-500"
                              : c.status === "fail"
                                ? "bg-red-500"
                                : "bg-muted-foreground",
                        )}
                        style={{
                          width: `${Math.max(0, Math.min(100, c.readiness))}%`,
                        }}
                      />
                    </div>
                  )}

                  {c.assessment && (
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {c.assessment}
                    </p>
                  )}

                  {Array.isArray(c.controls) && c.controls.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {c.controls.map((ctrl, ci) =>
                        ctrl ? (
                          <li key={ci} className="flex items-start gap-2">
                            {ctrl.met ? (
                              <Check
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                                aria-hidden="true"
                              />
                            ) : (
                              <X
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400"
                                aria-hidden="true"
                              />
                            )}
                            <span className="text-xs leading-relaxed text-foreground">
                              {ctrl.label}
                            </span>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  )}
                </div>
              ) : null,
            )}
            {isLoading && (object?.categories?.length ?? 0) === 0 && (
              <div className="flex items-center gap-2 bg-card px-5 py-6 text-xs text-muted-foreground">
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                Evaluating control categories…
              </div>
            )}
          </div>

          <p className="border-t border-border px-5 py-2 text-[11px] text-muted-foreground">
            AI-generated mapping to OWASP MASVS v2. Review before submitting for
            formal audit.
          </p>
        </div>
      )}
    </section>
  )
}

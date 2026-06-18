import Link from "next/link"
import { notFound } from "next/navigation"
import { getCaseRun } from "@/app/actions/test-cases"
import { RunStatusBadge, PLATFORM_LABEL } from "@/components/dashboard/test-case-badges"
import { formatDuration, type StepResult } from "@/lib/test-case-engine"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Smartphone,
  Clock,
  Layers,
} from "lucide-react"

function formatDateTime(d: Date | string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function CaseRunReportPage({
  params,
}: {
  params: Promise<{ id: string; runId: string }>
}) {
  const { id, runId } = await params
  const run = await getCaseRun(runId)
  if (!run || run.caseId !== id) notFound()

  const stepResults = (Array.isArray(run.stepResults) ? run.stepResults : []) as StepResult[]

  const counts = [
    { label: "Passed", value: run.passedSteps, color: "text-emerald-400" },
    { label: "Failed", value: run.failedSteps, color: "text-red-400" },
    { label: "Duration", value: formatDuration(run.durationMs), color: "text-foreground" },
  ]

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/dashboard/test-cases/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to test case
        </Link>

        {/* Header */}
        <div className="mt-6 border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Device cloud run · {formatDateTime(run.createdAt)}
              </div>
              <h1 className="mt-1 font-display text-3xl tracking-tight text-foreground">
                {run.caseTitle}
              </h1>
            </div>
            <RunStatusBadge status={run.status} className="text-xs" />
          </div>

          <div className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            <Meta icon={Smartphone} label="Device" value={run.deviceName} />
            <Meta
              icon={Layers}
              label="Platform"
              value={`${PLATFORM_LABEL[run.platform] ?? run.platform}${
                run.osVersion ? ` ${run.osVersion}` : ""
              }`}
            />
            <Meta
              icon={Clock}
              label="Steps"
              value={`${run.passedSteps}/${run.totalSteps} passed`}
            />
          </div>
        </div>

        {/* Counts */}
        <div className="mt-px grid grid-cols-3 gap-px overflow-hidden border border-border bg-border">
          {counts.map((s) => (
            <div key={s.label} className="bg-card px-5 py-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className={cn("mt-2 font-display text-2xl", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Step results */}
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Step results
          </h2>
          <div className="mt-4 overflow-hidden border border-border bg-border">
            <div className="grid gap-px">
              {stepResults.map((s) => {
                const passed = s.status === "passed"
                const Icon = passed ? CheckCircle2 : XCircle
                return (
                  <div key={s.index} className="bg-card p-5">
                    <div className="flex items-start gap-3">
                      <Icon
                        className={cn(
                          "mt-0.5 h-5 w-5 shrink-0",
                          passed ? "text-emerald-400" : "text-red-400",
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-foreground">
                            {s.index + 1}. {s.action}
                          </p>
                          <span className="font-mono text-xs text-muted-foreground">
                            {formatDuration(s.durationMs)}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                          {s.target && (
                            <span>
                              <span className="text-muted-foreground/70">Target: </span>
                              {s.target}
                            </span>
                          )}
                          {s.expected && (
                            <span>
                              <span className="text-muted-foreground/70">Expected: </span>
                              {s.expected}
                            </span>
                          )}
                        </div>
                        {!passed && s.note && (
                          <p className="mt-2 border-l-2 border-red-500/40 pl-3 text-sm leading-relaxed text-foreground">
                            {s.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="bg-card px-5 py-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1.5 truncate text-sm text-foreground">{value}</p>
    </div>
  )
}

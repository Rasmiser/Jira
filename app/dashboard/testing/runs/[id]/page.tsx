import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getTestRun,
  getTestChecks,
  getTestTypeMeta,
} from "@/app/actions/testing"
import { CheckStatusBadge } from "@/components/dashboard/check-status-badge"
import { DeleteTestRunButton } from "@/components/dashboard/delete-test-run-button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Calendar, Layers, Target } from "lucide-react"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const PLATFORM_LABEL: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
  cross: "Cross-platform",
}

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-400"
  if (score >= 75) return "text-sky-400"
  if (score >= 60) return "text-yellow-400"
  if (score >= 40) return "text-orange-400"
  return "text-red-400"
}

function scoreStroke(score: number) {
  if (score >= 90) return "oklch(0.75 0.17 155)"
  if (score >= 75) return "oklch(0.70 0.15 230)"
  if (score >= 60) return "oklch(0.80 0.16 90)"
  if (score >= 40) return "oklch(0.70 0.18 50)"
  return "oklch(0.63 0.22 27)"
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference - (clamped / 100) * circumference
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={scoreStroke(clamped)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("font-display text-4xl leading-none", scoreColor(clamped))}>
          {grade}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">{clamped}/100</span>
      </div>
    </div>
  )
}

export default async function TestRunReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const run = await getTestRun(id)
  if (!run) notFound()

  const meta = getTestTypeMeta(run.testType)
  const checks = await getTestChecks(id)

  const counts = [
    { label: "Passed", value: run.passCount, color: "text-emerald-400" },
    { label: "Warnings", value: run.warnCount, color: "text-yellow-400" },
    { label: "Failed", value: run.failCount, color: "text-red-400" },
  ]

  // Group checks by category for readability
  const grouped = new Map<string, typeof checks>()
  for (const c of checks) {
    const arr = grouped.get(c.category) ?? []
    arr.push(c)
    grouped.set(c.category, arr)
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/dashboard/testing/${run.testType}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to {meta?.name ?? "tests"}
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-6 border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <ScoreRing score={run.score ?? 0} grade={run.grade ?? "—"} />
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {meta?.name ?? run.testType} · {PLATFORM_LABEL[run.platform] ?? run.platform} · completed
              </div>
              <h1 className="mt-1 font-display text-4xl tracking-tight text-foreground">
                {run.appName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {run.summary ?? `${checks.length} checks executed`}
              </p>
            </div>
          </div>
          <DeleteTestRunButton runId={run.id} />
        </div>

        {/* Counts */}
        <div className="mt-px grid grid-cols-3 gap-px overflow-hidden border border-border bg-border">
          {counts.map((s) => (
            <div key={s.label} className="bg-card px-5 py-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className={cn("mt-2 font-display text-3xl", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <Meta icon={Layers} label="Platform" value={PLATFORM_LABEL[run.platform] ?? run.platform} />
          <Meta icon={Target} label="Target" value={run.target ?? "—"} />
          <Meta icon={Calendar} label="Run at" value={formatDate(run.completedAt ?? run.createdAt)} />
        </div>

        {/* Checks grouped by category */}
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Test results
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {checks.length} checks across {grouped.size} categories.
          </p>

          <div className="mt-4 space-y-8">
            {Array.from(grouped.entries()).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {category}
                </h3>
                <div className="mt-3 overflow-hidden border border-border bg-border">
                  <div className="grid gap-px">
                    {items.map((c) => (
                      <div key={c.id} className="bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <CheckStatusBadge status={c.status} />
                            <span className="font-medium text-foreground">{c.name}</span>
                          </div>
                          {c.metric ? (
                            <span className="font-mono text-sm text-muted-foreground">
                              {c.metric}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {c.detail}
                        </p>
                        {c.status !== "pass" && c.recommendation ? (
                          <p className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground">
                            <span className="text-muted-foreground">Recommendation: </span>
                            {c.recommendation}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
      <p className="mt-1.5 truncate font-mono text-sm text-foreground">{value}</p>
    </div>
  )
}

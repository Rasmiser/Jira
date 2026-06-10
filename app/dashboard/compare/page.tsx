import Link from "next/link"
import { getScans, getComparison } from "@/app/actions/scans"
import { diffFindings, summarizeComparison } from "@/lib/scan-diff"
import { CompareSelector } from "@/components/dashboard/compare-selector"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  GitCompareArrows,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  CircleDot,
} from "lucide-react"

function formatDate(d: Date | string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ base?: string; target?: string }>
}) {
  const { base: baseId, target: targetId } = await searchParams
  const scans = await getScans()

  const selectorScans = scans.map((s) => ({
    id: s.id,
    appName: s.appName,
    versionName: s.versionName,
    packageName: s.packageName,
    createdAt: s.createdAt,
  }))

  const hasSelection = Boolean(baseId && targetId)

  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to overview
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <GitCompareArrows className="h-6 w-6 text-foreground" aria-hidden="true" />
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Compare versions
        </h1>
      </div>
      <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
        See what changed between two scans — which issues were fixed, which were
        introduced, and how the security score moved.
      </p>

      <div className="mt-8">
        <CompareSelector
          scans={selectorScans}
          baseId={baseId}
          targetId={targetId}
        />
      </div>

      {!hasSelection ? (
        <div className="mt-10 flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
          <GitCompareArrows
            className="h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Choose a baseline scan and a newer scan above to generate a
            version-to-version diff.
          </p>
        </div>
      ) : (
        <ComparisonResult baseId={baseId!} targetId={targetId!} />
      )}
    </div>
  )
}

async function ComparisonResult({
  baseId,
  targetId,
}: {
  baseId: string
  targetId: string
}) {
  const { base, target, baseFindings, targetFindings } = await getComparison(
    baseId,
    targetId,
  )

  if (!base || !target) {
    return (
      <div className="mt-10 border border-orange-500/40 bg-orange-500/10 px-5 py-4 text-sm text-foreground">
        One or both of the selected scans could not be found.
      </div>
    )
  }

  if (base.id === target.id) {
    return (
      <div className="mt-10 border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
        Select two different scans to compare.
      </div>
    )
  }

  const rows = diffFindings(baseFindings, targetFindings)
  const summary = summarizeComparison(base, target, rows)

  const statusMeta = {
    fixed: {
      label: "Fixed",
      icon: CheckCircle2,
      tone: "text-emerald-400",
      ring: "border-emerald-500/40 bg-emerald-500/10",
    },
    new: {
      label: "Introduced",
      icon: AlertCircle,
      tone: "text-red-400",
      ring: "border-red-500/40 bg-red-500/10",
    },
    unchanged: {
      label: "Unchanged",
      icon: CircleDot,
      tone: "text-muted-foreground",
      ring: "border-border bg-muted",
    },
  } as const

  return (
    <div className="mt-10">
      {/* Version headers */}
      <div className="grid items-stretch gap-px overflow-hidden border border-border bg-border sm:grid-cols-[1fr_auto_1fr]">
        <VersionCard label="Baseline" scan={base} />
        <div className="flex items-center justify-center bg-card px-4">
          <ArrowRight
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <VersionCard label="Compared" scan={target} />
      </div>

      {/* Score delta */}
      <div className="mt-px grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
        <DeltaStat
          label="Security score"
          value={`${summary.targetScore}/100`}
          delta={summary.scoreDelta}
          improved={summary.improved}
        />
        <CountStat
          label="Issues fixed"
          value={summary.fixed}
          tone="text-emerald-400"
        />
        <CountStat
          label="Issues introduced"
          value={summary.introduced}
          tone={summary.introduced > 0 ? "text-red-400" : "text-foreground"}
        />
        <CountStat
          label="Unchanged"
          value={summary.unchanged}
          tone="text-foreground"
        />
      </div>

      {/* Summary line */}
      <div
        className={cn(
          "mt-6 flex items-center gap-3 border px-5 py-4",
          summary.improved
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-red-500/40 bg-red-500/10",
        )}
      >
        {summary.improved ? (
          <TrendingUp className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-400" aria-hidden="true" />
        )}
        <p className="text-sm text-foreground">
          {summary.improved
            ? `Security posture improved by ${summary.scoreDelta} point${
                Math.abs(summary.scoreDelta) === 1 ? "" : "s"
              } (grade ${summary.baseGrade} → ${summary.targetGrade}).`
            : `Security posture declined by ${Math.abs(
                summary.scoreDelta,
              )} point${
                Math.abs(summary.scoreDelta) === 1 ? "" : "s"
              } (grade ${summary.baseGrade} → ${summary.targetGrade}).`}
        </p>
      </div>

      {/* Diff list */}
      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Finding changes
        </h2>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Neither scan reported any findings.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {rows.map((row) => {
              const meta = statusMeta[row.status]
              const Icon = meta.icon
              return (
                <div
                  key={`${row.status}-${row.key}`}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 text-[10px] font-medium uppercase tracking-wider",
                      meta.ring,
                      meta.tone,
                    )}
                  >
                    <Icon className="h-3 w-3" aria-hidden="true" />
                    {meta.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm",
                        row.status === "fixed"
                          ? "text-muted-foreground line-through"
                          : "text-foreground",
                      )}
                    >
                      {row.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {row.category}
                    </p>
                  </div>
                  <SeverityBadge severity={row.severity} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function VersionCard({
  label,
  scan,
}: {
  label: string
  scan: {
    appName: string
    versionName: string | null
    createdAt: Date
    completedAt: Date | null
  }
}) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 truncate font-display text-xl tracking-tight text-foreground">
        {scan.appName}
      </p>
      <p className="mt-1 font-mono text-sm text-muted-foreground">
        {scan.versionName ?? "unknown version"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Scanned {formatDate(scan.completedAt ?? scan.createdAt)}
      </p>
    </div>
  )
}

function DeltaStat({
  label,
  value,
  delta,
  improved,
}: {
  label: string
  value: string
  delta: number
  improved: boolean
}) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight text-foreground">
        {value}
      </p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 text-xs",
          delta === 0
            ? "text-muted-foreground"
            : improved
              ? "text-emerald-400"
              : "text-red-400",
        )}
      >
        {delta > 0 ? `+${delta}` : delta} vs baseline
      </p>
    </div>
  )
}

function CountStat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: string
}) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 font-display text-3xl tracking-tight", tone)}>
        {value}
      </p>
    </div>
  )
}

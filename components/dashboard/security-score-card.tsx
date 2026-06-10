import { cn } from "@/lib/utils"
import {
  toSecurityScore,
  severityRiskBreakdown,
  type SeverityCounts,
} from "@/lib/security-score"
import { ShieldCheck } from "lucide-react"

const TONE_TEXT: Record<string, string> = {
  emerald: "text-emerald-400",
  lime: "text-lime-400",
  yellow: "text-yellow-400",
  orange: "text-orange-400",
  red: "text-red-400",
}

const TONE_STROKE: Record<string, string> = {
  emerald: "oklch(0.75 0.17 155)",
  lime: "oklch(0.80 0.16 130)",
  yellow: "oklch(0.80 0.16 90)",
  orange: "oklch(0.70 0.18 50)",
  red: "oklch(0.63 0.22 27)",
}

const SEGMENT_BG: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-sky-500",
}

const SEGMENT_LABEL: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
}

export function SecurityScoreCard({
  riskScore,
  counts,
}: {
  riskScore: number | null | undefined
  counts: SeverityCounts
}) {
  const security = toSecurityScore(riskScore)
  const breakdown = severityRiskBreakdown(counts)
  const hasFindings = breakdown.some((s) => s.count > 0)

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (security.score / 100) * circumference

  return (
    <section
      aria-labelledby="exec-score-heading"
      className="mt-px border border-border bg-card"
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <ShieldCheck className="h-4 w-4 text-foreground" aria-hidden="true" />
        <h2
          id="exec-score-heading"
          className="text-sm font-medium uppercase tracking-wider text-muted-foreground"
        >
          Executive security score
        </h2>
      </div>

      <div className="flex flex-col gap-8 px-5 py-6 sm:flex-row sm:items-center">
        {/* Gauge */}
        <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
          <svg className="h-36 w-36 -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={TONE_STROKE[security.tone]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span
              className={cn(
                "font-display text-5xl leading-none",
                TONE_TEXT[security.tone],
              )}
            >
              {security.grade}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              {security.score}/100
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="min-w-0 flex-1">
          <p className={cn("font-display text-2xl", TONE_TEXT[security.tone])}>
            {security.label}
          </p>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
            A higher score means lower risk. This grade weights findings by
            severity, so a single critical issue carries far more weight than
            several low-severity ones.
          </p>

          {/* Risk contribution bar */}
          <div className="mt-5">
            <div className="flex h-2.5 w-full overflow-hidden border border-border bg-muted">
              {hasFindings ? (
                breakdown.map((s) =>
                  s.share > 0 ? (
                    <div
                      key={s.key}
                      className={SEGMENT_BG[s.key]}
                      style={{ width: `${Math.round(s.share * 100)}%` }}
                      aria-hidden="true"
                    />
                  ) : null,
                )
              ) : (
                <div className="w-full bg-emerald-500" aria-hidden="true" />
              )}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {breakdown.map((s) => (
                <li key={s.key} className="flex items-center gap-2">
                  <span
                    className={cn("h-2.5 w-2.5", SEGMENT_BG[s.key])}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-muted-foreground">
                    {SEGMENT_LABEL[s.key]}
                    <span className="ml-1 font-medium text-foreground">
                      {s.count}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

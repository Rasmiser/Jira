import { cn } from "@/lib/utils"
import { gradeColor } from "./severity-badge"

export function RiskGauge({
  score,
  grade,
}: {
  score: number
  grade: string
}) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference - (clamped / 100) * circumference

  // Lower score = safer (green), higher = riskier (red)
  const strokeColor =
    clamped >= 80
      ? "oklch(0.63 0.22 27)"
      : clamped >= 60
        ? "oklch(0.70 0.18 50)"
        : clamped >= 40
          ? "oklch(0.80 0.16 90)"
          : clamped >= 20
            ? "oklch(0.80 0.16 130)"
            : "oklch(0.75 0.17 155)"

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
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
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("font-display text-4xl leading-none", gradeColor(grade))}>
          {grade}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">{score}/100 risk</span>
      </div>
    </div>
  )
}

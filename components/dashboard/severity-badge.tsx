import { cn } from "@/lib/utils"

const SEVERITY_STYLES: Record<string, string> = {
  critical: "border-red-500/40 bg-red-500/10 text-red-400",
  high: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  medium: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  low: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  info: "border-border bg-muted text-muted-foreground",
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.info,
        className,
      )}
    >
      {severity}
    </span>
  )
}

const GRADE_COLOR: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
}

export function gradeColor(grade: string | null | undefined) {
  if (!grade) return "text-muted-foreground"
  return GRADE_COLOR[grade] ?? "text-muted-foreground"
}

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const BADGE_STYLES = {
  ink: "signal-icon-box",
  sky: "bg-sky-500/15 text-sky-400 border border-sky-500/35 shadow-[0_0_16px_-2px_rgba(56,189,248,0.35)]",
  emerald:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 shadow-[0_0_16px_-2px_rgba(16,185,129,0.35)]",
  rose: "bg-rose-500/15 text-rose-400 border border-rose-500/35 shadow-[0_0_16px_-2px_rgba(244,63,94,0.35)]",
} as const

export function StatCard({
  icon: Icon,
  color,
  label,
  value,
  trendValue,
  trendLabel,
  trendTone = "positive",
}: {
  icon: LucideIcon
  color: keyof typeof BADGE_STYLES
  label: string
  value: string
  trendValue: string
  trendLabel: string
  trendTone?: "positive" | "neutral"
}) {
  return (
    <div className="signal-card px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center",
            BADGE_STYLES[color],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-display text-3xl tracking-tight text-foreground">
            {value}
          </p>
        </div>
      </div>
      <div className="signal-divider mt-4 border-t pt-3 text-xs text-muted-foreground">
        {trendTone === "positive" ? (
          <span className="font-medium text-emerald-400">{trendValue}</span>
        ) : (
          <span className="font-medium text-foreground">{trendValue}</span>
        )}{" "}
        {trendLabel}
      </div>
    </div>
  )
}

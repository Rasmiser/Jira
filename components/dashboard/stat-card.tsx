import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const BADGE_STYLES = {
  ink: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  rose: "bg-rose-500 text-white",
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
    <div className="border border-border bg-card px-5 py-5">
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
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl tracking-tight text-foreground">
            {value}
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
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

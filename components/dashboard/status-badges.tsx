import { cn } from "@/lib/utils"

const RISK_STYLES: Record<string, string> = {
  critical: "border-red-500/40 bg-red-500/10 text-red-400",
  high: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  medium: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  low: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
}

export function RiskBadge({
  risk,
  className,
}: {
  risk: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        RISK_STYLES[risk] ?? RISK_STYLES.low,
        className,
      )}
    >
      {risk} risk
    </span>
  )
}

const STATUS_STYLES: Record<string, string> = {
  protected: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  building: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  paused: "border-border bg-muted text-muted-foreground",
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        STATUS_STYLES[status] ?? STATUS_STYLES.paused,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "protected"
            ? "bg-emerald-400"
            : status === "building"
              ? "bg-sky-400"
              : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {status}
    </span>
  )
}

const ACTION_STYLES: Record<string, string> = {
  terminated: "border-red-500/40 bg-red-500/10 text-red-400",
  blocked: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  flagged: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  allowed: "border-border bg-muted text-muted-foreground",
}

export function ActionBadge({
  action,
  className,
}: {
  action: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        ACTION_STYLES[action] ?? ACTION_STYLES.allowed,
        className,
      )}
    >
      {action}
    </span>
  )
}

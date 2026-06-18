import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Apple,
  Globe,
  Layers,
  type LucideIcon,
} from "lucide-react"

const PRIORITY_STYLES: Record<string, string> = {
  critical: "border-red-500/40 bg-red-500/10 text-red-400",
  high: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  medium: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  low: "border-border bg-muted text-muted-foreground",
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.low,
      )}
    >
      {priority}
    </span>
  )
}

const STATUS_STYLES: Record<string, string> = {
  ready: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  draft: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  archived: "border-border bg-muted text-muted-foreground",
}

export function CaseStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        STATUS_STYLES[status] ?? STATUS_STYLES.draft,
      )}
    >
      {status}
    </span>
  )
}

const RUN_STYLES: Record<string, string> = {
  passed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  failed: "border-red-500/40 bg-red-500/10 text-red-400",
  flaky: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
}

const RUN_ICON: Record<string, LucideIcon> = {
  passed: CheckCircle2,
  failed: XCircle,
  flaky: AlertTriangle,
}

export function RunStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const Icon = RUN_ICON[status] ?? CheckCircle2
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        RUN_STYLES[status] ?? RUN_STYLES.passed,
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {status}
    </span>
  )
}

const PLATFORM_ICON: Record<string, LucideIcon> = {
  android: Smartphone,
  ios: Apple,
  web: Globe,
  cross: Layers,
}

export function platformIcon(platform: string): LucideIcon {
  return PLATFORM_ICON[platform] ?? Layers
}

export const PLATFORM_LABEL: Record<string, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
  cross: "Cross-platform",
}

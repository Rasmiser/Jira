import { cn } from "@/lib/utils"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

const STATUS_STYLES: Record<string, string> = {
  pass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  warn: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  fail: "border-red-500/40 bg-red-500/10 text-red-400",
}

const STATUS_LABEL: Record<string, string> = {
  pass: "Pass",
  warn: "Warning",
  fail: "Fail",
}

const STATUS_ICON = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
} as const

export function CheckStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const Icon = STATUS_ICON[status as keyof typeof STATUS_ICON] ?? CheckCircle2
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        STATUS_STYLES[status] ?? STATUS_STYLES.pass,
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

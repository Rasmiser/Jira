import Link from "next/link"
import { GitMerge, CreditCard, CheckCircle2, XCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceStatus {
  name: string
  description: string
  icon: LucideIcon
  connected: boolean
  href: string
}

export function ConnectedServices({
  jiraConfigured,
  stripeConfigured,
}: {
  jiraConfigured: boolean
  stripeConfigured: boolean
}) {
  const services: ServiceStatus[] = [
    {
      name: "Jira",
      description: "Sync findings to tracked issues",
      icon: GitMerge,
      connected: jiraConfigured,
      href: "/dashboard/integrations",
    },
    {
      name: "Stripe",
      description: "Plan billing & payments",
      icon: CreditCard,
      connected: stripeConfigured,
      href: "/dashboard/billing",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => (
        <Link
          key={service.name}
          href={service.href}
          className="flex items-center gap-4 border border-border bg-card px-5 py-4 transition-colors hover:bg-accent"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-muted text-foreground">
            <service.icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground">{service.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {service.description}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 text-[10px] font-medium uppercase tracking-wider",
              service.connected
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {service.connected ? (
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            ) : (
              <XCircle className="h-3 w-3" aria-hidden="true" />
            )}
            {service.connected ? "Connected" : "Connect"}
          </span>
        </Link>
      ))}
    </div>
  )
}

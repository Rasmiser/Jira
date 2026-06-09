import Link from "next/link"
import { notFound } from "next/navigation"
import { getProtectedApp, getThreatEvents } from "@/app/actions/protection"
import { SHIELDS, THREAT_META, type ThreatType } from "@/lib/shield-engine"
import { RiskBadge, StatusBadge, ActionBadge } from "@/components/dashboard/status-badges"
import { SimulateButton } from "@/components/dashboard/simulate-button"
import { AppControls } from "@/components/dashboard/app-controls"
import { ShieldPicker } from "@/components/dashboard/shield-picker"
import { updateAppShields } from "@/app/actions/protection"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Smartphone,
  Apple,
  ArrowLeft,
  ShieldCheck,
  ShieldOff,
  Save,
} from "lucide-react"

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n)
}

function timeAgo(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function ProtectedAppPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const app = await getProtectedApp(id)
  if (!app) notFound()

  const events = await getThreatEvents({ appId: id, limit: 15 })
  const shields = Array.isArray(app.shields) ? (app.shields as string[]) : []
  const enabledShields = SHIELDS.filter((s) => shields.includes(s.id))
  const disabledShields = SHIELDS.filter((s) => !shields.includes(s.id))

  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/dashboard/protection"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Protection
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground">
            {app.platform === "ios" ? (
              <Apple className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Smartphone className="h-6 w-6" aria-hidden="true" />
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl tracking-tight text-foreground">
              {app.appName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {app.packageName ?? "—"}
              {app.versionName ? ` · v${app.versionName}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SimulateButton />
          <AppControls id={app.id} status={app.status} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={app.status} />
        <RiskBadge risk={app.riskLevel} />
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Attacks blocked"
          value={formatNumber(app.attacksBlocked)}
          sub="all time"
        />
        <Stat
          label="Protected installs"
          value={formatNumber(app.installCount)}
          sub="active devices"
        />
        <Stat label="Active shields" value={`${shields.length}`} sub="enabled" />
        <Stat
          label="Protection level"
          value={app.protectionLevel}
          sub="tier"
          capitalize
        />
      </div>

      {/* Active shields */}
      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Active shields
        </h2>
        <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {enabledShields.map((shield) => (
            <div key={shield.id} className="flex gap-3 bg-card px-4 py-4">
              <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-foreground">{shield.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {shield.description}
                </p>
              </div>
            </div>
          ))}
          {disabledShields.map((shield) => (
            <div
              key={shield.id}
              className="flex gap-3 bg-card px-4 py-4 opacity-50"
            >
              <ShieldOff
                className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-foreground">{shield.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Not enabled
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent threats for this app */}
      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Recent activity
        </h2>
        {events.length === 0 ? (
          <p className="mt-4 border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
            No threat events recorded yet. Use &ldquo;Simulate live traffic&rdquo;
            to generate activity.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {events.map((e) => {
              const meta = THREAT_META[e.threatType as ThreatType]
              return (
                <div key={e.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {meta?.label ?? e.threatType}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.deviceModel} · {e.country} · {timeAgo(e.createdAt)}
                    </p>
                  </div>
                  <ActionBadge action={e.action} />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit shields */}
      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Configure protection
        </h2>
        <form action={updateAppShields} className="mt-4">
          <input type="hidden" name="id" value={app.id} />
          <ShieldPicker
            defaultLevel={app.protectionLevel as "standard" | "advanced" | "maximum"}
            defaultShields={shields}
          />
          <div className="mt-6">
            <Button type="submit" variant="secondary">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
  capitalize,
}: {
  label: string
  value: string
  sub: string
  capitalize?: boolean
}) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl tracking-tight text-foreground",
          capitalize && "capitalize",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

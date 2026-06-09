import Link from "next/link"
import { getThreatEvents, getThreatStats } from "@/app/actions/protection"
import { getProtectedApps } from "@/app/actions/protection"
import { THREAT_META, type ThreatType } from "@/lib/shield-engine"
import { ActionBadge } from "@/components/dashboard/status-badges"
import { SeverityBadge } from "@/components/dashboard/severity-badge"
import { LiveControls } from "@/components/dashboard/live-controls"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Radar, Smartphone, Apple, ShieldPlus } from "lucide-react"

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n)
}

function timeAgo(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime()
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function ThreatsPage() {
  const [stats, events, apps] = await Promise.all([
    getThreatStats(),
    getThreatEvents({ limit: 40 }),
    getProtectedApps(),
  ])

  const hasApps = apps.length > 0
  const blockRate =
    stats.totalEvents > 0
      ? Math.round((stats.blocked / stats.totalEvents) * 100)
      : 100
  const maxTypeCount = Math.max(1, ...stats.byType.map((t) => t.count))

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-4xl tracking-tight text-foreground">
              Live threats
            </h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Real-time runtime attacks detected and blocked across your protected
            apps.
          </p>
        </div>
        {hasApps && <LiveControls />}
      </div>

      {!hasApps ? (
        <div className="mt-8 flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
          <Radar
            className="h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
            No protected apps to monitor
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Threat monitoring activates once you apply runtime protection to an
            app.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/protection/new">
              <ShieldPlus className="h-4 w-4" aria-hidden="true" />
              Protect an app
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Events (24h)"
              value={formatNumber(stats.last24h)}
              sub="last 24 hours"
            />
            <Stat
              label="Attacks blocked"
              value={formatNumber(stats.blocked)}
              sub="all time"
            />
            <Stat
              label="Block rate"
              value={`${blockRate}%`}
              sub="threats stopped"
            />
            <Stat
              label="Total events"
              value={formatNumber(stats.totalEvents)}
              sub="all time"
            />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            {/* Threat breakdown */}
            <div className="lg:col-span-2">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Top threats (24h)
              </h2>
              <div className="mt-4 border border-border bg-card p-5">
                {stats.byType.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No events in the last 24 hours.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {stats.byType.map((t) => {
                      const meta = THREAT_META[t.threatType as ThreatType]
                      return (
                        <li key={t.threatType}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground">
                              {meta?.label ?? t.threatType}
                            </span>
                            <span className="tabular-nums text-muted-foreground">
                              {formatNumber(t.count)}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden bg-muted">
                            <div
                              className={cn(
                                "h-full",
                                meta?.severity === "critical"
                                  ? "bg-red-500"
                                  : meta?.severity === "high"
                                    ? "bg-orange-500"
                                    : meta?.severity === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-sky-500",
                              )}
                              style={{
                                width: `${(t.count / maxTypeCount) * 100}%`,
                              }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* Severity split */}
              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
                {(["critical", "high", "medium", "low"] as const).map((sev) => (
                  <div key={sev} className="bg-card px-4 py-3">
                    <p className="font-display text-2xl tracking-tight text-foreground">
                      {formatNumber(stats.bySeverity[sev] ?? 0)}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {sev}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live event feed */}
            <div className="lg:col-span-3">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Event stream
              </h2>
              {events.length === 0 ? (
                <p className="mt-4 border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
                  No events yet. Toggle live mode to start streaming.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-border border border-border">
                  {events.map((e) => {
                    const meta = THREAT_META[e.threatType as ThreatType]
                    return (
                      <div
                        key={e.id}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground">
                          {e.platform === "ios" ? (
                            <Apple className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Smartphone className="h-4 w-4" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <span className="truncate">
                              {meta?.label ?? e.threatType}
                            </span>
                            <SeverityBadge severity={e.severity} />
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {e.appName} · {e.deviceModel} · {e.country} ·{" "}
                            {timeAgo(e.createdAt)}
                          </p>
                        </div>
                        <ActionBadge action={e.action} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

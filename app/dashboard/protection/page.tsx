import Link from "next/link"
import { getProtectedApps } from "@/app/actions/protection"
import { Button } from "@/components/ui/button"
import { RiskBadge, StatusBadge } from "@/components/dashboard/status-badges"
import { SimulateButton } from "@/components/dashboard/simulate-button"
import {
  ShieldHalf,
  ShieldPlus,
  Smartphone,
  Apple,
  ArrowRight,
} from "lucide-react"

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n)
}

export default async function ProtectionPage() {
  const apps = await getProtectedApps()

  const totalBlocked = apps.reduce((s, a) => s + a.attacksBlocked, 0)
  const totalInstalls = apps.reduce((s, a) => s + a.installCount, 0)
  const atRisk = apps.filter(
    (a) => a.riskLevel === "high" || a.riskLevel === "critical",
  ).length

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-foreground">
            Protection
          </h1>
          <p className="mt-1 text-muted-foreground">
            No-code runtime application self-protection (RASP) for your shipped
            apps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {apps.length > 0 && <SimulateButton />}
          <Button asChild>
            <Link href="/dashboard/protection/new">
              <ShieldPlus className="h-4 w-4" aria-hidden="true" />
              Protect app
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Protected apps" value={`${apps.length}`} sub="shielded" />
        <Stat
          label="Attacks blocked"
          value={formatNumber(totalBlocked)}
          sub="all time"
        />
        <Stat
          label="Protected installs"
          value={formatNumber(totalInstalls)}
          sub="across devices"
        />
        <Stat
          label="Apps at risk"
          value={`${atRisk}`}
          sub="elevated threat"
          danger={atRisk > 0}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Shielded apps
        </h2>

        {apps.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
            <ShieldHalf
              className="h-10 w-10 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
              No protected apps yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Apply anti-tampering, anti-hooking, and runtime threat detection to
              an app in minutes — no SDK or code changes required.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/protection/new">Protect your first app</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {apps.map((app) => {
              const shieldCount = Array.isArray(app.shields)
                ? (app.shields as string[]).length
                : 0
              return (
                <Link
                  key={app.id}
                  href={`/dashboard/protection/${app.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground">
                    {app.platform === "ios" ? (
                      <Apple className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Smartphone className="h-5 w-5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {app.appName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {app.versionName ? `v${app.versionName} · ` : ""}
                      {shieldCount} shields · {formatNumber(app.attacksBlocked)}{" "}
                      blocked
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <StatusBadge status={app.status} />
                    <RiskBadge risk={app.riskLevel} />
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
  danger,
}: {
  label: string
  value: string
  sub: string
  danger?: boolean
}) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={
          "mt-2 font-display text-3xl tracking-tight " +
          (danger ? "text-red-400" : "text-foreground")
        }
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

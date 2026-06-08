import Link from "next/link"
import { getScans } from "@/app/actions/scans"
import { getUserId, getUsage } from "@/lib/subscription"
import { Button } from "@/components/ui/button"
import { SeverityBadge, gradeColor } from "@/components/dashboard/severity-badge"
import { cn } from "@/lib/utils"
import {
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Apple,
} from "lucide-react"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function DashboardPage() {
  const userId = await getUserId()
  const [scans, usage] = await Promise.all([getScans(), getUsage(userId)])

  const totalFindings = scans.reduce(
    (sum, s) => sum + s.criticalCount + s.highCount + s.mediumCount + s.lowCount,
    0,
  )
  const criticalTotal = scans.reduce((sum, s) => sum + s.criticalCount, 0)

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-foreground">
            Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor your mobile app security posture.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/scan/new">
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            New scan
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Scans this month"
          value={
            usage.limit === null
              ? `${usage.used}`
              : `${usage.used} / ${usage.limit}`
          }
          sub={`${usage.plan.name} plan`}
        />
        <Stat label="Total scans" value={`${scans.length}`} sub="all time" />
        <Stat
          label="Total findings"
          value={`${totalFindings}`}
          sub="across all scans"
        />
        <Stat
          label="Critical issues"
          value={`${criticalTotal}`}
          sub="need attention"
          danger={criticalTotal > 0}
        />
      </div>

      {/* Usage warning */}
      {!usage.canScan && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-orange-500/40 bg-orange-500/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-orange-400" aria-hidden="true" />
            <p className="text-sm text-foreground">
              You&apos;ve used all {usage.limit} scans on the {usage.plan.name}{" "}
              plan this month.
            </p>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/billing">Upgrade plan</Link>
          </Button>
        </div>
      )}

      {/* Recent scans */}
      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Recent scans
        </h2>

        {scans.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
            <ShieldCheck
              className="h-10 w-10 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
              No scans yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Upload your first APK or IPA to get a full security report in
              minutes.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/scan/new">Run your first scan</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {scans.map((scan) => (
              <Link
                key={scan.id}
                href={`/dashboard/scans/${scan.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground">
                  {scan.platform === "ios" ? (
                    <Apple className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Smartphone className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {scan.appName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {scan.packageName} · {formatDate(scan.createdAt)}
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {scan.criticalCount > 0 && (
                    <SeverityBadge severity="critical" />
                  )}
                  {scan.highCount > 0 && <SeverityBadge severity="high" />}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-display text-2xl leading-none",
                        gradeColor(scan.grade),
                      )}
                    >
                      {scan.grade}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      grade
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
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
        className={cn(
          "mt-2 font-display text-3xl tracking-tight",
          danger ? "text-red-400" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

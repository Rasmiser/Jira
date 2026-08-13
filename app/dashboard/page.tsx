import Link from "next/link"
import { format } from "date-fns"
import { getScans } from "@/app/actions/scans"
import {
  getProtectedApps,
  getThreatStats,
  getThreatEvents,
} from "@/app/actions/protection"
import { getUserId, getUsage } from "@/lib/subscription"
import { isJiraConfigured } from "@/lib/jira"
import { isStripeConfigured } from "@/lib/stripe"
import { Button } from "@/components/ui/button"
import { SeverityBadge, gradeColor } from "@/components/dashboard/severity-badge"
import { RiskBadge } from "@/components/dashboard/status-badges"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartPreviewCard, type ChartPoint } from "@/components/dashboard/chart-preview-card"
import { QuickAccessGrid } from "@/components/dashboard/quick-access-grid"
import { ConnectedServices } from "@/components/dashboard/connected-services"
import { cn } from "@/lib/utils"
import {
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  FileSearch,
  Radar,
  ArrowRight,
  Smartphone,
  Apple,
  GitCompareArrows,
} from "lucide-react"

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n)
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function DashboardPage() {
  const userId = await getUserId()
  const [scans, usage, protectedApps, threatStats, recentThreatEvents] =
    await Promise.all([
      getScans(),
      getUsage(userId),
      getProtectedApps(),
      getThreatStats(),
      getThreatEvents({ limit: 60 }),
    ])

  const totalFindings = scans.reduce(
    (sum, s) => sum + s.criticalCount + s.highCount + s.mediumCount + s.lowCount,
    0,
  )
  const criticalTotal = scans.reduce((sum, s) => sum + s.criticalCount, 0)
  const totalBlocked = protectedApps.reduce((s, a) => s + a.attacksBlocked, 0)
  const jiraConfigured = isJiraConfigured()
  const stripeConfigured = isStripeConfigured()

  // --- Chart data --------------------------------------------------------
  const recentScansAsc = [...scans]
    .slice(0, 7)
    .reverse()

  const findingsChart: ChartPoint[] =
    recentScansAsc.length > 0
      ? recentScansAsc.map((s) => ({
          label: format(new Date(s.createdAt), "EEEEE"),
          value: s.criticalCount + s.highCount + s.mediumCount + s.lowCount,
        }))
      : ["M", "T", "W", "T", "F", "S", "S"].map((label) => ({ label, value: 0 }))

  const riskChart: ChartPoint[] =
    recentScansAsc.length > 0
      ? recentScansAsc.map((s) => ({
          label: format(new Date(s.createdAt), "MMM"),
          value: s.riskScore ?? 0,
        }))
      : ["Apr", "Jun", "Aug", "Oct", "Dec"].map((label) => ({ label, value: 0 }))

  const threatsByDay = new Map<string, number>()
  for (const event of recentThreatEvents) {
    const key = format(new Date(event.createdAt), "MMM")
    threatsByDay.set(
      key,
      (threatsByDay.get(key) ?? 0) +
        (event.action === "blocked" || event.action === "terminated" ? 1 : 0),
    )
  }
  const threatsChart: ChartPoint[] =
    threatsByDay.size > 0
      ? Array.from(threatsByDay.entries()).map(([label, value]) => ({ label, value }))
      : ["Apr", "Jun", "Aug", "Oct", "Dec"].map((label) => ({ label, value: 0 }))

  return (
    <div className="relative px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs">
            <span className="signal-pulse-dot" aria-hidden="true" />
            <span className="signal-eyebrow">System online</span>
          </div>
          <h1 className="signal-heading-glow font-display text-4xl tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor your mobile app security posture.
          </p>
        </div>
        <Button asChild className="signal-btn">
          <Link href="/dashboard/scan/new">
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            New scan
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ScanLine}
          color="ink"
          label="Scans this month"
          value={usage.limit === null ? `${usage.used}` : `${usage.used} / ${usage.limit}`}
          trendValue={usage.plan.name}
          trendLabel="plan"
        />
        <StatCard
          icon={FileSearch}
          color="sky"
          label="Total findings"
          value={`${totalFindings}`}
          trendValue={`${criticalTotal}`}
          trendLabel="critical need attention"
          trendTone={criticalTotal > 0 ? "neutral" : "positive"}
        />
        <StatCard
          icon={ShieldCheck}
          color="emerald"
          label="Attacks blocked"
          value={formatNumber(totalBlocked)}
          trendValue={`${protectedApps.length}`}
          trendLabel="protected apps"
        />
        <StatCard
          icon={Radar}
          color="rose"
          label="Threats (24h)"
          value={formatNumber(threatStats.last24h)}
          trendValue="Live"
          trendLabel="monitoring active"
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

      {/* Chart previews */}
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <ChartPreviewCard
          variant="bar"
          accent="sky"
          data={findingsChart}
          title="Scan Findings"
          subtitle="Findings per recent scan"
          meta={
            scans[0]
              ? `last scan ${formatDate(scans[0].createdAt)}`
              : "no scans yet"
          }
        />
        <ChartPreviewCard
          variant="line"
          accent="emerald"
          data={riskChart}
          title="Risk Score"
          subtitle="Security score over recent scans"
          meta={scans.length > 0 ? `${scans.length} scans tracked` : "no scans yet"}
        />
        <ChartPreviewCard
          variant="line"
          accent="ink"
          data={threatsChart}
          title="Attacks Blocked"
          subtitle="Runtime threats stopped over time"
          meta={
            threatStats.totalEvents > 0
              ? `${formatNumber(threatStats.blocked)} blocked total`
              : "no activity yet"
          }
        />
      </div>

      {/* Quick access */}
      <div className="mt-10">
        <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-[oklch(0.78_0.15_195)]">
          Quick access
        </h2>
        <div className="mt-4">
          <QuickAccessGrid currentPlan={usage.plan.id} />
        </div>
      </div>

      {/* Connected services */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-[oklch(0.78_0.15_195)]">
            Connected services
          </h2>
          <Link
            href="/dashboard/integrations"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-[oklch(0.78_0.15_195)]"
          >
            Manage
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4">
          <ConnectedServices
            jiraConfigured={jiraConfigured}
            stripeConfigured={stripeConfigured}
          />
        </div>
      </div>

      {/* Runtime protection */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-[oklch(0.78_0.15_195)]">
            Runtime protection
          </h2>
          <Link
            href="/dashboard/protection"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-[oklch(0.78_0.15_195)]"
          >
            Manage
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {protectedApps.length === 0 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-dashed border-[oklch(0.78_0.15_195/0.3)] bg-[oklch(0.78_0.15_195/0.04)] px-5 py-4">
            <p className="text-sm text-muted-foreground">
              Go beyond scanning — apply no-code runtime protection to block live
              attacks on shipped apps.
            </p>
            <Button asChild size="sm" variant="secondary">
              <Link href="/dashboard/protection/new">Protect an app</Link>
            </Button>
          </div>
        ) : (
          <div className="signal-card mt-4 divide-y divide-[oklch(0.78_0.15_195/0.16)]">
            {protectedApps.slice(0, 3).map((app) => (
              <Link
                key={app.id}
                href={`/dashboard/protection/${app.id}`}
                className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[oklch(0.78_0.15_195/0.06)]"
              >
                <div className="signal-icon-box flex h-9 w-9 shrink-0 items-center justify-center">
                  {app.platform === "ios" ? (
                    <Apple className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {app.appName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatNumber(app.attacksBlocked)} blocked
                  </p>
                </div>
                <RiskBadge risk={app.riskLevel} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent scans */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-[oklch(0.78_0.15_195)]">
            Recent scans
          </h2>
          {scans.length >= 2 && (
            <Link
              href="/dashboard/compare"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-[oklch(0.78_0.15_195)]"
            >
              <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
              Compare versions
            </Link>
          )}
        </div>

        {scans.length === 0 ? (
          <div className="signal-card mt-4 flex flex-col items-center justify-center border-dashed px-6 py-16 text-center">
            <ShieldCheck
              className="h-10 w-10 text-[oklch(0.78_0.15_195)]"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
              No scans yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Upload your first APK or IPA to get a full security report in
              minutes.
            </p>
            <Button asChild className="signal-btn mt-6">
              <Link href="/dashboard/scan/new">Run your first scan</Link>
            </Button>
          </div>
        ) : (
          <div className="signal-card mt-4 divide-y divide-[oklch(0.78_0.15_195/0.16)]">
            {scans.map((scan) => (
              <Link
                key={scan.id}
                href={`/dashboard/scans/${scan.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[oklch(0.78_0.15_195/0.06)]"
              >
                <div className="signal-icon-box flex h-10 w-10 shrink-0 items-center justify-center">
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

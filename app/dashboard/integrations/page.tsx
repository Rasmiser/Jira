import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { isJiraConfigured } from "@/lib/jira"
import { getScans } from "@/app/actions/scans"
import Link from "next/link"
import { GitMerge, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function IntegrationsPage() {
  const { allowed } = await getFeatureAccess("team")
  if (!allowed) {
    return (
      <FeatureLocked featureName="Jira issue sync for findings" requiredPlan="team" />
    )
  }

  const [configured, scans] = await Promise.all([
    Promise.resolve(isJiraConfigured()),
    getScans(),
  ])

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="Integrations"
        description="Connect RASMISER to your workflow tools so findings turn into tracked work automatically."
        icon={GitMerge}
      />

      <div className="mt-8 border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-muted text-foreground">
              <GitMerge className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl tracking-tight text-foreground">
                Jira
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Push security findings to Jira as issues and keep their status in
                sync with your scans.
              </p>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider",
              configured
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {configured ? (
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            ) : (
              <XCircle className="h-3 w-3" aria-hidden="true" />
            )}
            {configured ? "Connected" : "Not configured"}
          </span>
        </div>

        {!configured && (
          <div className="mt-5 border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
            Set the <code className="text-foreground">JIRA_HOST</code>,{" "}
            <code className="text-foreground">JIRA_EMAIL</code>,{" "}
            <code className="text-foreground">JIRA_API_TOKEN</code>, and{" "}
            <code className="text-foreground">JIRA_PROJECT_KEY</code> environment
            variables to enable Jira sync.
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Push findings from a scan
        </h2>
        {scans.length === 0 ? (
          <div className="mt-4 border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
            Run a scan first — then you can push its findings to Jira from the scan
            detail page.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {scans.slice(0, 6).map((scan) => (
              <Link
                key={scan.id}
                href={`/dashboard/scans/${scan.id}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {scan.appName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {scan.criticalCount + scan.highCount + scan.mediumCount + scan.lowCount}{" "}
                    findings
                  </p>
                </div>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Open to sync
                </span>
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import Link from "next/link"
import { notFound } from "next/navigation"
import { getScan, getFindings } from "@/app/actions/scans"
import { RiskGauge } from "@/components/dashboard/risk-gauge"
import { SecurityScoreCard } from "@/components/dashboard/security-score-card"
import { MasvsReportPanel } from "@/components/dashboard/masvs-report-panel"
import { FindingsList } from "@/components/dashboard/findings-list"
import { DeleteScanButton } from "@/components/dashboard/delete-scan-button"
import { SendToJiraButton } from "@/components/dashboard/send-to-jira-button"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Smartphone,
  Apple,
  Package,
  Tag,
  Calendar,
  Download,
} from "lucide-react"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function ScanReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const scan = await getScan(id)
  if (!scan) notFound()

  const findings = await getFindings(id)
  const syncedCount = findings.filter((f) => f.jiraIssueKey).length

  const severityCounts = [
    { label: "Critical", value: scan.criticalCount, color: "text-red-400" },
    { label: "High", value: scan.highCount, color: "text-orange-400" },
    { label: "Medium", value: scan.mediumCount, color: "text-yellow-400" },
    { label: "Low", value: scan.lowCount, color: "text-sky-400" },
  ]

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to overview
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-6 border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <RiskGauge score={scan.riskScore ?? 0} grade={scan.grade ?? "—"} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                {scan.platform === "ios" ? (
                  <Apple className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {scan.platform === "ios" ? "iOS" : "Android"} · completed
              </div>
              <h1 className="mt-1 font-display text-4xl tracking-tight text-foreground">
                {scan.appName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {findings.length} findings detected
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <a
              href={`/api/scans/${scan.id}/pdf`}
              className="inline-flex items-center gap-2 border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </a>
            <SendToJiraButton
              scanId={scan.id}
              syncedCount={syncedCount}
              totalFindings={findings.length}
            />
            <DeleteScanButton scanId={scan.id} />
          </div>
        </div>

        {/* Executive security score */}
        <SecurityScoreCard
          riskScore={scan.riskScore}
          counts={{
            critical: scan.criticalCount,
            high: scan.highCount,
            medium: scan.mediumCount,
            low: scan.lowCount,
          }}
        />

        {/* Severity breakdown */}
        <div className="mt-px grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {severityCounts.map((s) => (
            <div key={s.label} className="bg-card px-5 py-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className={cn("mt-2 font-display text-3xl", s.color)}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <Meta icon={Package} label="Package" value={scan.packageName ?? "—"} />
          <Meta icon={Tag} label="Version" value={scan.versionName ?? "—"} />
          <Meta
            icon={Calendar}
            label="Scanned"
            value={formatDate(scan.completedAt ?? scan.createdAt)}
          />
        </div>

        {/* Findings */}
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Findings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a finding to view details and guided remediation.
          </p>
          <div className="mt-4">
            <FindingsList findings={findings} />
          </div>
        </div>

        {/* OWASP MASVS compliance */}
        <div className="mt-10">
          <MasvsReportPanel scanId={scan.id} />
        </div>
      </div>
    </div>
  )
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="bg-card px-5 py-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1.5 truncate font-mono text-sm text-foreground">{value}</p>
    </div>
  )
}

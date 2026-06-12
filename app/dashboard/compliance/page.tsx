import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { getScans } from "@/app/actions/scans"
import { ClipboardCheck, FileDown, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const POLICIES = [
  { name: "MASVS-STORAGE", detail: "No sensitive data in insecure local storage." },
  { name: "MASVS-CRYPTO", detail: "Strong, non-deprecated cryptographic primitives only." },
  { name: "MASVS-NETWORK", detail: "TLS enforced with certificate pinning." },
  { name: "MASVS-AUTH", detail: "Secure authentication and session handling." },
  { name: "MASVS-RESILIENCE", detail: "Anti-tamper and runtime integrity controls." },
] as const

export default async function CompliancePage() {
  const { allowed } = await getFeatureAccess("enterprise")
  if (!allowed) {
    return (
      <FeatureLocked
        featureName="Custom MASVS policy & compliance reports"
        requiredPlan="enterprise"
      />
    )
  }

  const scans = await getScans()
  const completed = scans.filter((s) => s.status === "completed")
  const totalCritical = completed.reduce((s, x) => s + x.criticalCount, 0)
  const totalHigh = completed.reduce((s, x) => s + x.highCount, 0)
  const compliant = totalCritical === 0 && totalHigh === 0 && completed.length > 0

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="Compliance"
        description="Define organization-wide MASVS policies and export audit-ready compliance reports."
        icon={ClipboardCheck}
      />

      <div
        className={cn(
          "mt-8 flex flex-wrap items-center justify-between gap-4 border px-6 py-5",
          compliant
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-border bg-card",
        )}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck
            className={cn(
              "h-6 w-6",
              compliant ? "text-emerald-400" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
          <div>
            <p className="font-display text-xl tracking-tight text-foreground">
              {completed.length === 0
                ? "No scans yet"
                : compliant
                  ? "Policy compliant"
                  : "Action required"}
            </p>
            <p className="text-sm text-muted-foreground">
              {completed.length === 0
                ? "Run a scan to assess compliance."
                : `${totalCritical} critical · ${totalHigh} high across ${completed.length} scans`}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          Export report (PDF)
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          MASVS policy
        </h2>
        <div className="mt-4 divide-y divide-border border border-border">
          {POLICIES.map((policy) => (
            <div key={policy.name} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm text-foreground">{policy.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{policy.detail}</p>
              </div>
              <span className="shrink-0 border border-border bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Required
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

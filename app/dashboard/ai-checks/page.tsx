import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { getScans } from "@/app/actions/scans"
import { BrainCircuit, AlertTriangle, CheckCircle2, ShieldQuestion } from "lucide-react"
import { cn } from "@/lib/utils"

const AI_CHECKS = [
  {
    name: "Prompt injection resistance",
    detail: "Detects user input flowing into model prompts without sanitization.",
    category: "Input handling",
  },
  {
    name: "Sensitive data leakage",
    detail: "Flags PII, secrets, or tokens that could be sent to model providers.",
    category: "Data privacy",
  },
  {
    name: "Output handling & rendering",
    detail: "Checks that model output is escaped before being rendered or executed.",
    category: "Output safety",
  },
  {
    name: "Model abuse & rate limiting",
    detail: "Verifies guardrails against unbounded usage and cost-amplification attacks.",
    category: "Abuse prevention",
  },
  {
    name: "On-device model integrity",
    detail: "Confirms bundled models are signed and tamper-checked at runtime.",
    category: "Integrity",
  },
] as const

export default async function AiChecksPage() {
  const { allowed } = await getFeatureAccess("free")
  if (!allowed) {
    return <FeatureLocked featureName="AI feature security checks" requiredPlan="free" />
  }

  const scans = await getScans()
  const scanned = scans.length

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="AI security checks"
        description="Audit the AI and LLM features in your app for prompt injection, data leakage, and model abuse before they ship."
        icon={BrainCircuit}
      />

      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <Stat label="Checks available" value={`${AI_CHECKS.length}`} />
        <Stat label="Apps scanned" value={`${scanned}`} />
        <Stat label="Coverage" value="OWASP LLM Top 10" />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          What we check
        </h2>
        <div className="mt-4 divide-y divide-border border border-border">
          {AI_CHECKS.map((check) => (
            <div key={check.name} className="flex items-start gap-4 px-5 py-4">
              <ShieldQuestion
                className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{check.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{check.detail}</p>
              </div>
              <span className="hidden shrink-0 border border-border bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
                {check.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "mt-8 flex items-center gap-3 border px-5 py-4",
          scanned > 0
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-border bg-muted",
        )}
      >
        {scanned > 0 ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
        <p className="text-sm text-foreground">
          {scanned > 0
            ? "AI security checks run automatically as part of every new scan you submit."
            : "Run a scan to include AI feature security checks in your report."}
        </p>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-tight text-foreground">{value}</p>
    </div>
  )
}

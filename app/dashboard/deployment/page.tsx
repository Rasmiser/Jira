import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import Link from "next/link"
import { Server, Cloud, Lock, ShieldCheck } from "lucide-react"

const OPTIONS = [
  {
    icon: Cloud,
    title: "Private VPC deployment",
    detail:
      "Run RASMISER inside your own cloud account (AWS, GCP, or Azure) with data never leaving your VPC.",
  },
  {
    icon: Server,
    title: "On-premises",
    detail:
      "Deploy to your own data center with an air-gapped option for the most sensitive environments.",
  },
  {
    icon: Lock,
    title: "Customer-managed keys",
    detail: "Bring your own KMS keys so you retain full control of encryption at rest.",
  },
] as const

export default async function DeploymentPage() {
  const { allowed } = await getFeatureAccess("enterprise")
  if (!allowed) {
    return (
      <FeatureLocked
        featureName="On-prem / private deployment"
        requiredPlan="enterprise"
      />
    )
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="Deployment"
        description="Run RASMISER inside your own infrastructure for full control over data residency and isolation."
        icon={Server}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon
          return (
            <div key={opt.title} className="flex flex-col border border-border bg-card p-5">
              <div className="flex h-11 w-11 items-center justify-center border border-border bg-muted text-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-medium text-foreground">{opt.title}</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {opt.detail}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-border bg-card px-6 py-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-foreground" aria-hidden="true" />
          <p className="text-sm text-foreground">
            Private deployments are configured with your dedicated security engineer.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          Plan your deployment
        </Link>
      </div>
    </div>
  )
}

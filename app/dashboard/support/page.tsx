import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { LifeBuoy, MessageSquare, BookOpen, Mail, UserCog, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { planIncludes } from "@/lib/plans"

export default async function SupportPage() {
  const { allowed, plan } = await getFeatureAccess("free")
  if (!allowed) {
    return <FeatureLocked featureName="Support" requiredPlan="free" />
  }

  const hasPriority = planIncludes(plan.id, "team")
  const hasDedicated = planIncludes(plan.id, "enterprise")

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="Support"
        description="Get help when you need it. Your support level scales with your plan."
        icon={LifeBuoy}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Channel
          icon={BookOpen}
          title="Community & docs"
          detail="Search the knowledge base and ask the RASMISER community."
          available
          cta={{ label: "Open docs", href: "/docs" }}
          tier="All plans"
        />
        <Channel
          icon={MessageSquare}
          title="Community forum"
          detail="Discuss findings, integrations, and best practices with other teams."
          available
          cta={{ label: "Visit forum", href: "/community" }}
          tier="All plans"
        />
        <Channel
          icon={Mail}
          title="Priority email support"
          detail="Skip the queue with prioritized responses from our support team."
          available={hasPriority}
          cta={
            hasPriority
              ? { label: "Email support", href: "mailto:support@rasmiser.com" }
              : { label: "Upgrade to Team", href: "/dashboard/billing?plan=team" }
          }
          tier="Team & up"
        />
        <Channel
          icon={UserCog}
          title="Dedicated security engineer"
          detail="A named engineer for reviews, threat modeling, and guidance."
          available={hasDedicated}
          cta={
            hasDedicated
              ? { label: "Contact your engineer", href: "/dashboard/support" }
              : { label: "Upgrade to Enterprise", href: "/dashboard/billing?plan=enterprise" }
          }
          tier="Enterprise"
        />
        <Channel
          icon={LifeBuoy}
          title="SLA-backed support"
          detail="Contractual response-time guarantees for critical issues."
          available={hasDedicated}
          cta={
            hasDedicated
              ? { label: "View your SLA", href: "/dashboard/support" }
              : { label: "Upgrade to Enterprise", href: "/dashboard/billing?plan=enterprise" }
          }
          tier="Enterprise"
        />
      </div>
    </div>
  )
}

function Channel({
  icon: Icon,
  title,
  detail,
  available,
  cta,
  tier,
}: {
  icon: LucideIcon
  title: string
  detail: string
  available: boolean
  cta: { label: string; href: string }
  tier: string
}) {
  return (
    <div className="flex flex-col border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center border border-border bg-muted text-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="border border-border bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {tier}
        </span>
      </div>
      <h2 className="mt-4 font-medium text-foreground">{title}</h2>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
      <Link
        href={cta.href}
        className="mt-4 inline-flex items-center justify-center border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
      >
        {cta.label}
      </Link>
    </div>
  )
}

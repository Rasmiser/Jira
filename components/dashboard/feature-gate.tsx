import Link from "next/link"
import { Lock, ArrowLeft, Sparkles, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPlan, type PlanId } from "@/lib/plans"

/**
 * Full-page lock shown when a user's plan doesn't include a feature.
 * Renders the feature name, the required plan, and an upgrade CTA.
 */
export function FeatureLocked({
  featureName,
  requiredPlan,
}: {
  featureName: string
  requiredPlan: PlanId
}) {
  const plan = getPlan(requiredPlan)

  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/dashboard/features"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to features
      </Link>

      <div className="mx-auto mt-10 max-w-md border border-border bg-card px-6 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-border bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl tracking-tight text-foreground">
          {featureName}
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          This feature is included with the{" "}
          <span className="font-medium text-foreground">{plan.name}</span> plan.
          Upgrade to unlock it for your workspace.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href={`/dashboard/billing?plan=${requiredPlan}`}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Upgrade to {plan.name}
          </Link>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          ${(plan.priceInCents / 100).toFixed(0)} / month · cancel anytime
        </p>
      </div>
    </div>
  )
}

/** Standard header for a feature page: back link, title, and subtitle. */
export function FeaturePageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div>
      <Link
        href="/dashboard/features"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to features
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <Icon className="h-6 w-6 text-foreground" aria-hidden="true" />
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

import { getUserId } from "@/lib/subscription"
import { getOrCreateSubscription } from "@/lib/subscription"
import { getPlan, type PlanId } from "@/lib/plans"
import { FeatureHub } from "@/components/dashboard/feature-hub"
import { RoadmapSection } from "@/components/dashboard/roadmap-section"

export const metadata = {
  title: "Features | RASMISER",
}

export default async function FeaturesPage() {
  const userId = await getUserId()
  const sub = await getOrCreateSubscription(userId)
  const plan = getPlan(sub.plan)

  return (
    <div className="px-6 py-8 md:px-10">
      <div>
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Features
        </h1>
        <p className="mt-1 max-w-2xl text-pretty text-muted-foreground">
          Everything in your plan, in one place. You&apos;re on the{" "}
          <span className="font-medium text-foreground">{plan.name}</span> plan —
          unlocked features are ready to use, and locked ones can be added by
          upgrading.
        </p>
      </div>

      <FeatureHub currentPlan={plan.id as PlanId} />

      <RoadmapSection />
    </div>
  )
}

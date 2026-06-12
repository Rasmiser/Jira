import "server-only"

import { getUserId, getOrCreateSubscription } from "@/lib/subscription"
import { getPlan, planIncludes, type PlanId } from "@/lib/plans"

/**
 * Resolves the current user's plan and whether they can access a feature that
 * requires `requiredPlan`. Use in feature pages to decide between rendering the
 * feature or the <FeatureLocked /> upsell.
 */
export async function getFeatureAccess(requiredPlan: PlanId) {
  const userId = await getUserId()
  const sub = await getOrCreateSubscription(userId)
  const plan = getPlan(sub.plan)
  const allowed = planIncludes(plan.id, requiredPlan)
  return { userId, plan, allowed }
}

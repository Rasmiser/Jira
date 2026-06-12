import Link from "next/link"
import { ArrowRight, Lock, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { FEATURES } from "@/lib/features"
import { getPlan, planIncludes, type PlanId } from "@/lib/plans"

const PLAN_GROUPS: PlanId[] = ["free", "team", "enterprise"]

export function FeatureHub({ currentPlan }: { currentPlan: PlanId }) {
  return (
    <div className="mt-10 flex flex-col gap-12">
      {PLAN_GROUPS.map((planId) => {
        const plan = getPlan(planId)
        const groupFeatures = FEATURES.filter((f) => f.plan === planId)
        const planUnlocked = planIncludes(currentPlan, planId)

        return (
          <section key={planId}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {plan.name}
                {plan.priceInCents > 0 && (
                  <span className="ml-2 text-muted-foreground/60">
                    ${(plan.priceInCents / 100).toFixed(0)}/mo
                  </span>
                )}
              </h2>
              {planUnlocked ? (
                <span className="inline-flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  Included
                </span>
              ) : (
                <Link
                  href={`/dashboard/billing?plan=${planId}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Upgrade to unlock
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupFeatures.map((feature) => {
                const Icon = feature.icon
                const unlocked = planIncludes(currentPlan, feature.plan)
                const href = unlocked
                  ? feature.href
                  : `/dashboard/billing?plan=${feature.plan}`

                return (
                  <Link
                    key={feature.id}
                    href={href}
                    className={cn(
                      "group relative flex flex-col border border-border bg-card p-5 transition-colors hover:bg-accent",
                      !unlocked && "opacity-80",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center border border-border bg-muted",
                          unlocked ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      {unlocked ? (
                        <ArrowRight
                          className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
                          aria-hidden="true"
                        />
                      ) : (
                        <Lock
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <h3 className="mt-4 font-medium text-foreground">
                      {feature.name}
                    </h3>
                    <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                      {unlocked ? "Open" : `Requires ${getPlan(feature.plan).name}`}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PLAN_LIST, type PlanId } from "@/lib/plans"
import { startCheckout, cancelSubscription } from "@/app/actions/stripe"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function PlanGrid({ currentPlan }: { currentPlan: PlanId }) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSelect = async (planId: PlanId) => {
    setError(null)
    if (planId === "free") {
      setLoadingId(planId)
      startTransition(async () => {
        await cancelSubscription()
        router.refresh()
        setLoadingId(null)
      })
      return
    }

    setLoadingId(planId)
    try {
      const url = await startCheckout(planId)
      if (url) {
        // Hosted checkout: break out of the preview iframe if needed.
        if (window.self !== window.top) {
          window.open(url, "_blank")
          setLoadingId(null)
        } else {
          window.location.href = url
        }
      }
    } catch {
      setError("Could not start checkout. Please try again.")
      setLoadingId(null)
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
        {PLAN_LIST.map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isBusy = (loadingId === plan.id && pending) || loadingId === plan.id
          const highlight = plan.id === "pro"
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col bg-card px-6 py-7",
                highlight && "ring-1 ring-inset ring-foreground/20",
              )}
            >
              {highlight && (
                <span className="mb-3 inline-flex w-fit items-center border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-2xl tracking-tight text-foreground">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl tracking-tight text-foreground">
                  ${(plan.priceInCents / 100).toFixed(0)}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-7 w-full"
                variant={highlight ? "default" : "secondary"}
                disabled={isCurrent || isBusy}
                onClick={() => handleSelect(plan.id)}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Please wait...
                  </>
                ) : isCurrent ? (
                  "Current plan"
                ) : plan.id === "free" ? (
                  "Downgrade to Free"
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

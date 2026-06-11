import { redirect } from "next/navigation"
import { getSession, getOrCreateSubscription, getUsage } from "@/lib/subscription"
import { getPlan, PLANS, type PlanId } from "@/lib/plans"
import { confirmCheckout } from "@/app/actions/stripe"
import { PlanGrid } from "@/components/dashboard/plan-grid"
import { CheckCircle2, XCircle } from "lucide-react"

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; canceled?: string; plan?: string }>
}) {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")

  const sp = await searchParams
  let justUpgraded = false

  if (sp.session_id) {
    const res = await confirmCheckout(sp.session_id)
    justUpgraded = res.ok
  }

  const sub = await getOrCreateSubscription(session.user.id)
  const plan = getPlan(sub.plan)
  const usage = await getUsage(session.user.id)

  // A ?plan= hint from the marketing pricing page pre-selects a paid plan for
  // checkout, as long as it's a real paid plan the user isn't already on.
  const intent =
    sp.plan && sp.plan in PLANS && sp.plan !== "free" && sp.plan !== plan.id
      ? (sp.plan as PlanId)
      : undefined

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Billing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and scan capacity.
        </p>

        {justUpgraded && (
          <div className="mt-6 flex items-center gap-3 border border-emerald-500/40 bg-emerald-500/10 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            <p className="text-sm text-foreground">
              Payment successful — you&apos;re now on the {plan.name} plan.
            </p>
          </div>
        )}

        {sp.canceled && !justUpgraded && (
          <div className="mt-6 flex items-center gap-3 border border-border bg-muted px-5 py-4">
            <XCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Checkout canceled. Your plan was not changed.
            </p>
          </div>
        )}

        {/* Current usage */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-border bg-card px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Current plan
            </p>
            <p className="mt-1 font-display text-2xl tracking-tight text-foreground">
              {plan.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Scans this month
            </p>
            <p className="mt-1 font-display text-2xl tracking-tight text-foreground">
              {usage.limit === null
                ? `${usage.used} · unlimited`
                : `${usage.used} / ${usage.limit}`}
            </p>
          </div>
        </div>

        {plan.id !== "free" && sub.currentPeriodEnd && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your {plan.name} subscription renews on{" "}
            {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            . Switch to Free anytime to cancel.
          </p>
        )}

        <div className="mt-8">
          <PlanGrid currentPlan={plan.id as PlanId} autoCheckout={intent} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Paid plans are billed monthly and you can cancel anytime by switching
          back to Free. Payments are processed securely by Stripe.
        </p>
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { getSession, getOrCreateSubscription, getUsage } from "@/lib/subscription"
import { getPlan, type PlanId } from "@/lib/plans"
import { confirmCheckout } from "@/app/actions/stripe"
import { PlanGrid } from "@/components/dashboard/plan-grid"
import { CheckCircle2, XCircle } from "lucide-react"

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; canceled?: string }>
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

        <div className="mt-8">
          <PlanGrid currentPlan={plan.id as PlanId} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Payments are processed securely by Stripe. Use test card 4242 4242 4242
          4242 with any future expiry and CVC.
        </p>
      </div>
    </div>
  )
}

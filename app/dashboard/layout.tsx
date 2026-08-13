import type React from "react"
import { redirect } from "next/navigation"
import { getSession, getOrCreateSubscription } from "@/lib/subscription"
import { getPlan } from "@/lib/plans"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")

  const sub = await getOrCreateSubscription(session.user.id)
  const plan = getPlan(sub.plan)

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="signal-sidebar hidden w-64 shrink-0 md:block">
        <div className="sticky top-0 h-svh">
          <DashboardNav
            userName={session.user.name}
            userEmail={session.user.email}
            planName={plan.name}
          />
        </div>
      </aside>
      <main className="signal-main-bg relative flex-1 min-w-0">{children}</main>
    </div>
  )
}

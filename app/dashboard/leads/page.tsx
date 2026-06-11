import { redirect } from "next/navigation"
import { getSession } from "@/lib/subscription"
import { getLeads, getLeadStats } from "@/app/actions/lead"
import { LeadsTable } from "@/components/dashboard/leads-table"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Leads | RASMISER",
}

export default async function LeadsPage() {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")

  const [leads, stats] = await Promise.all([getLeads(), getLeadStats()])

  const cards = [
    { label: "Total leads", value: stats.total, key: "total" },
    { label: "New", value: stats.counts.new ?? 0, key: "new", danger: (stats.counts.new ?? 0) > 0 },
    { label: "Contacted", value: stats.counts.contacted ?? 0, key: "contacted" },
    { label: "Qualified", value: stats.counts.qualified ?? 0, key: "qualified" },
  ]

  return (
    <div className="px-6 py-8 md:px-10">
      <div>
        <h1 className="font-display text-4xl tracking-tight text-foreground">Leads</h1>
        <p className="mt-1 text-muted-foreground">
          Inbound demo and sales requests from your contact form.
        </p>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="bg-card px-5 py-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p
              className={cn(
                "mt-2 font-display text-3xl tracking-tight",
                c.danger ? "text-sky-400" : "text-foreground",
              )}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}

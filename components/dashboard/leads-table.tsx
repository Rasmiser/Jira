"use client"

import { useState, useTransition } from "react"
import { updateLeadStatus } from "@/app/actions/lead"
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Mail, Building2, Search, Inbox } from "lucide-react"

export type Lead = {
  id: string
  name: string
  email: string
  company: string | null
  appPlatform: string | null
  teamSize: string | null
  inquiryType: string
  message: string | null
  source: string
  status: string
  createdAt: Date | string
}

const STATUS_STYLES: Record<string, string> = {
  new: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  contacted: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  qualified: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  closed: "border-border bg-muted text-muted-foreground",
}

const INQUIRY_LABELS: Record<string, string> = {
  demo: "Demo request",
  sales: "Sales",
  support: "Support",
  general: "General",
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function StatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status)
  const [pending, startTransition] = useTransition()

  const handleChange = (next: string) => {
    const prev = value
    setValue(next)
    startTransition(async () => {
      try {
        await updateLeadStatus(id, next as LeadStatus)
      } catch {
        setValue(prev)
      }
    })
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger
        className={cn(
          "h-7 w-[120px] border text-[11px] font-medium uppercase tracking-wider",
          STATUS_STYLES[value] ?? STATUS_STYLES.closed,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LEAD_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs uppercase tracking-wider">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.company?.toLowerCase().includes(q) ?? false)
    return matchesStatus && matchesQuery
  })

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or company"
            aria-label="Search leads"
            className="h-10 w-full border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-[150px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
            {leads.length === 0 ? "No leads yet" : "No matching leads"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {leads.length === 0
              ? "Inbound demo and sales requests from your contact form will show up here."
              : "Try adjusting your search or status filter."}
          </p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border border border-border">
          {filtered.map((lead) => (
            <li key={lead.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-medium text-foreground">{lead.name}</p>
                  <span className="inline-flex items-center border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {INQUIRY_LABELS[lead.inquiryType] ?? lead.inquiryType}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    {lead.email}
                  </a>
                  {lead.company && (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {lead.company}
                    </span>
                  )}
                  {lead.appPlatform && <span className="capitalize">{lead.appPlatform}</span>}
                  {lead.teamSize && <span>{lead.teamSize} people</span>}
                </div>
                {lead.message && (
                  <p className="mt-2 text-pretty text-sm text-muted-foreground">{lead.message}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</span>
                <StatusSelect id={lead.id} status={lead.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

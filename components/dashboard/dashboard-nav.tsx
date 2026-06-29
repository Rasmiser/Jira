"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ScanLine,
  CreditCard,
  ShieldCheck,
  ShieldHalf,
  Radar,
  FlaskConical,
  ClipboardList,
  Inbox,
  LayoutGrid,
  Languages,
  Map,
} from "lucide-react"
import { SignOutButton } from "./sign-out-button"

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/features", label: "Features", icon: LayoutGrid },
  { href: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { href: "/dashboard/scan/new", label: "New scan", icon: ScanLine },
  { href: "/dashboard/testing", label: "Test suites", icon: FlaskConical },
  { href: "/dashboard/test-cases", label: "Test cases", icon: ClipboardList },
  { href: "/dashboard/protection", label: "Protection", icon: ShieldHalf },
  { href: "/dashboard/localization", label: "Translate & Adapt", icon: Languages },
  { href: "/dashboard/threats", label: "Live threats", icon: Radar },
  { href: "/dashboard/leads", label: "Leads", icon: Inbox },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
]

export function DashboardNav({
  userName,
  userEmail,
  planName,
}: {
  userName: string
  userEmail: string
  planName: string
}) {
  const pathname = usePathname()

  return (
    <nav className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 px-6 py-6 text-foreground">
        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        <span className="font-display text-xl tracking-tight">RASMISER</span>
      </Link>

      <div className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </div>

      <div className="border-t border-border px-3 py-3">
        <div className="px-3 py-2">
          <p className="truncate text-sm font-medium text-foreground">{userName}</p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          <span className="mt-2 inline-flex items-center border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {planName} plan
          </span>
        </div>
        <SignOutButton />
      </div>
    </nav>
  )
}

import Link from "next/link"
import {
  ScanLine,
  ShieldHalf,
  FlaskConical,
  Languages,
  Radar,
  Workflow,
  GitMerge,
  CreditCard,
  Lock,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { planIncludes, type PlanId } from "@/lib/plans"

interface QuickAccessItem {
  label: string
  description: string
  href: string
  icon: LucideIcon
  plan: PlanId
}

const QUICK_ACCESS: QuickAccessItem[] = [
  {
    label: "New scan",
    description: "Upload an APK or IPA",
    href: "/dashboard/scan/new",
    icon: ScanLine,
    plan: "free",
  },
  {
    label: "Protection",
    description: "Runtime shielding",
    href: "/dashboard/protection",
    icon: ShieldHalf,
    plan: "free",
  },
  {
    label: "Test suites",
    description: "Automated test runs",
    href: "/dashboard/testing",
    icon: FlaskConical,
    plan: "free",
  },
  {
    label: "Translate & Adapt",
    description: "Localize your listing",
    href: "/dashboard/localization",
    icon: Languages,
    plan: "free",
  },
  {
    label: "Live threats",
    description: "Real-time attack feed",
    href: "/dashboard/threats",
    icon: Radar,
    plan: "free",
  },
  {
    label: "Automation",
    description: "CI/CD scan pipelines",
    href: "/dashboard/automation",
    icon: Workflow,
    plan: "team",
  },
  {
    label: "Integrations",
    description: "Jira issue sync",
    href: "/dashboard/integrations",
    icon: GitMerge,
    plan: "team",
  },
  {
    label: "Billing",
    description: "Plan & payment details",
    href: "/dashboard/billing",
    icon: CreditCard,
    plan: "free",
  },
]

export function QuickAccessGrid({ currentPlan }: { currentPlan: PlanId }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {QUICK_ACCESS.map((item) => {
        const unlocked = planIncludes(currentPlan, item.plan)
        const href = unlocked ? item.href : `/dashboard/billing?plan=${item.plan}`
        const Icon = item.icon

        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              "signal-card group flex flex-col gap-3 px-4 py-4",
              !unlocked && "opacity-80",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="signal-icon-box flex h-9 w-9 items-center justify-center">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              {unlocked ? (
                <ArrowRight
                  className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-[oklch(0.78_0.15_195)]"
                  aria-hidden="true"
                />
              ) : (
                <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

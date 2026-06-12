import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { getSession } from "@/lib/subscription"
import { Users, Plus, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ROLES = [
  { name: "Owner", detail: "Full access including billing and workspace deletion." },
  { name: "Admin", detail: "Manage members, integrations, and all scans." },
  { name: "Member", detail: "Run scans and view findings for shared apps." },
] as const

export default async function WorkspacePage() {
  const { allowed } = await getFeatureAccess("team")
  if (!allowed) {
    return (
      <FeatureLocked
        featureName="Shared workspace & role-based access"
        requiredPlan="team"
      />
    )
  }

  const session = await getSession()
  const owner = {
    name: session?.user.name ?? "You",
    email: session?.user.email ?? "",
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="Workspace"
        description="Invite teammates and control what they can do with role-based access."
        icon={Users}
      />

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Members
        </h2>
        <Button size="sm" variant="secondary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Invite member
        </Button>
      </div>

      <div className="mt-4 divide-y divide-border border border-border">
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted font-display text-sm text-foreground">
            {owner.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{owner.name}</p>
            <p className="truncate text-xs text-muted-foreground">{owner.email}</p>
          </div>
          <span className="border border-border bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Owner
          </span>
        </div>
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No other members yet. Invite teammates to collaborate on scans and findings.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Roles
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {ROLES.map((role, i) => (
            <div
              key={role.name}
              className={cn(
                "border border-border bg-card p-5",
                i === 0 && "ring-1 ring-border",
              )}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-foreground" aria-hidden="true" />
                <p className="font-medium text-foreground">{role.name}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {role.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Languages, Plus, Globe2, FileText } from "lucide-react"
import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { getProjects } from "@/app/actions/localization"
import { localeLabel, CONTENT_TYPES } from "@/lib/locales"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

function contentTypeLabel(id: string) {
  return CONTENT_TYPES.find((c) => c.id === id)?.label ?? id
}

export default async function LocalizationPage() {
  const { allowed } = await getFeatureAccess("free")
  if (!allowed) {
    return <FeatureLocked featureName="Translate & Adapt localized content" requiredPlan="free" />
  }

  const projects = await getProjects()

  const totalLocales = projects.reduce(
    (sum, p) => sum + ((p.targetLocales as string[])?.length ?? 0),
    0,
  )
  const completed = projects.reduce(
    (sum, p) => sum + p.translations.filter((t) => t.status === "completed").length,
    0,
  )

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <FeaturePageHeader
          title="Translate & Adapt"
          description="Localize your app store listings and in-app strings into any market with AI that adapts tone, idioms, and conventions — not just literal translations."
          icon={Languages}
        />
        <Button asChild>
          <Link href="/dashboard/localization/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New project
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <Stat label="Projects" value={`${projects.length}`} />
        <Stat label="Target locales" value={`${totalLocales}`} />
        <Stat label="Locales completed" value={`${completed}`} />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Your projects
        </h2>

        {projects.length === 0 ? (
          <div className="mt-4 border border-dashed border-border px-6 py-14 text-center">
            <Globe2 className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 text-pretty text-sm text-muted-foreground">
              No localization projects yet. Create one to translate and adapt your
              app content for global markets.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/localization/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create your first project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {projects.map((p) => {
              const targets = (p.targetLocales as string[]) ?? []
              const done = p.translations.filter((t) => t.status === "completed").length
              return (
                <Link
                  key={p.id}
                  href={`/dashboard/localization/${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent"
                >
                  <FileText
                    className="h-5 w-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{p.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {contentTypeLabel(p.contentType)} · from {localeLabel(p.sourceLocale)} ·{" "}
                      {targets.length} locale{targets.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 border px-2 py-1 text-[10px] font-medium uppercase tracking-wider",
                      done === targets.length && targets.length > 0
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {done}/{targets.length} done
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-tight text-foreground">{value}</p>
    </div>
  )
}

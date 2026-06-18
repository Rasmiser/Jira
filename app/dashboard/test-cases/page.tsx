import Link from "next/link"
import { getTestCases } from "@/app/actions/test-cases"
import {
  PriorityBadge,
  CaseStatusBadge,
  RunStatusBadge,
  platformIcon,
  PLATFORM_LABEL,
} from "@/components/dashboard/test-case-badges"
import { ClipboardList, Plus, ArrowRight, Sparkles } from "lucide-react"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function TestCasesPage() {
  const cases = await getTestCases()

  const ready = cases.filter((c) => c.status === "ready").length
  const aiAuthored = cases.filter((c) => c.source === "ai").length

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-foreground">
            Test case library
          </h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Author reusable end-to-end test cases in plain English with CoTester,
            organize them, and run them across the real device cloud.
          </p>
        </div>
        <Link
          href="/dashboard/test-cases/new"
          className="inline-flex shrink-0 items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New test case
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <Stat label="Total cases" value={cases.length} />
        <Stat label="Ready to run" value={ready} />
        <Stat label="AI authored" value={aiAuthored} icon />
      </div>

      {/* List */}
      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          All test cases
        </h2>

        {cases.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
              No test cases yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Describe a scenario in plain English and let CoTester draft your
              first runnable test case.
            </p>
            <Link
              href="/dashboard/test-cases/new"
              className="mt-5 inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Author with CoTester
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {cases.map((c) => {
              const PlatformIcon = platformIcon(c.platform)
              const stepCount = Array.isArray(c.steps) ? c.steps.length : 0
              const tags = Array.isArray(c.tags) ? (c.tags as string[]) : []
              return (
                <Link
                  key={c.id}
                  href={`/dashboard/test-cases/${c.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground">
                    <PlatformIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-foreground">{c.title}</p>
                      {c.source === "ai" && (
                        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {PLATFORM_LABEL[c.platform] ?? c.platform} · {stepCount} steps ·
                      updated {formatDate(c.updatedAt)}
                      {tags.length > 0 ? ` · ${tags.slice(0, 3).join(", ")}` : ""}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    {c.lastRunStatus && <RunStatusBadge status={c.lastRunStatus} />}
                    <PriorityBadge priority={c.priority} />
                    <CaseStatusBadge status={c.status} />
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon?: boolean
}) {
  return (
    <div className="bg-card px-5 py-5">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {icon && <Sparkles className="h-3 w-3" aria-hidden="true" />}
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-foreground">{value}</p>
    </div>
  )
}

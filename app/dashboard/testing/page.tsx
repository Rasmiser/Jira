import Link from "next/link"
import { getTestRuns } from "@/app/actions/testing"
import { TEST_TYPES } from "@/lib/test-engine"
import { getTestIcon } from "@/components/dashboard/test-icons"
import { gradeColor } from "@/components/dashboard/severity-badge"
import { cn } from "@/lib/utils"
import { ArrowRight, FlaskConical, ArrowUpRight } from "lucide-react"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function TestingPage() {
  const runs = await getTestRuns()

  const runsByType = new Map<string, number>()
  for (const r of runs) {
    runsByType.set(r.testType, (runsByType.get(r.testType) ?? 0) + 1)
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <div>
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Test suites
        </h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          End-to-end mobile app testing tools to ensure quality, performance, and
          user satisfaction. Pick a suite, run it against your build, and get a
          detailed report.
        </p>
      </div>

      {/* Test type tools */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEST_TYPES.map((t) => {
          const Icon = getTestIcon(t.icon)
          const count = runsByType.get(t.type) ?? 0
          return (
            <Link
              key={t.type}
              href={`/dashboard/testing/${t.type}`}
              className="group flex flex-col border border-border bg-card p-5 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center border border-border bg-muted",
                    t.accent,
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-4 font-medium text-foreground">{t.name}</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {t.tagline}
              </p>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                {count} {count === 1 ? "run" : "runs"}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Recent runs */}
      <div className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Recent test runs
        </h2>

        {runs.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center border border-dashed border-border px-6 py-16 text-center">
            <FlaskConical
              className="h-10 w-10 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-display text-2xl tracking-tight text-foreground">
              No test runs yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Choose a test suite above to run your first quality check.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border border border-border">
            {runs.slice(0, 12).map((run) => {
              const meta = TEST_TYPES.find((t) => t.type === run.testType)
              const Icon = getTestIcon(meta?.icon ?? "CheckCircle2")
              return (
                <Link
                  key={run.id}
                  href={`/dashboard/testing/runs/${run.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted",
                      meta?.accent,
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {run.appName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {meta?.name ?? run.testType} · {formatDate(run.createdAt)}
                    </p>
                  </div>
                  <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                    <span className="text-emerald-400">{run.passCount} pass</span>
                    {run.warnCount > 0 && (
                      <span className="text-yellow-400">{run.warnCount} warn</span>
                    )}
                    {run.failCount > 0 && (
                      <span className="text-red-400">{run.failCount} fail</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-display text-2xl leading-none",
                          gradeColor(run.grade),
                        )}
                      >
                        {run.grade}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        grade
                      </p>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

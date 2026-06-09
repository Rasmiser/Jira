import Link from "next/link"
import { notFound } from "next/navigation"
import { getTestRuns } from "@/app/actions/testing"
import { getTestTypeMeta, type TestType } from "@/lib/test-engine"
import { RunTestForm } from "@/components/dashboard/run-test-form"
import { getTestIcon } from "@/components/dashboard/test-icons"
import { gradeColor } from "@/components/dashboard/severity-badge"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"

const TARGET_COPY: Record<
  string,
  { label: string; placeholder: string }
> = {
  functional: {
    label: "Build or test plan reference",
    placeholder: "e.g. release-2.4.0 or feature flow URL",
  },
  compatibility: {
    label: "Build identifier",
    placeholder: "e.g. app-release.apk",
  },
  performance: {
    label: "Entry point / URL",
    placeholder: "e.g. https://app.example.com or main activity",
  },
  security: {
    label: "Package or endpoint",
    placeholder: "e.g. com.example.app or api.example.com",
  },
  ui_ux: {
    label: "Screen or flow",
    placeholder: "e.g. onboarding flow or /checkout",
  },
  automation: {
    label: "Pipeline / suite",
    placeholder: "e.g. main CI pipeline or regression suite",
  },
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function TestTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const meta = getTestTypeMeta(type)
  if (!meta) notFound()

  const runs = await getTestRuns(type as TestType)
  const Icon = getTestIcon(meta.icon)
  const target = TARGET_COPY[type] ?? {
    label: "Target",
    placeholder: "Optional target",
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/dashboard/testing"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Test suites
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-muted",
            meta.accent,
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-4xl tracking-tight text-foreground">
            {meta.name}
          </h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            {meta.description}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Run form */}
        <div className="lg:col-span-3">
          <div className="border border-border bg-card p-6">
            <h2 className="font-display text-2xl tracking-tight text-foreground">
              Run {meta.name.toLowerCase()}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Configure a target and run the suite. Results are saved to your
              report history.
            </p>
            <div className="mt-6">
              <RunTestForm
                testType={meta.type}
                testName={meta.name}
                allowedPlatforms={meta.platforms}
                targetLabel={target.label}
                targetPlaceholder={target.placeholder}
              />
            </div>
          </div>
        </div>

        {/* Past runs */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Previous runs
          </h2>
          {runs.length === 0 ? (
            <p className="mt-4 border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
              No runs yet. Run your first {meta.name.toLowerCase()} to see results
              here.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-border border border-border">
              {runs.map((run) => (
                <Link
                  key={run.id}
                  href={`/dashboard/testing/runs/${run.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {run.appName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatDate(run.createdAt)} · {run.passCount}/
                      {run.passCount + run.warnCount + run.failCount} passed
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-display text-xl leading-none",
                      gradeColor(run.grade),
                    )}
                  >
                    {run.grade}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

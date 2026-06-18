import Link from "next/link"
import { notFound } from "next/navigation"
import { getTestCase, getCaseRuns } from "@/app/actions/test-cases"
import {
  PriorityBadge,
  CaseStatusBadge,
  RunStatusBadge,
  platformIcon,
  PLATFORM_LABEL,
} from "@/components/dashboard/test-case-badges"
import { DeleteTestCaseButton } from "@/components/dashboard/delete-test-case-button"
import { DeviceCloudRunner } from "@/components/dashboard/device-cloud-runner"
import type { TestStep } from "@/lib/ai-cotester"
import { formatDuration } from "@/lib/test-case-engine"
import { ArrowLeft, ArrowRight, Smartphone, Sparkles } from "lucide-react"

function formatDateTime(d: Date | string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function TestCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const testCase = await getTestCase(id)
  if (!testCase) notFound()

  const runs = await getCaseRuns(id)
  const steps = (Array.isArray(testCase.steps) ? testCase.steps : []) as TestStep[]
  const tags = Array.isArray(testCase.tags) ? (testCase.tags as string[]) : []
  const PlatformIcon = platformIcon(testCase.platform)

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/test-cases"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Test case library
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-5 border border-border bg-card p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground">
              <PlatformIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl tracking-tight text-foreground">
                  {testCase.title}
                </h1>
                {testCase.source === "ai" && (
                  <span className="inline-flex items-center gap-1 border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    CoTester
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {testCase.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PriorityBadge priority={testCase.priority} />
                <CaseStatusBadge status={testCase.status} />
                {testCase.lastRunStatus && <RunStatusBadge status={testCase.lastRunStatus} />}
                {tags.map((t) => (
                  <span
                    key={t}
                    className="border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DeleteTestCaseButton caseId={testCase.id} />
        </div>

        {/* Meta */}
        <div className="mt-px grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          <Meta label="Platform" value={PLATFORM_LABEL[testCase.platform] ?? testCase.platform} />
          <Meta label="Steps" value={String(steps.length)} />
          <Meta label="Total runs" value={String(testCase.runCount ?? 0)} />
          <Meta
            label="Last run"
            value={testCase.lastRunAt ? formatDateTime(testCase.lastRunAt) : "—"}
          />
        </div>

        {/* Steps */}
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Test steps
          </h2>
          <div className="mt-4 overflow-hidden border border-border bg-border">
            <div className="grid gap-px">
              {steps.map((s, i) => (
                <div key={i} className="bg-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-border text-xs text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{s.action}</p>
                      <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                        {s.target && (
                          <span>
                            <span className="text-muted-foreground/70">Target: </span>
                            {s.target}
                          </span>
                        )}
                        {s.expected && (
                          <span>
                            <span className="text-muted-foreground/70">Expected: </span>
                            {s.expected}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real device cloud */}
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-foreground" aria-hidden="true" />
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Run on the real device cloud
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a real device or browser to execute this test case against.
          </p>
          <div className="mt-4">
            <DeviceCloudRunner caseId={testCase.id} />
          </div>
        </div>

        {/* Run history */}
        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Run history
          </h2>
          {runs.length === 0 ? (
            <p className="mt-4 border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
              No runs yet. Select a device above to run this test case.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-border border border-border">
              {runs.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/test-cases/${testCase.id}/runs/${r.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent"
                >
                  <RunStatusBadge status={r.status} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {r.deviceName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.passedSteps}/{r.totalSteps} steps passed ·{" "}
                      {formatDuration(r.durationMs)} · {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-5 py-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 truncate text-sm text-foreground">{value}</p>
    </div>
  )
}

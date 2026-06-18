"use client"

import { useMemo, useState } from "react"
import { runTestCaseOnDevice } from "@/app/actions/test-cases"
import { CLOUD_DEVICES, PLATFORM_FACETS, type CloudDevice } from "@/lib/device-cloud"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Smartphone,
  Apple,
  Globe,
  Tablet,
  Monitor,
  Play,
  Loader2,
} from "lucide-react"

function deviceIcon(d: CloudDevice) {
  if (d.platform === "web") return Monitor
  if (d.formFactor === "tablet") return Tablet
  if (d.platform === "ios") return Apple
  return Smartphone
}

const FACET_ICON = { android: Smartphone, ios: Apple, web: Globe } as const

export function DeviceCloudRunner({ caseId }: { caseId: string }) {
  const [facet, setFacet] = useState<string>("all")
  const [selected, setSelected] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const devices = useMemo(() => {
    const list =
      facet === "all" ? CLOUD_DEVICES : CLOUD_DEVICES.filter((d) => d.platform === facet)
    return [...list].sort((a, b) => b.share - a.share)
  }, [facet])

  const run = async () => {
    if (!selected) {
      setError("Select a device to run on.")
      return
    }
    setRunning(true)
    setError(null)
    const fd = new FormData()
    fd.set("caseId", caseId)
    fd.set("deviceId", selected)
    const res = await runTestCaseOnDevice(fd)
    // Redirects on success; only errors return.
    if (res?.error) {
      setError("Could not start the run. Please try again.")
      setRunning(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <FacetButton active={facet === "all"} onClick={() => setFacet("all")}>
          All devices
        </FacetButton>
        {PLATFORM_FACETS.map((f) => {
          const Icon = FACET_ICON[f.value]
          return (
            <FacetButton key={f.value} active={facet === f.value} onClick={() => setFacet(f.value)}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {f.label}
            </FacetButton>
          )
        })}
      </div>

      <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
        {devices.map((d) => {
          const Icon = deviceIcon(d)
          const isSelected = selected === d.id
          const busy = d.availability === "busy"
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelected(d.id)}
              aria-pressed={isSelected}
              className={cn(
                "flex items-start gap-3 bg-card p-4 text-left transition-colors",
                isSelected ? "bg-accent" : "hover:bg-accent/60",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center border",
                  isSelected ? "border-foreground text-foreground" : "border-border text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                  <span
                    className={cn(
                      "shrink-0 text-[10px] uppercase tracking-wider",
                      busy ? "text-yellow-400" : "text-emerald-400",
                    )}
                  >
                    {busy ? "Queued" : "Available"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {d.os}
                  {d.browser ? ` · ${d.browser}` : ""} · {d.resolution}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5">
        <Button type="button" onClick={run} disabled={running || !selected}>
          {running ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Running on device…
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" />
              Run on selected device
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function FacetButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-foreground bg-accent text-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface SelectorScan {
  id: string
  appName: string
  versionName: string | null
  packageName: string | null
  createdAt: Date | string
}

function formatLabel(scan: SelectorScan) {
  const version = scan.versionName ? ` · ${scan.versionName}` : ""
  const date = new Date(scan.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return `${scan.appName}${version} (${date})`
}

export function CompareSelector({
  scans,
  baseId,
  targetId,
}: {
  scans: SelectorScan[]
  baseId?: string
  targetId?: string
}) {
  const router = useRouter()
  const [base, setBase] = useState(baseId ?? "")
  const [target, setTarget] = useState(targetId ?? "")

  function apply(nextBase: string, nextTarget: string) {
    if (nextBase && nextTarget) {
      router.push(
        `/dashboard/compare?base=${encodeURIComponent(
          nextBase,
        )}&target=${encodeURIComponent(nextTarget)}`,
      )
    }
  }

  if (scans.length < 2) {
    return (
      <div className="border border-dashed border-border px-5 py-4 text-sm text-muted-foreground">
        You need at least two completed scans to run a comparison. Run another
        scan to unlock version diffing.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Baseline scan">
        <select
          value={base}
          onChange={(e) => {
            setBase(e.target.value)
            apply(e.target.value, target)
          }}
          className="w-full appearance-none border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors hover:bg-accent focus:border-ring"
        >
          <option value="" disabled>
            Select baseline…
          </option>
          {scans.map((s) => (
            <option key={s.id} value={s.id}>
              {formatLabel(s)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Compare against">
        <select
          value={target}
          onChange={(e) => {
            setTarget(e.target.value)
            apply(base, e.target.value)
          }}
          className="w-full appearance-none border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors hover:bg-accent focus:border-ring"
        >
          <option value="" disabled>
            Select newer scan…
          </option>
          {scans.map((s) => (
            <option key={s.id} value={s.id}>
              {formatLabel(s)}
            </option>
          ))}
        </select>
      </Field>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

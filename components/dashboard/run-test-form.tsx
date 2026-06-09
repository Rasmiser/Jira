"use client"

import type React from "react"
import { useState } from "react"
import { createTestRun } from "@/app/actions/testing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const PLATFORMS = [
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "web", label: "Web" },
  { value: "cross", label: "Cross-platform" },
] as const

export function RunTestForm({
  testType,
  testName,
  allowedPlatforms,
  targetLabel,
  targetPlaceholder,
}: {
  testType: string
  testName: string
  allowedPlatforms: string[]
  targetLabel: string
  targetPlaceholder: string
}) {
  const platformOptions = PLATFORMS.filter((p) =>
    allowedPlatforms.includes(p.value),
  )
  const [appName, setAppName] = useState("")
  const [platform, setPlatform] = useState(platformOptions[0]?.value ?? "android")
  const [target, setTarget] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appName.trim()) {
      setError("Enter an app or build name to continue.")
      return
    }
    setSubmitting(true)
    setError(null)

    const fd = new FormData()
    fd.set("testType", testType)
    fd.set("appName", appName.trim())
    fd.set("platform", platform)
    fd.set("target", target.trim())

    const res = await createTestRun(fd)
    // createTestRun redirects on success; only errors return here.
    if (res?.error) {
      setError("Something went wrong starting the test. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="appName">App / build name</Label>
        <Input
          id="appName"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="My Mobile App"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="target">{targetLabel}</Label>
        <Input
          id="target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={targetPlaceholder}
        />
        <p className="text-xs text-muted-foreground">Optional</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Platform</Label>
        <div className="flex flex-wrap gap-2">
          {platformOptions.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPlatform(p.value)}
              className={cn(
                "border px-4 py-2 text-sm transition-colors",
                platform === p.value
                  ? "border-foreground bg-accent text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Running {testName.toLowerCase()}...
            </>
          ) : (
            `Run ${testName}`
          )}
        </Button>
        <Button asChild variant="ghost" type="button">
          <Link href="/dashboard/testing">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}

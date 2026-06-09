"use client"

import type React from "react"
import { useState } from "react"
import { protectApp } from "@/app/actions/protection"
import { ShieldPicker } from "./shield-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, Smartphone, Apple, PencilLine } from "lucide-react"
import Link from "next/link"

interface ScanOption {
  id: string
  appName: string
  platform: string
  packageName: string | null
  versionName: string | null
}

export function ProtectAppForm({ scans }: { scans: ScanOption[] }) {
  const [source, setSource] = useState<"scan" | "manual">(
    scans.length > 0 ? "scan" : "manual",
  )
  const [selectedScan, setSelectedScan] = useState<string>(scans[0]?.id ?? "")
  const [manualPlatform, setManualPlatform] = useState<"android" | "ios">(
    "android",
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    if (source === "scan") {
      fd.set("scanId", selectedScan)
    } else {
      fd.delete("scanId")
      fd.set("platform", manualPlatform)
    }
    const res = await protectApp(fd)
    if (res?.error) {
      setError("Please provide an app name to continue.")
      setSubmitting(false)
    }
    // success path redirects
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Source selector */}
      {scans.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            App to protect
          </p>
          <div className="mt-3 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSource("scan")}
              className={cn(
                "bg-card px-4 py-3 text-left text-sm font-medium transition-colors",
                source === "scan"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50",
              )}
            >
              From a scan
            </button>
            <button
              type="button"
              onClick={() => setSource("manual")}
              className={cn(
                "bg-card px-4 py-3 text-left text-sm font-medium transition-colors",
                source === "manual"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50",
              )}
            >
              Enter manually
            </button>
          </div>
        </div>
      )}

      {source === "scan" && scans.length > 0 ? (
        <div className="divide-y divide-border border border-border">
          {scans.map((scan) => {
            const active = selectedScan === scan.id
            return (
              <button
                key={scan.id}
                type="button"
                onClick={() => setSelectedScan(scan.id)}
                className={cn(
                  "flex w-full items-center gap-4 px-5 py-3 text-left transition-colors",
                  active ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground">
                  {scan.platform === "ios" ? (
                    <Apple className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">
                    {scan.appName}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {scan.packageName ?? "—"}
                    {scan.versionName ? ` · v${scan.versionName}` : ""}
                  </span>
                </span>
                <span
                  className={cn(
                    "h-4 w-4 shrink-0 rounded-full border",
                    active
                      ? "border-emerald-500 bg-emerald-500/30"
                      : "border-border",
                  )}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="appName">App name</Label>
            <Input
              id="appName"
              name="appName"
              placeholder="My Mobile App"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="packageName">Package / bundle ID</Label>
            <Input
              id="packageName"
              name="packageName"
              placeholder="com.example.app"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="versionName">Version</Label>
            <Input id="versionName" name="versionName" placeholder="1.0.0" />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Platform</Label>
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
              {(["android", "ios"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setManualPlatform(p)}
                  className={cn(
                    "flex items-center justify-center gap-2 bg-card px-4 py-2.5 text-sm font-medium transition-colors",
                    manualPlatform === p
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50",
                  )}
                >
                  {p === "ios" ? (
                    <Apple className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                  )}
                  {p === "ios" ? "iOS" : "Android"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shield configuration */}
      <ShieldPicker />

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
              Applying protection...
            </>
          ) : (
            <>
              <PencilLine className="h-4 w-4" aria-hidden="true" />
              Apply protection
            </>
          )}
        </Button>
        <Button asChild variant="ghost" type="button">
          <Link href="/dashboard/protection">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}

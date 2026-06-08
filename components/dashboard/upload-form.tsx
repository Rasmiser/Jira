"use client"

import type React from "react"
import { useState, useRef } from "react"
import { createScan } from "@/app/actions/scans"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  UploadCloud,
  FileArchive,
  X,
  Loader2,
  ShieldAlert,
  Smartphone,
  Apple,
} from "lucide-react"
import Link from "next/link"

function detectPlatform(name: string): "android" | "ios" | null {
  const lower = name.toLowerCase()
  if (lower.endsWith(".apk") || lower.endsWith(".aab")) return "android"
  if (lower.endsWith(".ipa")) return "ios"
  return null
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadForm({ canScan }: { canScan: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [appName, setAppName] = useState("")
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFile = (f: File) => {
    const detected = detectPlatform(f.name)
    if (!detected) {
      setError("Unsupported file. Upload an .apk, .aab, or .ipa file.")
      return
    }
    setError(null)
    setFile(f)
    setPlatform(detected)
    if (!appName) {
      const base = f.name.replace(/\.(apk|aab|ipa)$/i, "").replace(/[-_]/g, " ")
      setAppName(base.charAt(0).toUpperCase() + base.slice(1))
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const reset = () => {
    setFile(null)
    setPlatform(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !platform || !appName.trim()) {
      setError("Add a file and an app name to continue.")
      return
    }
    setSubmitting(true)
    setError(null)

    const fd = new FormData()
    fd.set("appName", appName.trim())
    fd.set("fileName", file.name)
    fd.set("platform", platform)
    fd.set("fileSize", String(file.size))

    const res = await createScan(fd)
    // createScan redirects on success; only errors return here.
    if (res?.error === "limit_reached") {
      setError("You've reached your monthly scan limit. Upgrade to continue.")
    } else if (res?.error) {
      setError("Something went wrong starting the scan. Please try again.")
    }
    setSubmitting(false)
  }

  if (!canScan) {
    return (
      <div className="flex flex-col items-center justify-center border border-orange-500/40 bg-orange-500/10 px-6 py-16 text-center">
        <ShieldAlert className="h-10 w-10 text-orange-400" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl tracking-tight text-foreground">
          Monthly scan limit reached
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Upgrade your plan to run more scans this month.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/billing">View plans</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Dropzone */}
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center border border-dashed px-6 py-16 text-center transition-colors",
            dragging
              ? "border-foreground bg-accent"
              : "border-border hover:border-muted-foreground hover:bg-accent/50",
          )}
        >
          <UploadCloud
            className="h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-4 font-medium text-foreground">
            Drop your build here, or click to browse
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Supports .apk, .aab (Android) and .ipa (iOS) — up to 500 MB
          </p>
        </button>
      ) : (
        <div className="flex items-center gap-4 border border-border bg-card px-5 py-4">
          <div className="flex h-11 w-11 items-center justify-center border border-border bg-muted text-muted-foreground">
            <FileArchive className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{file.name}</p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              {platform === "ios" ? (
                <Apple className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Smartphone className="h-3 w-3" aria-hidden="true" />
              )}
              {platform === "ios" ? "iOS" : "Android"} · {humanSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".apk,.aab,.ipa"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="appName">App name</Label>
        <Input
          id="appName"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="My Mobile App"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting || !file}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Scanning...
            </>
          ) : (
            "Start security scan"
          )}
        </Button>
        <Button asChild variant="ghost" type="button">
          <Link href="/dashboard">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}

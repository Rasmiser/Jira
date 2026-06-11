"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import {
  Play,
  RotateCcw,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  FileSearch,
  ArrowRight,
  Smartphone,
  Landmark,
  HeartPulse,
} from "lucide-react"

type Severity = "critical" | "high" | "medium" | "low"

type Finding = {
  title: string
  severity: Severity
  standard: string
}

type SampleApp = {
  id: string
  name: string
  platform: string
  icon: typeof Smartphone
  grade: string
  score: number
  findings: Finding[]
}

const severityStyles: Record<Severity, { label: string; dot: string; badge: string }> = {
  critical: { label: "Critical", dot: "bg-rose-500", badge: "bg-rose-100 text-rose-700" },
  high: { label: "High", dot: "bg-orange-500", badge: "bg-orange-100 text-orange-700" },
  medium: { label: "Medium", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
  low: { label: "Low", dot: "bg-slate-400", badge: "bg-slate-100 text-slate-600" },
}

const sampleApps: SampleApp[] = [
  {
    id: "retail",
    name: "ShopFast (demo retail app)",
    platform: "Android • APK",
    icon: Smartphone,
    grade: "D",
    score: 43,
    findings: [
      { title: "Hardcoded API key found in classes.dex", severity: "critical", standard: "MASVS-STORAGE-1" },
      { title: "Session token stored in plaintext SharedPreferences", severity: "high", standard: "MASVS-STORAGE-1" },
      { title: "Missing TLS certificate pinning", severity: "high", standard: "MASVS-NETWORK-1" },
      { title: "Exported activity allows unauthorized intents", severity: "medium", standard: "MASVS-PLATFORM-1" },
      { title: "Debuggable flag enabled in release build", severity: "medium", standard: "MASVS-RESILIENCE-2" },
      { title: "Verbose logging leaks user identifiers", severity: "low", standard: "MASVS-STORAGE-2" },
    ],
  },
  {
    id: "fintech",
    name: "PayWallet (demo banking app)",
    platform: "iOS • IPA",
    icon: Landmark,
    grade: "C",
    score: 61,
    findings: [
      { title: "Keychain item accessible when device unlocked only", severity: "high", standard: "MASVS-STORAGE-1" },
      { title: "No jailbreak or tamper detection present", severity: "high", standard: "MASVS-RESILIENCE-1" },
      { title: "Weak biometric fallback to 4-digit PIN", severity: "medium", standard: "MASVS-AUTH-2" },
      { title: "PII written to crash logs", severity: "medium", standard: "MASVS-STORAGE-2" },
      { title: "Outdated third-party networking SDK", severity: "low", standard: "MASVS-CODE-3" },
    ],
  },
  {
    id: "health",
    name: "CareConnect (demo telehealth app)",
    platform: "Cross-platform",
    icon: HeartPulse,
    grade: "D",
    score: 48,
    findings: [
      { title: "Patient records encrypted with deprecated DES cipher", severity: "critical", standard: "MASVS-CRYPTO-1" },
      { title: "Over-broad location permission requested at launch", severity: "high", standard: "MASVS-PRIVACY-1" },
      { title: "Backup allows extraction of local database", severity: "high", standard: "MASVS-STORAGE-1" },
      { title: "Insecure WebView with JavaScript bridge exposed", severity: "medium", standard: "MASVS-PLATFORM-2" },
      { title: "Missing screenshot prevention on PII screens", severity: "low", standard: "MASVS-PRIVACY-2" },
    ],
  },
]

type Phase = "idle" | "scanning" | "done"

const scanStages = [
  "Unpacking binary…",
  "Running static analysis (SAST)…",
  "Inspecting storage & crypto…",
  "Checking network & permissions…",
  "Mapping findings to OWASP MASVS…",
  "Generating report…",
]

export function LiveDemo() {
  const [selectedId, setSelectedId] = useState(sampleApps[0].id)
  const [phase, setPhase] = useState<Phase>("idle")
  const [progress, setProgress] = useState(0)
  const [stageIndex, setStageIndex] = useState(0)
  const [revealedFindings, setRevealedFindings] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const selectedApp = sampleApps.find((a) => a.id === selectedId) ?? sampleApps[0]

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const reset = useCallback(() => {
    clearTimers()
    setPhase("idle")
    setProgress(0)
    setStageIndex(0)
    setRevealedFindings(0)
  }, [clearTimers])

  const runScan = useCallback(() => {
    clearTimers()
    setPhase("scanning")
    setProgress(0)
    setStageIndex(0)
    setRevealedFindings(0)
    track("demo_scan_started", { app: selectedApp.id })

    const totalMs = 3600
    const tickMs = 60
    const ticks = totalMs / tickMs
    let current = 0

    const interval = setInterval(() => {
      current += 1
      const pct = Math.min(100, Math.round((current / ticks) * 100))
      setProgress(pct)
      setStageIndex(Math.min(scanStages.length - 1, Math.floor((pct / 100) * scanStages.length)))
      if (current >= ticks) {
        clearInterval(interval)
      }
    }, tickMs)
    timers.current.push(interval as unknown as ReturnType<typeof setTimeout>)

    const doneTimer = setTimeout(() => {
      setPhase("done")
      setProgress(100)
      track("demo_scan_completed", { app: selectedApp.id, score: selectedApp.score })
      // progressively reveal findings
      selectedApp.findings.forEach((_, i) => {
        const t = setTimeout(() => setRevealedFindings(i + 1), i * 180)
        timers.current.push(t)
      })
    }, totalMs)
    timers.current.push(doneTimer)
  }, [clearTimers, selectedApp])

  const gradeColor =
    selectedApp.score >= 80 ? "text-emerald-600" : selectedApp.score >= 60 ? "text-amber-600" : "text-rose-600"

  return (
    <section id="live-demo" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Live demo</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            See a scan run in real time
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            Pick a sample app and watch RASMISER analyze it. No upload, no signup — just a taste of the real report.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Sample picker */}
          <div className="lg:col-span-2">
            <p className="text-sm font-medium text-slate-500">1. Choose a sample build</p>
            <div className="mt-3 flex flex-col gap-3">
              {sampleApps.map((app) => {
                const Icon = app.icon
                const active = app.id === selectedId
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(app.id)
                      reset()
                    }}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                    aria-pressed={active}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                        active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">{app.name}</span>
                      <span className="block text-xs text-slate-500">{app.platform}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={runScan}
                disabled={phase === "scanning"}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phase === "scanning" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Scanning…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" aria-hidden="true" /> {phase === "done" ? "Run again" : "Run scan"}
                  </>
                )}
              </button>
              {phase === "done" && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Result panel */}
          <div className="lg:col-span-3">
            <p className="text-sm font-medium text-slate-500">2. Review the report</p>
            <div className="mt-3 min-h-[24rem] rounded-2xl border border-slate-200 bg-slate-50 p-6">
              {phase === "idle" && (
                <div className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    <FileSearch className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <p className="mt-4 max-w-xs text-sm text-slate-500">
                    Press <span className="font-semibold text-slate-700">Run scan</span> to analyze{" "}
                    {selectedApp.name}.
                  </p>
                </div>
              )}

              {phase === "scanning" && (
                <div className="flex h-full min-h-[20rem] flex-col justify-center">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
                    <span className="text-sm font-medium">{scanStages[stageIndex]}</span>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs font-medium text-slate-500">{progress}%</p>
                </div>
              )}

              {phase === "done" && (
                <div>
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Security grade</p>
                      <p className={`text-4xl font-bold ${gradeColor}`}>{selectedApp.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Score</p>
                      <p className="text-2xl font-bold text-slate-900">{selectedApp.score}/100</p>
                      <p className="text-xs text-slate-500">{selectedApp.findings.length} findings</p>
                    </div>
                  </div>

                  <ul className="mt-4 flex flex-col gap-2">
                    {selectedApp.findings.slice(0, revealedFindings).map((finding) => {
                      const s = severityStyles[finding.severity]
                      return (
                        <li
                          key={finding.title}
                          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>
                                {s.label}
                              </span>
                              <span className="font-mono text-xs text-slate-400">{finding.standard}</span>
                            </span>
                            <span className="mt-1 block text-sm text-slate-700">{finding.title}</span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {revealedFindings >= selectedApp.findings.length && (
                    <div className="mt-5 flex flex-col items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <ShieldCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
                        Want this report on your own build?
                      </p>
                      <Link
                        href="/sign-up"
                        onClick={() => track("demo_cta_clicked", { app: selectedApp.id })}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                      >
                        Scan your app free <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-slate-500">
          <ShieldAlert className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          Demo uses pre-recorded findings from sample apps to illustrate the experience. Real scans analyze your
          actual binary.
        </p>
      </div>
    </section>
  )
}

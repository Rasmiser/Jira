// ---------------------------------------------------------------------------
// Test case execution engine
//
// Runs a saved test case's steps against a chosen device and produces a
// deterministic, reproducible result (same case + device => same outcome).
// Mirrors the seeded approach in lib/test-engine.ts so a real device-farm
// backend can be plugged in behind executeTestCase() later.
// ---------------------------------------------------------------------------

import type { TestStep } from "@/lib/ai-cotester"
import type { CloudDevice } from "@/lib/device-cloud"

export type StepStatus = "passed" | "failed"
export type RunStatus = "passed" | "failed" | "flaky"

export interface StepResult {
  index: number
  action: string
  target: string
  expected: string
  status: StepStatus
  note: string | null
  durationMs: number
}

export interface TestCaseRunResult {
  status: RunStatus
  durationMs: number
  passedSteps: number
  failedSteps: number
  totalSteps: number
  stepResults: StepResult[]
}

function seededRandom(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FAILURE_NOTES = [
  "Element was not visible within the wait timeout.",
  "Expected text did not match the rendered content.",
  "Tap target was obscured by an overlapping view.",
  "Navigation did not complete; previous screen remained.",
  "Assertion failed: control was disabled when it should be enabled.",
]

/**
 * Execute a test case against a device. Busy devices and older OS versions are
 * slightly more likely to surface a failed step, keeping results realistic.
 */
export function executeTestCase(params: {
  runId: string
  steps: TestStep[]
  device: CloudDevice
}): TestCaseRunResult {
  const { runId, steps, device } = params
  const rng = seededRandom(runId + device.id + steps.length)

  // Base per-step failure chance, nudged by device conditions.
  let failChance = 0.06
  if (device.availability === "busy") failChance += 0.05
  const osMajor = Number.parseInt(device.osVersion, 10)
  if (!Number.isNaN(osMajor) && osMajor <= 13) failChance += 0.04

  let totalDuration = 0
  const stepResults: StepResult[] = steps.map((s, i) => {
    const roll = rng()
    const durationMs = Math.round(300 + rng() * 2200)
    totalDuration += durationMs
    const failed = roll < failChance
    return {
      index: i,
      action: s.action,
      target: s.target,
      expected: s.expected,
      status: failed ? "failed" : "passed",
      note: failed ? FAILURE_NOTES[Math.floor(rng() * FAILURE_NOTES.length)] : null,
      durationMs,
    }
  })

  const failedSteps = stepResults.filter((r) => r.status === "failed").length
  const passedSteps = stepResults.length - failedSteps

  // A single late failure after passes is treated as "flaky"; multiple or early
  // failures are a hard "failed".
  let status: RunStatus = "passed"
  if (failedSteps === 1 && stepResults[stepResults.length - 1]?.status === "failed") {
    status = "flaky"
  } else if (failedSteps > 0) {
    status = "failed"
  }

  return {
    status,
    durationMs: totalDuration,
    passedSteps,
    failedSteps,
    totalSteps: stepResults.length,
    stepResults,
  }
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const s = ms / 1000
  if (s < 60) return `${s.toFixed(1)}s`
  const m = Math.floor(s / 60)
  const rem = Math.round(s % 60)
  return `${m}m ${rem}s`
}

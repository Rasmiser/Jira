"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import { ArrowRight, ShieldCheck } from "lucide-react"

// Industry reference points (illustrative, based on public breach-cost research).
const PER_RECORD_COST = 165 // approx. cost per exposed record (USD)
const BASE_INCIDENT_COST = 120000 // fixed response, legal, and remediation costs
const BREACH_PROBABILITY_UNSCANNED = 0.28 // annualized likelihood without proactive scanning
const RISK_REDUCTION = 0.7 // proportion of risk mitigated by continuous scanning
const RASMISER_ANNUAL_COST = 360 // $30/mo Team plan

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

const sensitivityOptions = [
  { id: "low", label: "Low (no personal data)", multiplier: 0.5 },
  { id: "medium", label: "Medium (PII, accounts)", multiplier: 1 },
  { id: "high", label: "High (financial / health)", multiplier: 1.8 },
]

export function RoiCalculator() {
  const [activeUsers, setActiveUsers] = useState(50000)
  const [recordsPerUser, setRecordsPerUser] = useState(3)
  const [sensitivity, setSensitivity] = useState("medium")

  const result = useMemo(() => {
    const multiplier = sensitivityOptions.find((s) => s.id === sensitivity)?.multiplier ?? 1
    const exposedRecords = activeUsers * recordsPerUser
    const singleBreachCost = BASE_INCIDENT_COST + exposedRecords * PER_RECORD_COST * multiplier

    const expectedLossUnscanned = singleBreachCost * BREACH_PROBABILITY_UNSCANNED
    const expectedLossScanned = expectedLossUnscanned * (1 - RISK_REDUCTION)
    const annualSavings = expectedLossUnscanned - expectedLossScanned - RASMISER_ANNUAL_COST
    const roiMultiple = annualSavings > 0 ? (annualSavings + RASMISER_ANNUAL_COST) / RASMISER_ANNUAL_COST : 0

    return {
      singleBreachCost,
      expectedLossUnscanned,
      expectedLossScanned,
      annualSavings,
      roiMultiple,
    }
  }, [activeUsers, recordsPerUser, sensitivity])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Your app profile</h2>

        <div className="mt-6 flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="users" className="text-sm font-medium text-slate-700">
                Monthly active users
              </label>
              <span className="text-sm font-semibold text-slate-900">{activeUsers.toLocaleString()}</span>
            </div>
            <input
              id="users"
              type="range"
              min={1000}
              max={1000000}
              step={1000}
              value={activeUsers}
              onChange={(e) => setActiveUsers(Number(e.target.value))}
              className="mt-3 w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="records" className="text-sm font-medium text-slate-700">
                Sensitive records per user
              </label>
              <span className="text-sm font-semibold text-slate-900">{recordsPerUser}</span>
            </div>
            <input
              id="records"
              type="range"
              min={1}
              max={20}
              step={1}
              value={recordsPerUser}
              onChange={(e) => setRecordsPerUser(Number(e.target.value))}
              className="mt-3 w-full accent-blue-600"
            />
          </div>

          <div>
            <span className="text-sm font-medium text-slate-700">Data sensitivity</span>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {sensitivityOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSensitivity(option.id)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    sensitivity === option.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                  aria-pressed={sensitivity === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white sm:p-8">
        <h2 className="text-lg font-semibold">Your estimated exposure</h2>

        <dl className="mt-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <dt className="text-sm text-slate-300">Cost of a single breach</dt>
            <dd className="text-lg font-semibold">{formatCurrency(result.singleBreachCost)}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <dt className="text-sm text-slate-300">Expected annual loss without scanning</dt>
            <dd className="text-lg font-semibold text-rose-300">{formatCurrency(result.expectedLossUnscanned)}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <dt className="text-sm text-slate-300">Expected annual loss with RASMISER</dt>
            <dd className="text-lg font-semibold text-emerald-300">{formatCurrency(result.expectedLossScanned)}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-xl bg-white/5 p-5">
          <p className="text-sm text-slate-300">Estimated annual savings</p>
          <p className="mt-1 text-4xl font-bold text-emerald-400">{formatCurrency(result.annualSavings)}</p>
          {result.roiMultiple > 0 && (
            <p className="mt-2 text-sm text-slate-300">
              That&apos;s roughly{" "}
              <span className="font-semibold text-white">{Math.round(result.roiMultiple).toLocaleString()}x</span> the
              cost of a Team plan ($30/mo).
            </p>
          )}
        </div>

        <Link
          href="/sign-up"
          onClick={() =>
            track("roi_cta_clicked", {
              users: activeUsers,
              savings: Math.round(result.annualSavings),
            })
          }
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Start protecting your app free <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> No credit card required
        </p>
      </div>
    </div>
  )
}

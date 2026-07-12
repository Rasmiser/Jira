"use client"

import { useEffect, useRef, useState } from "react"
import { Shield } from "lucide-react"

type Stat = {
  value: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { value: 40000, suffix: "+", label: "Applications Scanned" },
  { value: 98, suffix: "%", label: "Critical Vulns Detected" },
  { value: 300, suffix: "+", label: "Security Checks" },
  { value: 5, suffix: "min", label: "Average Scan Time" },
]

function useCountUp(target: number, duration = 1800, start = false) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, start])

  return current
}

function StatCard({ stat, animate }: { stat: Stat; animate: boolean }) {
  const count = useCountUp(stat.value, 1800, animate)

  const displayValue =
    stat.value >= 1000
      ? `${(count / 1000).toFixed(count >= 1000 ? 0 : 1)}k`
      : count.toString()

  return (
    <div className="flex flex-col items-center gap-1 px-6 py-6 text-center">
      <span className="text-4xl font-bold tabular-nums text-slate-900">
        {displayValue}
        <span className="text-blue-600">{stat.suffix}</span>
      </span>
      <span className="text-sm text-slate-500">{stat.label}</span>
    </div>
  )
}

export function TrustBar() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="border-y border-slate-200 bg-white py-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} animate={visible} />
          ))}
        </div>

        {/* OWASP MASVS compliant badge row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 pt-5 pb-3">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Compliant with</span>
          {["OWASP MASVS", "CWE", "CVSS v3.1", "GDPR", "HIPAA"].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
            >
              <Shield className="h-3 w-3 text-blue-600" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

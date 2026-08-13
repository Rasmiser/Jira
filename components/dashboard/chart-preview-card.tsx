"use client"

import { Clock } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

export type ChartPoint = { label: string; value: number }

const ACCENT_BG = {
  sky: "bg-sky-600",
  emerald: "bg-emerald-600",
  ink: "bg-zinc-900 border border-zinc-800",
} as const

export function ChartPreviewCard({
  variant,
  accent,
  data,
  title,
  subtitle,
  meta,
}: {
  variant: "bar" | "line"
  accent: keyof typeof ACCENT_BG
  data: ChartPoint[]
  title: string
  subtitle: string
  meta: string
}) {
  return (
    <div className="border border-border bg-card">
      <div className={cn("h-44 px-4 pb-3 pt-4", ACCENT_BG[accent])}>
        <ResponsiveContainer width="100%" height="100%">
          {variant === "bar" ? (
            <BarChart data={data} barCategoryGap="30%">
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.85)", fontSize: 12 }}
              />
              <YAxis hide domain={[0, "auto"]} />
              <Bar
                dataKey="value"
                fill="rgba(255,255,255,0.85)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.85)", fontSize: 12 }}
              />
              <YAxis hide domain={[0, "auto"]} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={2}
                dot={{ r: 3, fill: "white", strokeWidth: 0 }}
                activeDot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="px-5 py-5">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {meta}
        </div>
      </div>
    </div>
  )
}

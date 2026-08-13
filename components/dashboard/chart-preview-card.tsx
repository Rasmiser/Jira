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
  sky: "bg-gradient-to-b from-sky-500/20 to-transparent",
  emerald: "bg-gradient-to-b from-emerald-500/20 to-transparent",
  ink: "bg-gradient-to-b from-[oklch(0.78_0.15_195/0.16)] to-transparent",
} as const

const ACCENT_LINE = {
  sky: "rgb(56 189 248)",
  emerald: "rgb(52 211 153)",
  ink: "rgb(103, 232, 249)",
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
  const lineColor = ACCENT_LINE[accent]

  return (
    <div className="signal-card overflow-hidden">
      <div className={cn("h-44 px-4 pb-3 pt-4", ACCENT_BG[accent])}>
        <ResponsiveContainer width="100%" height="100%">
          {variant === "bar" ? (
            <BarChart data={data} barCategoryGap="30%">
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
              />
              <YAxis hide domain={[0, "auto"]} />
              <Bar dataKey="value" fill={lineColor} radius={[2, 2, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
              />
              <YAxis hide domain={[0, "auto"]} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
                activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="px-5 py-5">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="signal-divider mt-4 flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {meta}
        </div>
      </div>
    </div>
  )
}

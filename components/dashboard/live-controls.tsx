"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { simulateTraffic } from "@/app/actions/protection"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Activity, Loader2 } from "lucide-react"

export function LiveControls() {
  const router = useRouter()
  const [live, setLive] = useState(false)
  const [isPending, startTransition] = useTransition()

  // While live mode is on, generate a fresh burst of traffic on an interval
  // and refresh the server component to stream it in.
  useEffect(() => {
    if (!live) return
    const tick = () =>
      startTransition(async () => {
        await simulateTraffic()
        router.refresh()
      })
    tick()
    const interval = setInterval(tick, 5000)
    return () => clearInterval(interval)
  }, [live, router])

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            live ? "animate-pulse bg-emerald-400" : "bg-muted-foreground",
          )}
          aria-hidden="true"
        />
        {live ? "Live" : "Paused"}
      </span>
      <Button
        type="button"
        variant={live ? "secondary" : "default"}
        onClick={() => setLive((v) => !v)}
      >
        {isPending && live ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Activity className="h-4 w-4" aria-hidden="true" />
        )}
        {live ? "Stop live feed" : "Go live"}
      </Button>
    </div>
  )
}

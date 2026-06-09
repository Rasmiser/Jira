"use client"

import { useState, useTransition } from "react"
import { simulateTraffic } from "@/app/actions/protection"
import { Button } from "@/components/ui/button"
import { Activity, Loader2 } from "lucide-react"

export function SimulateButton() {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await simulateTraffic()
          setDone(true)
          setTimeout(() => setDone(false), 1500)
        })
      }
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Activity className="h-4 w-4" aria-hidden="true" />
      )}
      {done ? "Traffic generated" : "Simulate live traffic"}
    </Button>
  )
}

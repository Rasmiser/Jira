"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toggleAppStatus, deleteProtectedApp } from "@/app/actions/protection"
import { Button } from "@/components/ui/button"
import { Pause, Play, Trash2, Loader2 } from "lucide-react"

export function AppControls({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(() => toggleAppStatus(id))}
      >
        {status === "paused" ? (
          <>
            <Play className="h-4 w-4" aria-hidden="true" />
            Resume
          </>
        ) : (
          <>
            <Pause className="h-4 w-4" aria-hidden="true" />
            Pause
          </>
        )}
      </Button>

      {confirming ? (
        <Button
          type="button"
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await deleteProtectedApp(id)
              router.push("/dashboard/protection")
            })
          }
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
          Confirm remove
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setConfirming(true)}
          aria-label="Remove protection"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

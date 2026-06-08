"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteScan } from "@/app/actions/scans"
import { Trash2, Loader2 } from "lucide-react"

export function DeleteScanButton({ scanId }: { scanId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteScan(scanId)
      router.push("/dashboard")
      router.refresh()
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="inline-flex items-center gap-2 border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
          Confirm delete
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
      Delete
    </button>
  )
}

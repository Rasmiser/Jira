"use client"

import { useState } from "react"
import {
  SHIELDS,
  PROTECTION_LEVELS,
  defaultShieldsForLevel,
  type ProtectionLevel,
} from "@/lib/shield-engine"
import { cn } from "@/lib/utils"
import { Check, ShieldCheck } from "lucide-react"

const LEVELS: ProtectionLevel[] = ["standard", "advanced", "maximum"]

export function ShieldPicker({
  defaultLevel = "advanced",
  defaultShields,
}: {
  defaultLevel?: ProtectionLevel
  defaultShields?: string[]
}) {
  const [level, setLevel] = useState<ProtectionLevel>(defaultLevel)
  const [selected, setSelected] = useState<string[]>(
    defaultShields ?? defaultShieldsForLevel(defaultLevel),
  )

  function chooseLevel(next: ProtectionLevel) {
    setLevel(next)
    setSelected(defaultShieldsForLevel(next))
  }

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-6">
      {/* hidden inputs so the values submit with the parent form */}
      <input type="hidden" name="protectionLevel" value={level} />
      {selected.map((id) => (
        <input key={id} type="hidden" name="shields" value={id} />
      ))}

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Protection level
        </p>
        <div className="mt-3 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          {LEVELS.map((lvl) => {
            const active = level === lvl
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => chooseLevel(lvl)}
                className={cn(
                  "bg-card px-4 py-4 text-left transition-colors",
                  active ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {PROTECTION_LEVELS[lvl].name}
                  </span>
                  {active && (
                    <ShieldCheck
                      className="h-4 w-4 text-emerald-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {PROTECTION_LEVELS[lvl].description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Shields ({selected.length})
        </p>
        <div className="mt-3 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {SHIELDS.map((shield) => {
            const on = selected.includes(shield.id)
            return (
              <button
                key={shield.id}
                type="button"
                onClick={() => toggle(shield.id)}
                aria-pressed={on}
                className={cn(
                  "flex gap-3 bg-card px-4 py-4 text-left transition-colors",
                  on ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border",
                    on
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                      : "border-border text-transparent",
                  )}
                  aria-hidden="true"
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">
                    {shield.name}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {shield.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

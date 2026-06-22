"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createProject } from "@/app/actions/localization"
import {
  CONTENT_TYPES,
  TONES,
  SOURCE_LOCALES,
  TARGET_LOCALES,
  defaultSegments,
  localeLabel,
  type ContentType,
  type Tone,
} from "@/lib/locales"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Loader2, Plus, X, Check } from "lucide-react"

const SEGMENT_LABELS: Record<string, string> = {
  title: "Title",
  subtitle: "Subtitle / Promo",
  description: "Description",
  keywords: "Keywords",
  whats_new: "What's new",
  cta_primary: "Primary button",
  cta_secondary: "Secondary button",
  empty_state: "Empty state",
  error_generic: "Generic error",
}

function labelFor(key: string) {
  return SEGMENT_LABELS[key] ?? key.replace(/[-_]/g, " ")
}

export function NewProjectForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [contentType, setContentType] = useState<ContentType>("store_listing")
  const [platform, setPlatform] = useState("android")
  const [sourceLocale, setSourceLocale] = useState("en")
  const [tone, setTone] = useState<Tone>("neutral")
  const [segments, setSegments] = useState(() => defaultSegments("store_listing"))
  const [targets, setTargets] = useState<string[]>(["es", "fr", "de", "ja"])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const switchType = (type: ContentType) => {
    setContentType(type)
    setSegments(defaultSegments(type))
  }

  const updateSegment = (i: number, field: "key" | "text", value: string) => {
    setSegments((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    )
  }

  const addSegment = () =>
    setSegments((prev) => [...prev, { key: `custom_${prev.length + 1}`, text: "" }])

  const removeSegment = (i: number) =>
    setSegments((prev) => prev.filter((_, idx) => idx !== i))

  const toggleTarget = (code: string) =>
    setTargets((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const filled = segments.filter((s) => s.key.trim() && s.text.trim())
    if (!name.trim()) {
      setError("Give your project a name.")
      return
    }
    if (filled.length === 0) {
      setError("Add source text to at least one segment.")
      return
    }
    if (targets.length === 0) {
      setError("Select at least one target locale.")
      return
    }

    setSubmitting(true)
    const res = await createProject({
      name,
      contentType,
      platform,
      sourceLocale,
      tone,
      segments,
      targetLocales: targets,
    })
    if (res?.error) {
      setError("Could not create the project. Check your inputs and try again.")
      setSubmitting(false)
      return
    }
    if (res?.id) {
      router.push(`/dashboard/localization/${res.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-10">
      {/* Basics */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Project name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme App — App Store listing"
            required
          />
        </div>

        <div>
          <Label>Content type</Label>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {CONTENT_TYPES.map((t) => {
              const active = contentType === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => switchType(t.id)}
                  className={cn(
                    "flex flex-col items-start border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-foreground bg-accent"
                      : "border-border hover:border-muted-foreground",
                  )}
                >
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                  <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            label="Platform"
            value={platform}
            onChange={setPlatform}
            options={[
              { value: "android", label: "Android" },
              { value: "ios", label: "iOS" },
              { value: "cross", label: "Cross-platform" },
            ]}
          />
          <SelectField
            label="Source language"
            value={sourceLocale}
            onChange={setSourceLocale}
            options={SOURCE_LOCALES.map((l) => ({
              value: l.code,
              label: localeLabel(l.code),
            }))}
          />
          <SelectField
            label="Tone"
            value={tone}
            onChange={(v) => setTone(v as Tone)}
            options={TONES.map((t) => ({ value: t.id, label: t.label }))}
          />
        </div>
      </section>

      {/* Source segments */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Source content
          </h2>
          <Button type="button" variant="ghost" size="sm" onClick={addSegment}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add field
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {segments.map((seg, i) => (
            <div key={i} className="border border-border bg-card px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <Input
                  aria-label="Field key"
                  value={seg.key}
                  onChange={(e) => updateSegment(i, "key", e.target.value)}
                  className="h-8 max-w-[220px] font-mono text-xs"
                  placeholder="field_key"
                />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{labelFor(seg.key)}</span>
                  <button
                    type="button"
                    onClick={() => removeSegment(i)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Remove field"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <Textarea
                value={seg.text}
                onChange={(e) => updateSegment(i, "text", e.target.value)}
                placeholder="Enter the source text to translate…"
                className="mt-3 min-h-[64px]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Target locales */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Target locales
          </h2>
          <span className="text-xs text-muted-foreground">{targets.length} selected</span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {TARGET_LOCALES.map((l) => {
            const active = targets.includes(l.code)
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => toggleTarget(l.code)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between gap-2 border px-3 py-2 text-left text-sm transition-colors",
                  active
                    ? "border-foreground bg-accent text-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground",
                )}
              >
                <span className="truncate">
                  {l.language}{" "}
                  <span className="text-xs text-muted-foreground">· {l.region}</span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </section>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Creating…
            </>
          ) : (
            "Create project"
          )}
        </Button>
        <Button asChild variant="ghost" type="button">
          <Link href="/dashboard/localization">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

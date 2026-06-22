"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { localizeSchema } from "@/lib/ai-localize"
import { addLocale, deleteProject } from "@/app/actions/localization"
import { TARGET_LOCALES, localeLabel, isRtl } from "@/lib/locales"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  Loader2,
  Check,
  Copy,
  Plus,
  Trash2,
  Globe2,
  AlertTriangle,
} from "lucide-react"

interface TranslationSegment {
  key: string
  source: string
  translated: string
  note: string | null
}

interface Translation {
  id: string
  locale: string
  localeName: string
  status: string
  segments: TranslationSegment[]
  adaptationNotes: string | null
  qualityScore: number | null
}

interface Project {
  id: string
  name: string
  contentType: string
  platform: string
  sourceLocale: string
  targetLocales: string[]
  tone: string
}

export function ProjectWorkspace({
  project,
  translations,
}: {
  project: Project
  translations: Translation[]
}) {
  const router = useRouter()
  const [activeId, setActiveId] = useState(translations[0]?.id ?? null)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const active = translations.find((t) => t.id === activeId) ?? translations[0] ?? null

  const availableToAdd = useMemo(
    () => TARGET_LOCALES.filter((l) => !project.targetLocales.includes(l.code)),
    [project.targetLocales],
  )

  const handleAdd = async (code: string) => {
    setAdding(true)
    await addLocale(project.id, code)
    setAdding(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm("Delete this localization project and all its translations?")) return
    setDeleting(true)
    await deleteProject(project.id)
    router.push("/dashboard/localization")
  }

  if (!active) {
    return (
      <div className="mt-8 border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        No locales on this project yet.
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Locale rail */}
      <aside className="flex flex-col gap-2">
        <h2 className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Locales
        </h2>
        <div className="flex flex-col gap-1">
          {translations.map((t) => {
            const isActive = t.id === active.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "flex items-center justify-between gap-2 border px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "border-foreground bg-accent text-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground",
                )}
              >
                <span className="truncate">{t.localeName}</span>
                {t.status === "completed" ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                ) : t.status === "translating" ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" />
                ) : null}
              </button>
            )
          })}
        </div>

        {availableToAdd.length > 0 && (
          <AddLocale
            options={availableToAdd.map((l) => ({ code: l.code, label: localeLabel(l.code) }))}
            onAdd={handleAdd}
            busy={adding}
          />
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="mt-4 inline-flex items-center gap-2 px-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete project
        </button>
      </aside>

      {/* Active locale editor */}
      <LocaleEditor key={active.id} translation={active} onSaved={() => router.refresh()} />
    </div>
  )
}

function AddLocale({
  options,
  onAdd,
  busy,
}: {
  options: { code: string; label: string }[]
  onAdd: (code: string) => void
  busy: boolean
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(options[0]?.code ?? "")

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-1 justify-start"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add locale
      </Button>
    )
  }

  return (
    <div className="mt-1 flex flex-col gap-2 border border-border bg-card p-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-foreground"
      >
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            onAdd(value)
            setOpen(false)
          }}
          disabled={busy || !value}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Add"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function LocaleEditor({
  translation,
  onSaved,
}: {
  translation: Translation
  onSaved: () => void
}) {
  const [copied, setCopied] = useState(false)
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/ai-localize",
    schema: localizeSchema,
  })

  // Prefer the live streaming object; fall back to the persisted translation.
  // Match streamed entries by key, then fall back to positional order since the
  // model may format keys slightly differently than the source.
  const streamed = object?.segments
  const liveByKey = new Map(
    (streamed ?? []).filter(Boolean).map((s) => [s!.key, s]),
  )

  const rows = translation.segments.map((seg, i) => {
    const live = liveByKey.get(seg.key) ?? streamed?.[i]
    return {
      key: seg.key,
      source: seg.source,
      translated: (live?.translated ?? seg.translated) || "",
      note: live?.note ?? seg.note ?? null,
    }
  })

  const adaptationNotes = object?.adaptationNotes ?? translation.adaptationNotes
  const qualityScore = object?.qualityScore ?? translation.qualityScore
  const rtl = isRtl(translation.locale)
  const hasTranslation =
    translation.status === "completed" || Boolean(streamed) || isLoading

  const handleRun = () => {
    submit({ translationId: translation.id })
  }

  const handleCopy = async () => {
    const text = rows.map((r) => `[${r.key}]\n${r.translated}`).join("\n\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // When a stream finishes, refresh server data so persisted state is in sync.
  if (!isLoading && streamed && translation.status !== "completed") {
    queueMicrotask(onSaved)
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-foreground" aria-hidden="true" />
          <h2 className="font-display text-2xl tracking-tight text-foreground">
            {translation.localeName}
          </h2>
          {qualityScore != null && (
            <span className="border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-emerald-400">
              {qualityScore}/100 quality
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasTranslation && !isLoading && (
            <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
          {isLoading && (
            <Button type="button" variant="ghost" size="sm" onClick={() => stop()}>
              Stop
            </Button>
          )}
          <Button
            type="button"
            variant={hasTranslation ? "secondary" : "default"}
            size="sm"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            )}
            {isLoading
              ? "Translating"
              : translation.status === "completed"
                ? "Re-translate"
                : "Translate & adapt"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Translation failed. Please try again.
        </div>
      )}

      {adaptationNotes && (
        <div className="mt-4 border border-border bg-muted px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Adaptation notes
          </p>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-foreground">
            {adaptationNotes}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.key} className="border border-border bg-card">
            <div className="border-b border-border px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">{row.key}</span>
            </div>
            <div className="grid gap-px bg-border md:grid-cols-2">
              <div className="bg-card px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Source
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {row.source}
                </p>
              </div>
              <div className="bg-card px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {translation.localeName}
                </p>
                <p
                  dir={rtl ? "rtl" : "ltr"}
                  className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                >
                  {row.translated || (
                    <span className="text-muted-foreground">
                      {isLoading ? "Translating…" : "Not translated yet."}
                    </span>
                  )}
                </p>
                {row.note && (
                  <p className="mt-2 text-xs italic text-muted-foreground">{row.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

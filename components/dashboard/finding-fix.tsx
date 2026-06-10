"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useState } from "react"
import { fixSchema } from "@/lib/ai-fix"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertTriangle, Check, Copy } from "lucide-react"

interface CachedFix {
  summary: string | null
  code: string | null
  language: string | null
}

export function FindingFix({
  findingId,
  cached,
}: {
  findingId: string
  cached: CachedFix
}) {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/ai-fix",
    schema: fixSchema,
  })
  const [copied, setCopied] = useState(false)

  const hasCached = Boolean(cached.code)
  // Live stream takes precedence once a generation has started.
  const live = object
  const whyItMatters = live?.whyItMatters
  const fixSummary = live?.fixSummary ?? (hasCached ? cached.summary : undefined)
  const language = live?.language ?? (hasCached ? cached.language : undefined)
  const codeFix = live?.codeFix ?? (hasCached ? cached.code : undefined)
  const verification = live?.verification

  const hasResult = Boolean(codeFix) || isLoading

  async function copyCode() {
    if (!codeFix) return
    try {
      await navigator.clipboard.writeText(codeFix)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            AI fix recommendation
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant={hasResult ? "secondary" : "default"}
          disabled={isLoading}
          onClick={() => submit({ findingId })}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isLoading
            ? "Generating"
            : hasResult
              ? "Regenerate fix"
              : hasCached
                ? "Show generated fix"
                : "Generate fix"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Could not generate a fix. Please try again.
        </div>
      )}

      {!hasResult && !error && (
        <p className="px-4 py-4 text-sm leading-relaxed text-muted-foreground">
          Generate an exact, copy-pasteable code fix for this finding, tailored
          to the app&apos;s platform, with an explanation of why it matters.
        </p>
      )}

      {hasResult && (
        <div className="space-y-4 px-4 py-4">
          {whyItMatters && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Why it matters
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                {whyItMatters}
              </p>
            </div>
          )}
          {fixSummary && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recommended fix
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                {fixSummary}
              </p>
            </div>
          )}
          {codeFix ? (
            <div className="overflow-hidden border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {language ?? "code"}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3 w-3" aria-hidden="true" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto bg-background px-3 py-3 text-xs leading-relaxed text-foreground">
                <code>{codeFix}</code>
              </pre>
            </div>
          ) : (
            isLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                Writing the fix…
              </div>
            )
          )}
          {verification && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Verify
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                {verification}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

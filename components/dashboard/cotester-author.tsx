"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { testCaseSchema } from "@/lib/ai-cotester"
import { createTestCase } from "@/app/actions/test-cases"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  Plus,
  Trash2,
  Wand2,
} from "lucide-react"

interface Step {
  action: string
  target: string
  expected: string
}

const PLATFORMS = [
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "web", label: "Web" },
  { value: "cross", label: "Cross-platform" },
] as const

const PRIORITIES = ["low", "medium", "high", "critical"] as const

const EXAMPLES = [
  "A user logs in with valid email and password and lands on the dashboard.",
  "A shopper adds two items to the cart and completes checkout with a saved card.",
  "A new user signs up, verifies their email, and sets up their profile.",
]

export function CoTesterAuthor() {
  const router = useRouter()

  // AI authoring inputs
  const [description, setDescription] = useState("")
  const [genPlatform, setGenPlatform] = useState<string>("cross")
  const [appName, setAppName] = useState("")

  // Editable test case (populated by AI or filled manually)
  const [title, setTitle] = useState("")
  const [scenario, setScenario] = useState("")
  const [platform, setPlatform] = useState("cross")
  const [priority, setPriority] = useState<string>("medium")
  const [tags, setTags] = useState("")
  const [steps, setSteps] = useState<Step[]>([])
  const [source, setSource] = useState<"ai" | "manual">("manual")

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const { submit, isLoading, error } = useObject({
    api: "/api/ai-cotester",
    schema: testCaseSchema,
    onFinish: ({ object }) => {
      if (!object) return
      setSource("ai")
      setTitle(object.title ?? "")
      setScenario(object.scenario ?? "")
      setPlatform(object.platform ?? "cross")
      setPriority(object.priority ?? "medium")
      setTags((object.tags ?? []).join(", "))
      setSteps(
        (object.steps ?? []).map((s) => ({
          action: s?.action ?? "",
          target: s?.target ?? "",
          expected: s?.expected ?? "",
        })),
      )
    },
  })

  const generate = () => {
    if (description.trim().length < 8) return
    submit({ description: description.trim(), platform: genPlatform, appName: appName.trim() })
  }

  const updateStep = (i: number, key: keyof Step, value: string) => {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)))
  }
  const addStep = () => setSteps((prev) => [...prev, { action: "", target: "", expected: "" }])
  const removeStep = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i))

  const hasCase = title.trim() !== "" || steps.length > 0

  const save = async () => {
    const cleanSteps = steps
      .map((s) => ({
        action: s.action.trim(),
        target: s.target.trim(),
        expected: s.expected.trim(),
      }))
      .filter((s) => s.action)

    if (!title.trim() || !scenario.trim()) {
      setSaveError("Add a title and scenario before saving.")
      return
    }
    if (cleanSteps.length === 0) {
      setSaveError("Add at least one step with an action.")
      return
    }
    setSaving(true)
    setSaveError(null)

    const fd = new FormData()
    fd.set("title", title.trim())
    fd.set("description", scenario.trim())
    fd.set("platform", platform)
    fd.set("priority", priority)
    fd.set("status", "ready")
    fd.set("source", source)
    fd.set("tags", tags)
    fd.set("steps", JSON.stringify(cleanSteps))

    const res = await createTestCase(fd)
    if (res?.error) {
      setSaveError("Could not save the test case. Please try again.")
      setSaving(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* AI authoring */}
      <div className="lg:col-span-2">
        <div className="border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-foreground" aria-hidden="true" />
            <h2 className="font-display text-xl tracking-tight text-foreground">
              CoTester
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what you want to verify in plain English. CoTester drafts a
            structured, runnable test case you can review and save.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="appName">App name (optional)</Label>
              <Input
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My Mobile App"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">What should this test verify?</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A user logs in with valid credentials and reaches the dashboard."
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Target platform</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setGenPlatform(p.value)}
                    className={cn(
                      "border px-3 py-1.5 text-xs transition-colors",
                      genPlatform === p.value
                        ? "border-foreground bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="button" onClick={generate} disabled={isLoading || description.trim().length < 8}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Generating test case…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Generate with AI
                </>
              )}
            </Button>

            {error && (
              <p className="flex items-center gap-2 text-sm text-destructive" role="alert">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Generation failed. Please try again.
              </p>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Try an example
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setDescription(ex)}
                    className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    &ldquo;{ex}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable test case */}
      <div className="lg:col-span-3">
        <div className="border border-border bg-card p-6">
          <h2 className="font-display text-xl tracking-tight text-foreground">
            Test case
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasCase
              ? "Review and edit the generated case, then save it to your library."
              : "Generate a case with CoTester, or fill this in manually."}
          </p>

          <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Successful login with valid credentials"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="scenario">Scenario</Label>
              <Textarea
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="What this test verifies and why it matters."
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Platform</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPlatform(p.value)}
                      className={cn(
                        "border px-2.5 py-1 text-xs transition-colors",
                        platform === p.value
                          ? "border-foreground bg-accent text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "border px-2.5 py-1 text-xs capitalize transition-colors",
                        priority === p
                          ? "border-foreground bg-accent text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="authentication, smoke, regression"
              />
              <p className="text-xs text-muted-foreground">Comma-separated</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Steps</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addStep}>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add step
                </Button>
              </div>

              {steps.length === 0 ? (
                <p className="border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  No steps yet. Generate with CoTester or add steps manually.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {steps.map((s, i) => (
                    <div key={i} className="border border-border bg-background p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Step {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeStep(i)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Remove step ${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        <Input
                          value={s.action}
                          onChange={(e) => updateStep(i, "action", e.target.value)}
                          placeholder="Action — e.g. Tap the Sign in button"
                        />
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Input
                            value={s.target}
                            onChange={(e) => updateStep(i, "target", e.target.value)}
                            placeholder="Target — e.g. Login screen"
                          />
                          <Input
                            value={s.expected}
                            onChange={(e) => updateStep(i, "expected", e.target.value)}
                            placeholder="Expected — e.g. Dashboard is shown"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {saveError && (
              <p className="text-sm text-destructive" role="alert">
                {saveError}
              </p>
            )}

            <div className="flex items-center gap-3 border-t border-border pt-4">
              <Button type="button" onClick={save} disabled={saving || !hasCase}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  "Save to library"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

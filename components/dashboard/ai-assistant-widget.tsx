"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react"

const SUGGESTIONS = [
  "How do I run my first scan?",
  "What's the difference between Scan and Protection?",
  "How do I connect Jira?",
]

export function AiAssistantWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/assistant" }),
  })

  const isBusy = status === "submitted" || status === "streaming"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isBusy])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isBusy) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open help assistant"
        className={cn(
          "signal-btn fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full p-0 shadow-lg md:bottom-8 md:right-8",
          open && "hidden",
        )}
      >
        <Bot className="h-6 w-6" aria-hidden="true" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="signal-divider flex w-full flex-col gap-0 border-l bg-[oklch(0.045_0.01_260)] p-0 sm:max-w-md"
        >
          <SheetHeader className="signal-divider border-b px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="signal-icon-box flex h-9 w-9 shrink-0 items-center justify-center">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <SheetTitle className="font-mono text-sm tracking-wider">
                  RASMISER assistant
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Ask how to use the dashboard
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Hi! I can help you find your way around RASMISER — scans,
                  protection, compliance, testing, and more.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="signal-card px-3 py-2 text-left text-sm text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start gap-2.5",
                      message.role === "user" && "flex-row-reverse",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center border",
                        message.role === "user"
                          ? "border-border bg-muted text-muted-foreground"
                          : "signal-icon-box",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[85%] px-3 py-2 text-sm leading-relaxed",
                        message.role === "user"
                          ? "bg-muted text-foreground"
                          : "signal-card text-foreground",
                      )}
                    >
                      {message.parts.map((part, index) =>
                        part.type === "text" ? (
                          <span key={index} className="whitespace-pre-wrap">
                            {part.text}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </div>
                ))}
                {isBusy && (
                  <div className="flex items-center gap-2.5">
                    <div className="signal-icon-box flex h-7 w-7 shrink-0 items-center justify-center">
                      <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div className="signal-card flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Thinking…
                    </div>
                  </div>
                )}
                {error && (
                  <p className="text-xs text-destructive">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
            className="signal-divider flex items-end gap-2 border-t px-4 py-3"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing &&
                  e.nativeEvent.keyCode !== 229
                ) {
                  e.preventDefault()
                  submit(input)
                }
              }}
              placeholder="Ask a question…"
              rows={1}
              className="min-h-9 flex-1 resize-none bg-transparent"
              disabled={isBusy}
              aria-label="Message"
            />
            <Button
              type="submit"
              size="icon"
              className="signal-btn h-9 w-9 shrink-0"
              disabled={isBusy || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}

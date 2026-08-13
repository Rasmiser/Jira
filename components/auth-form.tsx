"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Fingerprint, ArrowRight } from "lucide-react"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === "sign-up"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = isSignUp
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })

      if (error) {
        setLoading(false)
        setError(
          error.message ??
            (isSignUp
              ? "Could not create your account. This email may already be in use."
              : "Invalid email or password."),
        )
        return
      }

      // Use a full navigation so the server reliably reads the freshly-set
      // session cookie (a soft router.push can race the cookie in the preview iframe).
      window.location.href = "/dashboard"
    } catch (err) {
      setLoading(false)
      setError("Something went wrong. Please try again.")
      console.log("[v0] auth error:", err)
    }
  }

  if (isSignUp) {
    return (
      <main className="relative min-h-svh signal-grid-bg flex flex-col items-center justify-center px-4 overflow-hidden">
        <div
          className="signal-glow-orb h-[420px] w-[420px] -top-40 -left-32 bg-[oklch(0.78_0.15_195/0.10)]"
          aria-hidden="true"
        />
        <div
          className="signal-glow-orb h-[380px] w-[380px] -bottom-32 -right-24 bg-[oklch(0.78_0.15_195/0.08)]"
          aria-hidden="true"
        />

        <Link
          href="/"
          className="relative z-10 mb-8 flex items-center gap-2 text-foreground"
        >
          <ShieldCheck className="h-5 w-5 text-[oklch(0.78_0.15_195)]" aria-hidden="true" />
          <span className="font-mono text-xl tracking-[0.2em]">RASMISER</span>
        </Link>

        <div className="signal-panel relative z-10 w-full max-w-sm p-8">
          <div className="signal-scanline" aria-hidden="true" />
          <span className="signal-corner top-3 left-3 border-l border-t" aria-hidden="true" />
          <span className="signal-corner top-3 right-3 border-r border-t" aria-hidden="true" />
          <span className="signal-corner bottom-3 left-3 border-l border-b" aria-hidden="true" />
          <span className="signal-corner bottom-3 right-3 border-r border-b" aria-hidden="true" />

          <div className="relative mb-8">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.15_195)]">
              <Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />
              New identity
            </div>
            <h1 className="signal-cursor font-display text-3xl tracking-tight text-foreground text-balance">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Start scanning your mobile apps for security risks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Ada Lovelace"
                className="signal-input font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="signal-input font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="signal-input font-mono"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="signal-btn w-full mt-2 font-mono uppercase tracking-widest"
            >
              {loading ? (
                "Initializing..."
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          <p className="relative mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[oklch(0.78_0.15_195)] font-medium underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-svh signal-grid-bg flex flex-col items-center justify-center px-4 overflow-hidden">
      <div
        className="signal-glow-orb h-[420px] w-[420px] -top-40 -left-32 bg-[oklch(0.78_0.15_195/0.10)]"
        aria-hidden="true"
      />
      <div
        className="signal-glow-orb h-[380px] w-[380px] -bottom-32 -right-24 bg-[oklch(0.78_0.15_195/0.08)]"
        aria-hidden="true"
      />

      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2 text-foreground"
      >
        <ShieldCheck className="h-5 w-5 text-[oklch(0.78_0.15_195)]" aria-hidden="true" />
        <span className="font-mono text-xl tracking-[0.2em]">RASMISER</span>
      </Link>

      <div className="signal-panel relative z-10 w-full max-w-sm p-8">
        <div className="signal-scanline" aria-hidden="true" />
        <span className="signal-corner top-3 left-3 border-l border-t" aria-hidden="true" />
        <span className="signal-corner top-3 right-3 border-r border-t" aria-hidden="true" />
        <span className="signal-corner bottom-3 left-3 border-l border-b" aria-hidden="true" />
        <span className="signal-corner bottom-3 right-3 border-r border-b" aria-hidden="true" />

        <div className="relative mb-8">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.15_195)]">
            <Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />
            Returning identity
          </div>
          <h1 className="signal-cursor font-display text-3xl tracking-tight text-foreground text-balance">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Sign in to access your scans and reports.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="signal-input font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="current-password"
              placeholder="At least 8 characters"
              className="signal-input font-mono"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="signal-btn w-full mt-2 font-mono uppercase tracking-widest"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>

        <p className="relative mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[oklch(0.78_0.15_195)] font-medium underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}

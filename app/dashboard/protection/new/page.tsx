import { getScans } from "@/app/actions/scans"
import { getProtectedApps } from "@/app/actions/protection"
import { ProtectAppForm } from "@/components/dashboard/protect-app-form"
import { Cpu, Lock, Zap } from "lucide-react"

export default async function NewProtectionPage() {
  const [scans, protectedApps] = await Promise.all([
    getScans(),
    getProtectedApps(),
  ])

  const protectedScanIds = new Set(
    protectedApps.map((a) => a.scanId).filter(Boolean) as string[],
  )

  // Offer completed scans that aren't already protected.
  const eligibleScans = scans
    .filter((s) => s.status === "completed" && !protectedScanIds.has(s.id))
    .map((s) => ({
      id: s.id,
      appName: s.appName,
      platform: s.platform,
      packageName: s.packageName,
      versionName: s.versionName,
    }))

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          Protect an app
        </h1>
        <p className="mt-1 text-muted-foreground">
          Apply no-code runtime protection. Defenses are injected into your build
          — no SDK integration or source changes required.
        </p>

        <div className="mt-8">
          <ProtectAppForm scans={eligibleScans} />
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <Feature
            icon={Zap}
            title="No-code"
            body="Protection is applied to the binary at build time, with zero code changes."
          />
          <Feature
            icon={Cpu}
            title="Runtime defense"
            body="Anti-hooking, anti-tampering, and root/jailbreak checks run on-device."
          />
          <Feature
            icon={Lock}
            title="Live telemetry"
            body="Every blocked attack streams back to your threat dashboard in real time."
          />
        </div>
      </div>
    </div>
  )
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="bg-card px-5 py-5">
      <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
      <h3 className="mt-3 font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

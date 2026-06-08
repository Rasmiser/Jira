import { getUserId, getUsage } from "@/lib/subscription"
import { UploadForm } from "@/components/dashboard/upload-form"
import { Lock, Cpu, FileText } from "lucide-react"

export default async function NewScanPage() {
  const userId = await getUserId()
  const usage = await getUsage(userId)

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          New scan
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload a mobile app binary to run static and dynamic security analysis.
        </p>

        <div className="mt-8">
          <UploadForm canScan={usage.canScan} />
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <Feature
            icon={Cpu}
            title="300+ checks"
            body="MobSF static & dynamic analysis across code, config, and runtime."
          />
          <Feature
            icon={Lock}
            title="Isolated & private"
            body="Each scan runs in an ephemeral sandbox. Binaries are purged after."
          />
          <Feature
            icon={FileText}
            title="MASVS report"
            body="Findings mapped to OWASP MASVS with guided remediation."
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

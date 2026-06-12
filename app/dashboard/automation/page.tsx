import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { CodeSnippet } from "@/components/dashboard/code-snippet"
import { Workflow, KeyRound } from "lucide-react"

const GITHUB_ACTION = `# .github/workflows/rasmiser.yml
name: RASMISER security scan
on: [push]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Scan build with RASMISER
        run: |
          curl -sSL https://api.rasmiser.com/v1/scan \\
            -H "Authorization: Bearer $RASMISER_TOKEN" \\
            -F "file=@app/build/outputs/app-release.apk"
        env:
          RASMISER_TOKEN: \${{ secrets.RASMISER_TOKEN }}`

const CLI_COMMAND = `npx @rasmiser/cli scan ./app-release.apk \\
  --token $RASMISER_TOKEN \\
  --fail-on critical`

export default async function AutomationPage() {
  const { allowed } = await getFeatureAccess("team")
  if (!allowed) {
    return <FeatureLocked featureName="CI/CD scan automation" requiredPlan="team" />
  }

  // Masked sample token — real tokens would be generated and stored server-side.
  const sampleToken = "rsm_live_••••••••••••••••••••••••"

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="CI/CD automation"
        description="Scan every build automatically by wiring RASMISER into your pipeline. Use an API token to authenticate from CI."
        icon={Workflow}
      />

      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          API token
        </h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-border bg-card px-5 py-4">
          <div className="flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <code className="font-mono text-sm text-foreground">{sampleToken}</code>
          </div>
          <span className="text-xs text-muted-foreground">
            Store as a secret named <code className="text-foreground">RASMISER_TOKEN</code>
          </span>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            GitHub Actions
          </h2>
          <div className="mt-4">
            <CodeSnippet label="rasmiser.yml" code={GITHUB_ACTION} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Any pipeline (CLI)
          </h2>
          <div className="mt-4">
            <CodeSnippet label="shell" code={CLI_COMMAND} />
          </div>
        </div>
      </div>

      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
        The <code className="text-foreground">--fail-on</code> flag breaks the
        build when issues at or above the chosen severity are found, so insecure
        releases never ship.
      </p>
    </div>
  )
}

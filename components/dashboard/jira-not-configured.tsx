import { Settings } from "lucide-react"

export function JiraNotConfigured() {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border px-6 py-20 text-center">
      <Settings className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <p className="mt-4 text-sm font-medium text-foreground">
        Jira is not connected
      </p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        To use the Kanban board, add the following environment variables to your
        project: <span className="font-mono text-foreground">JIRA_BASE_URL</span>,{" "}
        <span className="font-mono text-foreground">JIRA_EMAIL</span>,{" "}
        <span className="font-mono text-foreground">JIRA_API_TOKEN</span>, and{" "}
        <span className="font-mono text-foreground">JIRA_PROJECT_KEY</span>. Then
        push findings from a scan report.
      </p>
    </div>
  )
}

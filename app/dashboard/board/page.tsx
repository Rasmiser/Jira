import { RefreshCw } from "lucide-react"
import { getJiraBoard } from "@/app/actions/jira"
import { KanbanBoard } from "@/components/dashboard/kanban-board"
import { JiraNotConfigured } from "@/components/dashboard/jira-not-configured"

export const dynamic = "force-dynamic"

export default async function BoardPage() {
  const board = await getJiraBoard()

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-tight text-foreground">
              Kanban board
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live view of security findings tracked in Jira
              {board.configured && board.projectKey ? (
                <>
                  {" "}
                  · project{" "}
                  <span className="font-mono text-foreground">
                    {board.projectKey}
                  </span>
                </>
              ) : null}
              .
            </p>
          </div>
          {board.configured && (
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              {board.total} issue{board.total === 1 ? "" : "s"} synced ·
              refreshed from Jira on load
            </p>
          )}
        </div>

        <div className="mt-8">
          {board.configured ? (
            <KanbanBoard columns={board.columns} total={board.total} />
          ) : (
            <JiraNotConfigured />
          )}
        </div>
      </div>
    </div>
  )
}

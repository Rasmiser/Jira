import { createJiraIssuesFromScan } from "@/lib/createJiraIssues";
import { getLatestScan } from "@/lib/db";

export async function POST(req) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return Response.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const scan = await getLatestScan(projectId);

    if (!scan) {
      return Response.json(
        { error: "No scan found for this project" },
        { status: 404 }
      );
    }

    const issues = await createJiraIssuesFromScan(scan);

    return Response.json({
      success: true,
      created: issues.length,
      issues,
    });

  } catch (err) {
    console.error("Jira export error:", err);
    return Response.json(
      { error: "Failed to create Jira issues", detail: err.message },
      { status: 500 }
    );
  }
}

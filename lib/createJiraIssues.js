import { jira } from "./jira";

const SEVERITY_PRIORITY = {
  critical: "Highest",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export async function createJiraIssuesFromScan(scan) {
  const results = [];

  for (const finding of scan.findings) {
    if (!["critical", "high"].includes(finding.severity)) continue;

    const issue = await jira.issues.createIssue({
      fields: {
        project: { key: process.env.JIRA_PROJECT_KEY },
        summary: `[RASMISER] ${finding.title} — ${finding.severity.toUpperCase()}`,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: [
                    `Severity: ${finding.severity}`,
                    `Description: ${finding.description}`,
                    `Remediation: ${finding.remediation}`,
                    `Scan ID: ${scan.id}`,
                  ].join("\n\n"),
                },
              ],
            },
          ],
        },
        issuetype: { name: "Bug" },
        priority: { name: SEVERITY_PRIORITY[finding.severity] },
        labels: ["rasmiser", "security", finding.severity],
      },
    });

    results.push({
      findingId: finding.id,
      jiraKey: issue.key,
      jiraUrl: `${process.env.JIRA_BASE_URL}/browse/${issue.key}`,
    });
  }

  return results;
}

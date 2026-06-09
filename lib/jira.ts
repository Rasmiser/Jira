import "server-only";
import { Version3Client } from "jira.js";

/**
 * Server-side Jira client wired to the project's environment variables.
 *
 * Required env vars (already configured in this project):
 * - JIRA_BASE_URL   e.g. https://your-domain.atlassian.net
 * - JIRA_EMAIL      the Atlassian account email
 * - JIRA_API_TOKEN  an API token from https://id.atlassian.com/manage-profile/security/api-tokens
 * - JIRA_PROJECT_KEY the default project key (e.g. "SEC")
 */
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let client: Version3Client | null = null;

export function getJiraClient(): Version3Client {
  if (client) return client;

  client = new Version3Client({
    host: getEnv("JIRA_BASE_URL"),
    authentication: {
      basic: {
        email: getEnv("JIRA_EMAIL"),
        apiToken: getEnv("JIRA_API_TOKEN"),
      },
    },
  });

  return client;
}

export const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY ?? "";

export function isJiraConfigured(): boolean {
  return Boolean(
    process.env.JIRA_BASE_URL &&
      process.env.JIRA_EMAIL &&
      process.env.JIRA_API_TOKEN &&
      process.env.JIRA_PROJECT_KEY,
  );
}

const SEVERITY_TO_PRIORITY: Record<string, string> = {
  critical: "Highest",
  high: "High",
  medium: "Medium",
  low: "Low",
  info: "Lowest",
};

/** Atlassian Document Format paragraph helper. */
function adfDoc(blocks: { heading?: string; text: string }[]) {
  const content: unknown[] = [];
  for (const b of blocks) {
    if (b.heading) {
      content.push({
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: b.heading }],
      });
    }
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: b.text || "—" }],
    });
  }
  return { type: "doc", version: 1, content };
}

export interface JiraFindingInput {
  title: string;
  severity: string;
  category: string;
  masvs: string | null;
  description: string;
  remediation: string;
  reference: string | null;
  appName: string;
  scanId: string;
}

export interface JiraCreatedIssue {
  key: string;
  url: string;
}

/** Creates a Jira issue for a single security finding. */
export async function createJiraIssueForFinding(
  finding: JiraFindingInput,
): Promise<JiraCreatedIssue> {
  const jira = getJiraClient();
  const base = getEnv("JIRA_BASE_URL").replace(/\/$/, "");

  const labels = [
    "rasmiser",
    `severity-${finding.severity}`,
    `scan-${finding.scanId.slice(0, 8)}`,
  ];
  if (finding.masvs) {
    labels.push(finding.masvs.replace(/[^A-Za-z0-9-]/g, "-"));
  }

  const created = await jira.issues.createIssue({
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: `[${finding.severity.toUpperCase()}] ${finding.title} — ${finding.appName}`,
      issuetype: { name: "Bug" },
      labels,
      description: adfDoc([
        { heading: "Description", text: finding.description },
        { heading: "Remediation", text: finding.remediation },
        {
          heading: "Details",
          text: `App: ${finding.appName}\nCategory: ${finding.category}${
            finding.masvs ? `\nMASVS: ${finding.masvs}` : ""
          }${finding.reference ? `\nReference: ${finding.reference}` : ""}`,
        },
      ]) as never,
    },
  });

  // Best-effort priority set (skipped silently if the project lacks the field).
  const priorityName = SEVERITY_TO_PRIORITY[finding.severity];
  if (priorityName && created.key) {
    try {
      await jira.issues.editIssue({
        issueIdOrKey: created.key,
        fields: { priority: { name: priorityName } as never },
      });
    } catch {
      // priority field not available on this project — ignore
    }
  }

  return { key: created.key, url: `${base}/browse/${created.key}` };
}

export interface JiraIssueStatus {
  key: string;
  status: string;
  statusCategory: string; // "To Do" | "In Progress" | "Done"
}

/** Reads the current status of a set of Jira issues by key. */
export async function getJiraIssueStatuses(
  keys: string[],
): Promise<Record<string, JiraIssueStatus>> {
  if (keys.length === 0) return {};
  const jira = getJiraClient();
  const result: Record<string, JiraIssueStatus> = {};

  const jql = `key in (${keys.map((k) => `"${k}"`).join(",")})`;
  const res = await jira.issueSearch.searchForIssuesUsingJql({
    jql,
    fields: ["status"],
    maxResults: 100,
  });

  for (const issue of res.issues ?? []) {
    const status = issue.fields?.status;
    result[issue.key] = {
      key: issue.key,
      status: status?.name ?? "Unknown",
      statusCategory: status?.statusCategory?.name ?? "To Do",
    };
  }
  return result;
}

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

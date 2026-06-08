const axios = require('axios');

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;

if (!JIRA_BASE_URL || !JIRA_API_TOKEN || !JIRA_EMAIL) {
  throw new Error('Missing required Jira environment variables: JIRA_BASE_URL, JIRA_API_TOKEN, JIRA_EMAIL');
}

const jiraClient = axios.create({
  baseURL: `${JIRA_BASE_URL}/rest/api/3`,
  auth: {
    username: JIRA_EMAIL,
    password: JIRA_API_TOKEN,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Create a Jira issue
 * @param {Object} issueData - Issue data (summary, description, issuetype, project, etc.)
 * @returns {Promise<Object>} Created issue response
 */
async function createJiraIssue(issueData) {
  try {
    const response = await jiraClient.post('/issue', {
      fields: issueData,
    });
    return {
      success: true,
      issueKey: response.data.key,
      issueId: response.data.id,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.errorMessages?.[0] || error.message,
    };
  }
}

/**
 * Get a Jira issue
 * @param {string} issueKey - Issue key (e.g., PROJ-123)
 * @returns {Promise<Object>} Issue data
 */
async function getJiraIssue(issueKey) {
  try {
    const response = await jiraClient.get(`/issue/${issueKey}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.errorMessages?.[0] || error.message,
    };
  }
}

/**
 * Search Jira issues using JQL
 * @param {string} jql - JQL query string
 * @param {Object} options - Additional search options (maxResults, startAt, fields)
 * @returns {Promise<Object>} Search results
 */
async function searchJiraIssues(jql, options = {}) {
  try {
    const response = await jiraClient.post('/search', {
      jql,
      maxResults: options.maxResults || 50,
      startAt: options.startAt || 0,
      fields: options.fields || ['summary', 'status', 'assignee', 'created', 'updated'],
    });
    return {
      success: true,
      total: response.data.total,
      issues: response.data.issues,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.errorMessages?.[0] || error.message,
    };
  }
}

module.exports = {
  jiraClient,
  createJiraIssue,
  getJiraIssue,
  searchJiraIssues,
};

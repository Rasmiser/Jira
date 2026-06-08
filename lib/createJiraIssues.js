const { createJiraIssue } = require('./jira');

/**
 * Map finding/vulnerability data to Jira issue format
 * @param {Object} finding - Finding/vulnerability data from security scanner
 * @returns {Object} Jira issue fields
 */
function mapFindingToJiraIssue(finding) {
  const severity = finding.severity?.toUpperCase() || 'MEDIUM';
  
  // Map severity to Jira priority
  const priorityMap = {
    CRITICAL: 'Highest',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
    INFO: 'Lowest',
  };

  const description = `
*Finding Type:* ${finding.type || 'Unknown'}
*Severity:* ${severity}
*Location:* ${finding.location || 'N/A'}
${finding.description ? `*Details:* ${finding.description}` : ''}
${finding.remediation ? `*Remediation:* ${finding.remediation}` : ''}
${finding.url ? `*Reference:* ${finding.url}` : ''}

_Created by: Jira Export API_
_Timestamp: ${new Date().toISOString()}_
  `.trim();

  return {
    summary: `[${severity}] ${finding.title || finding.type}`,
    description,
    issuetype: {
      name: 'Bug', // or 'Task', 'Security Issue' depending on your Jira setup
    },
    priority: {
      name: priorityMap[severity] || 'Medium',
    },
    labels: [
      'auto-created',
      `severity-${severity.toLowerCase()}`,
      finding.type?.toLowerCase().replace(/\s+/g, '-'),
    ].filter(Boolean),
    // Set assignee if provided
    ...(finding.assignee && {
      assignee: {
        name: finding.assignee,
      },
    }),
    // Set project (required - customize based on your project key)
    project: {
      key: process.env.JIRA_PROJECT_KEY || 'PROJ',
    },
  };
}

/**
 * Create Jira issues from array of findings
 * @param {Array} findings - Array of finding objects
 * @returns {Promise<Array>} Array of created issue results
 */
async function createJiraIssuesFromFindings(findings) {
  if (!Array.isArray(findings)) {
    throw new Error('Findings must be an array');
  }

  const results = [];

  for (const finding of findings) {
    try {
      const issueData = mapFindingToJiraIssue(finding);
      const result = await createJiraIssue(issueData);
      results.push({
        finding: finding.title || finding.type,
        ...result,
      });
    } catch (error) {
      results.push({
        finding: finding.title || finding.type,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

module.exports = {
  mapFindingToJiraIssue,
  createJiraIssuesFromFindings,
};

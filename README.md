# Jira Integration for RASMISER

Automated export of security findings to Jira as issues. This integration fetches the latest scan results and creates Jira tickets for critical and high-severity findings.

## 📁 Project Structure

```
your-project/
├── lib/
│   ├── jira.js              # Jira Version3Client initialization
│   ├── createJiraIssues.js  # Maps findings to Jira issues
│   └── db.js                # Database utility (Supabase)
├── app/
│   └── api/
│       └── jira/
│           └── export/
│               └── route.js  # API endpoint: POST /api/jira/export
├── package.json
├── .env.local.example       # Environment variables template
└── README.md                # This file
```

## 🚀 Quick Start

### Step 1: Clone and Install

```bash
git clone https://github.com/Rasmiser/Jira.git
cd Jira
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then fill in the values:

```env
# Jira Configuration
JIRA_BASE_URL=https://yourworkspace.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_api_token_here
JIRA_PROJECT_KEY=SEC

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Get Your API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Copy the token and paste it in `.env.local` as `JIRA_API_TOKEN`

### Step 4: Deploy to Vercel

```bash
git add .
git commit -m "feat: add Jira integration"
git push origin main
```

**In Vercel Dashboard:**

1. Go to **Settings → Environment Variables**
2. Add all 6 environment variables (Production, Preview, Development)
3. Click **Redeploy** to apply changes

## 📝 API Usage

### Export Findings to Jira

**Endpoint:** `POST /api/jira/export`

**Request Body:**
```json
{
  "projectId": "your-project-id"
}
```

**Response:**
```json
{
  "success": true,
  "created": 3,
  "issues": [
    {
      "findingId": "finding-123",
      "jiraKey": "SEC-42",
      "jiraUrl": "https://yourworkspace.atlassian.net/browse/SEC-42"
    }
  ]
}
```

### cURL Example

```bash
curl -X POST https://rasmiser.vercel.app/api/jira/export \
  -H "Content-Type: application/json" \
  -d '{"projectId": "project-123"}'
```

## 🔍 Testing Locally

```bash
npm run dev
```

Then test with cURL:
```bash
curl -X POST http://localhost:3000/api/jira/export \
  -H "Content-Type: application/json" \
  -d '{"projectId": "your-project-id"}'
```

## 🛠 Configuration

### Database Setup (Supabase)

Your Supabase project should have these tables:

**`scans` table:**
```sql
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**`findings` table:**
```sql
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES scans(id),
  title TEXT NOT NULL,
  type TEXT,
  severity TEXT,
  description TEXT,
  remediation TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Jira Project Setup

1. Ensure your Jira project exists (e.g., `SEC`)
2. The project must have a `Bug` issue type
3. API token user must have access to create issues

## 📊 How It Works

1. **Fetch Latest Scan** - Calls `getLatestScan(projectId)` from Supabase
2. **Filter Findings** - Only critical and high severity issues are exported
3. **Map to Jira** - Each finding becomes a Jira issue with:
   - Summary: `[SEVERITY] Finding Title`
   - Priority: Mapped from severity
   - Labels: `["rasmiser", "security", severity]`
   - Description: Formatted with finding details
4. **Create Issues** - Posts to Jira and returns issue keys/URLs

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| `401 Unauthorized` | Check JIRA_API_TOKEN and JIRA_EMAIL |
| `404 Project not found` | Verify JIRA_PROJECT_KEY exists in your Jira instance |
| `Cannot find module 'jira.js'` | Run `npm install` |
| `SUPABASE_SERVICE_ROLE_KEY undefined` | Add to Vercel environment variables and redeploy |

### Check Deployment Logs

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Deployments → Latest**
4. Click **Functions** tab
5. Find `/api/jira/export` and check logs

## 📚 Files Overview

- **`lib/jira.js`** - Initializes Jira client with Version3Client API
- **`lib/createJiraIssues.js`** - Transforms findings to Jira issue format
- **`lib/db.js`** - Supabase queries for scans and findings
- **`app/api/jira/export/route.js`** - Next.js API endpoint
- **`package.json`** - Dependencies (jira.js, @supabase/supabase-js)

## 🔐 Security

- Never commit `.env.local` (it's git-ignored by default)
- Use Vercel's environment variables for production
- Rotate API tokens regularly
- Restrict Jira user permissions to minimal required access

## 📦 Dependencies

- **Next.js 14** - Framework
- **jira.js 11** - Jira API client
- **@supabase/supabase-js 2** - Supabase client

## 🤝 Support

For issues or questions, check:
- [Jira API Docs](https://developer.atlassian.com/cloud/jira/rest/v3)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Version:** 1.0.0  
**Last Updated:** June 2026

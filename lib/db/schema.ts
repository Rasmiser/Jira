import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core"

// ---------------------------------------------------------------------------
// Better Auth tables (column names must match Better Auth defaults)
// ---------------------------------------------------------------------------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// RASMISER app tables (scoped by userId, no FK constraints by convention)
// ---------------------------------------------------------------------------
export const scans = pgTable("scans", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  appName: text("appName").notNull(),
  fileName: text("fileName").notNull(),
  platform: text("platform").notNull(), // 'android' | 'ios'
  fileSize: integer("fileSize").notNull().default(0),
  packageName: text("packageName"),
  versionName: text("versionName"),
  status: text("status").notNull().default("queued"), // queued | scanning | completed | failed
  riskScore: integer("riskScore"),
  grade: text("grade"),
  criticalCount: integer("criticalCount").notNull().default(0),
  highCount: integer("highCount").notNull().default(0),
  mediumCount: integer("mediumCount").notNull().default(0),
  lowCount: integer("lowCount").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  completedAt: timestamp("completedAt"),
})

export const findings = pgTable("findings", {
  id: text("id").primaryKey(),
  scanId: text("scanId").notNull(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  severity: text("severity").notNull(), // critical | high | medium | low | info
  category: text("category").notNull(),
  masvs: text("masvs"),
  description: text("description").notNull(),
  remediation: text("remediation").notNull(),
  reference: text("reference"),
  // Cached AI fix recommendation (generated on demand)
  aiFixSummary: text("aiFixSummary"),
  aiFixCode: text("aiFixCode"),
  aiFixLanguage: text("aiFixLanguage"),
  aiFixGeneratedAt: timestamp("aiFixGeneratedAt"),
  // Jira sync tracking
  jiraIssueKey: text("jiraIssueKey"),
  jiraIssueUrl: text("jiraIssueUrl"),
  jiraStatus: text("jiraStatus"),
  jiraSyncedAt: timestamp("jiraSyncedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Apps that have runtime protection applied (no-code shielding)
export const protectedApps = pgTable("protected_apps", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  scanId: text("scanId"),
  appName: text("appName").notNull(),
  packageName: text("packageName"),
  platform: text("platform").notNull(), // android | ios
  versionName: text("versionName"),
  status: text("status").notNull().default("protected"), // protected | building | paused
  protectionLevel: text("protectionLevel").notNull().default("standard"), // standard | advanced | maximum
  shields: jsonb("shields").notNull().default([]), // string[] of enabled shield ids
  installCount: integer("installCount").notNull().default(0),
  attacksBlocked: integer("attacksBlocked").notNull().default(0),
  riskLevel: text("riskLevel").notNull().default("low"), // low | medium | high | critical
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Live runtime security events captured from protected apps
export const threatEvents = pgTable("threat_events", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  appId: text("appId").notNull(),
  appName: text("appName").notNull(),
  platform: text("platform").notNull(),
  threatType: text("threatType").notNull(), // hooking | tampering | jailbreak | root | mitm | debugger | screen_capture | emulator
  severity: text("severity").notNull(), // critical | high | medium | low
  action: text("action").notNull(), // blocked | terminated | flagged | allowed
  deviceModel: text("deviceModel"),
  osVersion: text("osVersion"),
  country: text("country"),
  countryCode: text("countryCode"),
  description: text("description"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Test suites — runnable QA testing tools (functional, compatibility,
// performance, security, ui_ux, automation). Each run has many checks.
// ---------------------------------------------------------------------------
export const testRuns = pgTable("test_runs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  testType: text("testType").notNull(), // functional | compatibility | performance | security | ui_ux | automation
  appName: text("appName").notNull(),
  platform: text("platform").notNull(), // android | ios | web | cross
  target: text("target"), // optional URL / package / build identifier
  status: text("status").notNull().default("completed"), // queued | running | completed | failed
  score: integer("score"), // 0-100, higher = better
  grade: text("grade"), // A-F
  passCount: integer("passCount").notNull().default(0),
  warnCount: integer("warnCount").notNull().default(0),
  failCount: integer("failCount").notNull().default(0),
  summary: text("summary"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  completedAt: timestamp("completedAt"),
})

export const testChecks = pgTable("test_checks", {
  id: text("id").primaryKey(),
  runId: text("runId").notNull(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(), // pass | warn | fail
  category: text("category").notNull(),
  detail: text("detail").notNull(),
  metric: text("metric"), // optional measured value e.g. "1.8s" or "92%"
  recommendation: text("recommendation"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Test cases — the reusable, AI-authored ("CoTester") test case library. Each
// case holds plain-English intent plus structured, automatable steps. Cases are
// executed against the real device cloud, producing test_case_runs.
// ---------------------------------------------------------------------------
export const testCases = pgTable("test_cases", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(), // plain-English scenario
  platform: text("platform").notNull().default("cross"), // android | ios | web | cross
  priority: text("priority").notNull().default("medium"), // low | medium | high | critical
  tags: jsonb("tags").notNull().default([]), // string[]
  status: text("status").notNull().default("draft"), // draft | ready | archived
  source: text("source").notNull().default("manual"), // ai | manual
  // steps: Array<{ action: string; target: string; expected: string }>
  steps: jsonb("steps").notNull().default([]),
  lastRunStatus: text("lastRunStatus"), // passed | failed | flaky
  lastRunAt: timestamp("lastRunAt"),
  runCount: integer("runCount").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Executions of a test case against a chosen real-device-cloud device.
export const testCaseRuns = pgTable("test_case_runs", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  caseId: text("caseId").notNull(),
  caseTitle: text("caseTitle").notNull(),
  deviceId: text("deviceId").notNull(),
  deviceName: text("deviceName").notNull(),
  platform: text("platform").notNull(),
  osVersion: text("osVersion"),
  browser: text("browser"),
  status: text("status").notNull(), // passed | failed | flaky
  durationMs: integer("durationMs").notNull().default(0),
  passedSteps: integer("passedSteps").notNull().default(0),
  failedSteps: integer("failedSteps").notNull().default(0),
  totalSteps: integer("totalSteps").notNull().default(0),
  // stepResults: Array<{ index: number; action: string; target: string; expected: string; status: 'passed' | 'failed'; note: string | null; durationMs: number }>
  stepResults: jsonb("stepResults").notNull().default([]),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Contact / book-a-demo submissions from the public marketing site (anonymous)
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  appPlatform: text("appPlatform"), // android | ios | cross | web | other
  teamSize: text("teamSize"), // 1-10 | 11-50 | 51-200 | 200+
  inquiryType: text("inquiryType").notNull().default("demo"), // demo | sales | support | general
  message: text("message"),
  source: text("source").notNull().default("contact"),
  status: text("status").notNull().default("new"), // new | contacted | qualified | closed
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Newsletter signups from the public landing page (not user-scoped — anonymous)
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("landing"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Translate & Adapt — localize app store listings and in-app UI strings into
// multiple locales with AI-assisted cultural adaptation. A project holds the
// source content (segments); each target locale gets its own translation row.
// ---------------------------------------------------------------------------
export const localizationProjects = pgTable("localization_projects", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  contentType: text("contentType").notNull().default("store_listing"), // store_listing | ui_strings
  platform: text("platform").notNull().default("android"), // android | ios | cross
  sourceLocale: text("sourceLocale").notNull().default("en"),
  // targetLocales: string[] of locale codes (e.g. ["es", "fr-CA"])
  targetLocales: jsonb("targetLocales").notNull().default([]),
  // segments: Array<{ key: string; text: string }>
  segments: jsonb("segments").notNull().default([]),
  tone: text("tone").notNull().default("neutral"), // neutral | friendly | professional | playful
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const localizationTranslations = pgTable("localization_translations", {
  id: text("id").primaryKey(),
  projectId: text("projectId").notNull(),
  userId: text("userId").notNull(),
  locale: text("locale").notNull(),
  localeName: text("localeName").notNull(),
  status: text("status").notNull().default("draft"), // draft | translating | completed | error
  // segments: Array<{ key: string; source: string; translated: string; note: string | null }>
  segments: jsonb("segments").notNull().default([]),
  adaptationNotes: text("adaptationNotes"),
  qualityScore: integer("qualityScore"), // 0-100 self-assessed translation confidence
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().unique(),
  plan: text("plan").notNull().default("free"), // free | pro | team
  status: text("status").notNull().default("active"),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

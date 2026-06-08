import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
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
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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

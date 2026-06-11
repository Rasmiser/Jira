"use server"

import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/subscription"
import { LEAD_STATUSES, type LeadStatus } from "@/lib/leads"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type LeadResult = { ok: boolean; message: string }

const INQUIRY_TYPES = new Set(["demo", "sales", "support", "general"])

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
  const company = String(formData.get("company") ?? "").trim()
  const appPlatform = String(formData.get("appPlatform") ?? "").trim()
  const teamSize = String(formData.get("teamSize") ?? "").trim()
  const inquiryTypeRaw = String(formData.get("inquiryType") ?? "demo").trim()
  const message = String(formData.get("message") ?? "").trim()
  const source = String(formData.get("source") ?? "contact").trim()

  if (!name) {
    return { ok: false, message: "Please enter your name." }
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, message: "Please enter a valid email address." }
  }
  if (message.length > 2000) {
    return { ok: false, message: "Your message is too long. Please keep it under 2000 characters." }
  }

  const inquiryType = INQUIRY_TYPES.has(inquiryTypeRaw) ? inquiryTypeRaw : "general"

  try {
    await db.insert(leads).values({
      id: crypto.randomUUID(),
      name,
      email,
      company: company || null,
      appPlatform: appPlatform || null,
      teamSize: teamSize || null,
      inquiryType,
      message: message || null,
      source: source || "contact",
    })

    return {
      ok: true,
      message: "Thanks! Your request is in. A member of our team will reach out within one business day.",
    }
  } catch (err) {
    console.log("[v0] lead submit error:", err)
    return { ok: false, message: "Something went wrong. Please try again." }
  }
}

/**
 * Returns all inbound leads, newest first. Requires an authenticated session —
 * leads are not user-scoped because they are a shared team inbox.
 */
export async function getLeads() {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")

  return db.select().from(leads).orderBy(desc(leads.createdAt))
}

/**
 * Returns counts of leads grouped by status for the dashboard summary cards.
 */
export async function getLeadStats() {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")

  const rows = await db
    .select({ status: leads.status, count: sql<number>`count(*)::int` })
    .from(leads)
    .groupBy(leads.status)

  const counts: Record<string, number> = {}
  let total = 0
  for (const r of rows) {
    counts[r.status] = Number(r.count)
    total += Number(r.count)
  }
  return { counts, total }
}

/**
 * Updates the pipeline status of a single lead.
 */
export async function updateLeadStatus(id: string, status: LeadStatus) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")

  if (!LEAD_STATUSES.includes(status)) {
    throw new Error("Invalid status")
  }

  await db.update(leads).set({ status }).where(eq(leads.id, id))
  revalidatePath("/dashboard/leads")
}

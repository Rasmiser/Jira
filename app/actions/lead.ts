"use server"

import { db } from "@/lib/db"
import { leads } from "@/lib/db/schema"

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

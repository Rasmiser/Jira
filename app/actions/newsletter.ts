"use server"

import { db } from "@/lib/db"
import { newsletterSubscribers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type NewsletterResult = { ok: boolean; message: string }

export async function subscribeToNewsletter(formData: FormData): Promise<NewsletterResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, message: "Please enter a valid email address." }
  }

  try {
    const existing = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1)

    if (existing.length > 0) {
      return { ok: true, message: "You're already on the list. Thanks for sticking around!" }
    }

    await db.insert(newsletterSubscribers).values({
      id: crypto.randomUUID(),
      email,
      source: "landing",
    })

    return { ok: true, message: "You're in. Watch your inbox for security insights." }
  } catch (err) {
    console.log("[v0] newsletter subscribe error:", err)
    return { ok: false, message: "Something went wrong. Please try again." }
  }
}

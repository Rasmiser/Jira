"use server"

import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { subscriptions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getSession, getOrCreateSubscription } from "@/lib/subscription"
import { PLANS, type PlanId } from "@/lib/plans"
import { revalidatePath } from "next/cache"

function getBaseUrl() {
  const h = headers()
  return h.then((hdrs) => {
    const host = hdrs.get("host")
    const proto = hdrs.get("x-forwarded-proto") ?? "https"
    return `${proto}://${host}`
  })
}

/**
 * Creates a hosted Stripe Checkout session for a subscription plan and returns
 * its URL. Plan prices are created inline so no Stripe dashboard setup is needed.
 */
export async function startCheckout(planId: PlanId) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")

  const plan = PLANS[planId]
  if (!plan || plan.priceInCents <= 0) {
    throw new Error("Invalid plan")
  }

  const sub = await getOrCreateSubscription(session.user.id)
  const baseUrl = await getBaseUrl()

  // Reuse or create a Stripe customer for this user.
  let customerId = sub.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id
    await db
      .update(subscriptions)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(subscriptions.userId, session.user.id))
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          recurring: { interval: "month" },
          product_data: {
            name: `RASMISER ${plan.name}`,
            description: plan.description,
          },
          unit_amount: plan.priceInCents,
        },
        quantity: 1,
      },
    ],
    metadata: { userId: session.user.id, planId },
    success_url: `${baseUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/billing?canceled=1`,
  })

  return checkout.url
}

/**
 * Confirms a completed checkout session and upgrades the user's plan.
 * Called from the billing page after Stripe redirects back.
 */
export async function confirmCheckout(sessionId: string) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")

  const checkout = await stripe.checkout.sessions.retrieve(sessionId)

  if (
    checkout.payment_status !== "paid" &&
    checkout.status !== "complete"
  ) {
    return { ok: false as const }
  }

  if (checkout.metadata?.userId !== session.user.id) {
    return { ok: false as const }
  }

  const planId = (checkout.metadata?.planId as PlanId) ?? "pro"

  await db
    .update(subscriptions)
    .set({
      plan: planId,
      status: "active",
      stripeSubscriptionId:
        typeof checkout.subscription === "string"
          ? checkout.subscription
          : null,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, session.user.id))

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/billing")
  return { ok: true as const, planId }
}

/**
 * Cancels the paid plan and reverts the user to the free tier.
 */
export async function cancelSubscription() {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")

  const sub = await getOrCreateSubscription(session.user.id)

  if (sub.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(sub.stripeSubscriptionId)
    } catch {
      // Subscription may already be canceled in Stripe; ignore.
    }
  }

  await db
    .update(subscriptions)
    .set({
      plan: "free",
      status: "active",
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, session.user.id))

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/billing")
}

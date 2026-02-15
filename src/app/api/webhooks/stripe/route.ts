import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/services/billing/stripe-service";
import { db } from "@/lib/db";
import { stripeService } from "@/services/billing/stripe-service";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const workspaceId = session.metadata?.workspaceId;
        const subscriptionId = session.subscription as string;

        if (workspaceId && subscriptionId) {
          await stripeService.updateSubscriptionStatus(subscriptionId);
          console.log(`✅ Checkout completed for workspace ${workspaceId}`);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscriptionId = session.id as string;
        await stripeService.updateSubscriptionStatus(subscriptionId);
        console.log(`✅ Subscription ${event.type} processed: ${subscriptionId}`);
        break;
      }

      case "invoice.payment_failed": {
        const subscriptionId = session.subscription as string;
        if (subscriptionId) {
          await stripeService.updateSubscriptionStatus(subscriptionId);
          // Potential logic: Trigger email to customer or flag workspace
          console.warn(`🔴 Payment failed for subscription: ${subscriptionId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}

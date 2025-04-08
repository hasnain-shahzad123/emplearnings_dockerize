export const dynamic = "force-dynamic";

import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { planId, email, uid } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Please provide an email address." },
        { status: 400 }
      );
    }
    if (!uid) {
      return NextResponse.json(
        { message: "Please provide a user id." },
        { status: 400 }
      );
    }
    if (!planId) {
      return NextResponse.json(
        { message: "Please provide a plan id." },
        { status: 400 }
      );
    }

    let subscriptionPlanId = "";
    switch (planId) {
      case "1":
        subscriptionPlanId =
          process.env.STRIPE_STANDARD_SUBSCRIPTION_PRICE_ID || "";
        break;
      case "2":
        subscriptionPlanId = process.env.STRIPE_PRO_SUBSCRIPTION_PRICE_ID || "";
        break;
      case "3":
        subscriptionPlanId =
          process.env.STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID || "";
        break;
      default:
        return NextResponse.json(
          { message: "incorrect plan Id" },
          { status: 400 }
        );
    }

    const registrationFeeId = process.env.STRIPE_REGISTRATION_FEE_PRICE_ID;

    const customer = await stripe.customers.create({
      email: email,
      metadata: { uid: uid },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
      line_items: [
        { price: subscriptionPlanId, quantity: 1 },
        { price: registrationFeeId!, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/mentor-dashboard/${uid}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/failed`,
    });

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (e) {
    console.error("Error creating subscription:", e);
    return NextResponse.json(
      { message: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

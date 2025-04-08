import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //get subscription plan id and user email and uid from the req body
    const { planId, email, uid } = await req.json();

    //validations
    if (email === null || email === undefined) {
      return NextResponse.json(
        { message: "Please provide an email address." },
        { status: 400 }
      );
    } else if (uid === undefined || uid === null) {
      return NextResponse.json(
        { message: "Please provide a user id." },
        { status: 400 }
      );
    } else if (planId === null || planId === undefined) {
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

    // Creating a Stripe customer with the user details
    const customer = await stripe.customers.create({
      email: email,
      metadata: { uid: uid },
    });

    // Creating the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id, // Newly created customer
      line_items: [
        {
          price: subscriptionPlanId, // The subscription plan price ID
          quantity: 1,
        },
        {
          price: registrationFeeId, //One time registration fees price id
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 30, //  30-day free trial period
      },
      success_url: process.env.NEXT_PUBLIC_URL + `/mentor-dashboard/${uid}`, // Redirect URL on success
      cancel_url: process.env.NEXT_PUBLIC_URL + "/failed", // Redirect URL on cancel
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

// This API route handles the creation of a Stripe Checkout Session for purchasing a course.
// It accepts a POST request with details about the course, tutor, and payment configuration.
// The route validates the input data and uses the Stripe API to create a payment session.
// On success, it returns the URL for the Stripe Checkout page to complete the transaction.
// Errors during session creation are logged and result in a 500 response with an error message.

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      courseId,
      tutorId,
      price,
      tutorStripeAccountId,
      successUrl,
      cancelUrl,
    } = body;

    if (
      !courseId ||
      !tutorId ||
      !price ||
      !tutorStripeAccountId ||
      !successUrl ||
      !cancelUrl
    ) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Creating a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Course Purchase - ${courseId}`,
              description: `Payment for the course offered by Tutor ID: ${tutorId}`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: {
        transfer_data: {
          destination: tutorStripeAccountId, //tutor's Stripe connect account id
        },
      },
    });
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("Error creating Checkout Session:", err);
    return NextResponse.json(
      { message: "Internal Server Error while creating checkout session" },
      { status: 500 }
    );
  }
}

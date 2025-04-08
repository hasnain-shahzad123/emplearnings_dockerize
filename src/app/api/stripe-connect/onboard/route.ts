// This API route handles the creation of Stripe account onboarding links.
// It accepts a POST request with an account ID in the request body.
// The Stripe API is used to generate a link that allows users to complete onboarding.
// If the account ID is missing or an error occurs, appropriate error responses are returned.
// The onboarding link includes refresh and return URLs for handling the user's flow.

import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json();

    // Validating that accountId is provided
    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }
    //Creating the onboarding link for the user
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/stripe-connect-test?status=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/stripe-connect-test?status=success`,
      type: "account_onboarding",
      collection_options: {
        fields: "eventually_due",
      },
    });

    return NextResponse.json(
      {
        url: accountLink.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      error
    );
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

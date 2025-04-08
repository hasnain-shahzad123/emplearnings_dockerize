// This API route handles the creation of a Stripe connected account.
// It accepts a POST request with an `emailAddress` in the request body.
// Using the Stripe API, it creates an Express account configured with the provided email and "individual" business type.
// If account creation is successful, the account ID is returned in the response.
// Errors during the process are logged and result in a 500 response with an error message.

import addTutorAsConnectedAccount from "@/firebase/firebase_admin/stripe/connect/addTutorAsConnectedAccount";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createAccountSchema = z.object({
  emailAddress: z.string().email("Invalid email address"),
  uid: z.string().min(1, "UID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const validation = createAccountSchema.safeParse(requestBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          type: "error",
          message: "Invalid request data",
          errors: validation.error.errors.map((err) => err.message),
        },
        { status: 400 }
      );
    }

    const { emailAddress, uid } = validation.data;

    // Creating a Stripe connect account
    const account = await stripe.accounts.create({
      business_type: "individual",
      email: emailAddress,
      individual: { email: emailAddress },
      type: "express",
      metadata: { empLearningId: uid },
    });

    // Saving account details in Firebase
    const response = await addTutorAsConnectedAccount({
      uid: uid,
      stripeConnectId: account.id,
    });

    // Logging the response from Firebase
    console.log("Firebase Response:", response);
    if (response.type === "success") {
      return NextResponse.json(
        {
          type: "success",
          message: "Stripe account created successfully",
          data: { accountId: account.id },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          type: "error",
          message: "Stripe account created but couldnt be saved to db",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(
      "An error occurred while creating a Stripe connected account:",
      error
    );

    return NextResponse.json(
      {
        type: "error",
        message: "Failed to create Stripe account",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

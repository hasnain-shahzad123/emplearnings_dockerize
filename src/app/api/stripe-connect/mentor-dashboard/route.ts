// API route to generate a Stripe Express Dashboard login link.
// Validates the request body using Zod and Stripe API integration.
// Returns a success or error response in JSON format.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const dashboardRequestSchema = z.object({
  connectId: z.string().min(1, "Connect ID is required"),
});

type ApiResponse = {
  type: "success" | "error";
  message: string;
  url?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = dashboardRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);
      return NextResponse.json({
        type: "error",
        message: "Invalid request: Connect ID is required",
      });
    }

    const { connectId } = validationResult.data;

    // Generating login link for Stripe Express Dashboard
    const loginLink = await stripe.accounts.createLoginLink(connectId);

    const response: ApiResponse = {
      type: "success",
      message: "Successfully created login link",
      url: loginLink.url,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating Stripe login link:", error);
    return NextResponse.json({
      type: "error",
      message: "Unable to create dashboard link at this time",
    });
  }
}

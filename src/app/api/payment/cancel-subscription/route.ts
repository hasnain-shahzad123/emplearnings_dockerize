import removeTutorAsCustomerToDB from "@/firebase/firebase_admin/stripe/removeTutorAsCustomerFromDB";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { customerId, planType } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { message: "Customer ID is required." },
        { status: 400 }
      );
    }

    // If a specific plan type is provided
    if (planType) {
      try {
        // Find active subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "active",
        });

        if (!subscriptions.data.length) {
          return NextResponse.json(
            { message: "No active subscriptions found for this customer." },
            { status: 404 }
          );
        }

        // Determine price ID based on plan type
        let subscriptionPriceId = "";
        switch (planType) {
          case "standard":
            subscriptionPriceId =
              process.env.STRIPE_STANDARD_SUBSCRIPTION_PRICE_ID || "";
            break;
          case "pro":
            subscriptionPriceId =
              process.env.STRIPE_PRO_SUBSCRIPTION_PRICE_ID || "";
            break;
          case "premium":
            subscriptionPriceId =
              process.env.STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID || "";
            break;
          default:
            return NextResponse.json(
              { message: "Invalid plan type specified." },
              { status: 400 }
            );
        }

        // Find the subscription with the matching price ID
        const targetSubscription = subscriptions.data.find((sub) =>
          sub.items.data.some((item) => item.price.id === subscriptionPriceId)
        );

        if (!targetSubscription) {
          return NextResponse.json(
            {
              message: `No active ${planType} subscription found for this customer.`,
            },
            { status: 404 }
          );
        }

        // Cancel the specific subscription
        await stripe.subscriptions.cancel(targetSubscription.id);
        const result = await removeTutorAsCustomerToDB(customerId);
        if (result.type === "error") {
          return NextResponse.json(
            {
              message: "Failed to remove tutor as customer from DB",
              error: result.message,
            },
            { status: 500 }
          );
        } else {
          return NextResponse.json(
            {
              message: `${planType} subscription cancelled successfully.`,
            },
            { status: 200 }
          );
        }
      } catch (error) {
        console.error("Error cancelling specific subscription:", error);
        return NextResponse.json(
          {
            message: "Failed to cancel subscription",
            error: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      }
    } else {
      // Cancel all active subscriptions for the customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
      });

      if (!subscriptions.data.length) {
        return NextResponse.json(
          { message: "No active subscriptions found for this customer." },
          { status: 404 }
        );
      }

      await Promise.all(
        subscriptions.data.map((sub) => stripe.subscriptions.cancel(sub.id))
      );
      const result = await removeTutorAsCustomerToDB(customerId);
      if (result.type === "error") {
        return NextResponse.json(
          {
            message: "Failed to remove tutor as customer from DB",
            error: result.message,
          },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          {
            message: `${planType} subscription cancelled successfully.`,
          },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Error in subscription cancellation endpoint:", error);
    return NextResponse.json(
      {
        message: "Failed to process subscription cancellation request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

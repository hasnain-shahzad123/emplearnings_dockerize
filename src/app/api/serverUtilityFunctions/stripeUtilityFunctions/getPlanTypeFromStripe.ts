"use server";
import z from "zod";
import { stripe } from "@/lib/stripe";

const getPlanTypeSchema = z.object({
  customerId: z.string().min(4, "CustomerId is required"),
});

type getPlanType = z.infer<typeof getPlanTypeSchema>;

type PlanType = "standard" | "pro" | "premium" | "unknown" | null;

export default async function getStripePlanType({
  customerId,
}: getPlanType): Promise<{
  planType: "standard" | "pro" | "premium" | "unknown" | null;
  message: string;
  type: "success" | "error";
}> {
  try {
    // Retrieve the customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      expand: ["data.plan.product"],
    });

    if (subscriptions.data.length === 0) {
      console.log("No active subscriptions found for this customer.");
      return {
        planType: null,
        message: "No active subscriptions found for this customer.",
        type: "error",
      };
    }

    // Get the product ID of the first active subscription
    const productId = subscriptions.data[0].items.data[0].plan
      .product as string;
    console.log("Product ID:", productId);

    // our product IDs
    const standardPlanId = "prod_R8GOJgxQ8PL5Ni";
    const proPlanId = "prod_R8HyIvBtoPquxZ";
    const premiumPlanId = "prod_R8I4JDxRC2DJb1";

    // Determining the plan type based on the product ID
    let planType: PlanType = "unknown";
    switch (productId) {
      case standardPlanId:
        planType = "standard";
        break;
      case proPlanId:
        planType = "pro";
        break;
      case premiumPlanId:
        planType = "premium";
        break;
    }

    console.log(`Customer's plan type: ${planType}`);
    if (planType === "unknown") {
      return {
        planType: "unknown",
        message: "Unknown product Type",
        type: "error",
      };
    }
    return {
      planType,
      message: "Customer's plan type retrieved successfully",
      type: "success",
    };
  } catch (error) {
    console.error("Error retrieving customer plan:", error);
    return {
      planType: null,
      message: "Error retrieving customer plan",
      type: "error",
    };
  }
}

// Example usage
// const customerId = "cus_example123";
// getCustomerPlanType(customerId);

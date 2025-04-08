import { getTutorCustomerData } from "@/firebase/stripe/getTutor'sCustomerId";
import {  z } from "zod";

const cancelSubscriptionSchema = z.object({
  uid: z.string().min(1, "uid is required"),
});

export const cancelSubscriptionService = async (
  uid: z.infer<typeof cancelSubscriptionSchema>
) => {
  const validationResult = cancelSubscriptionSchema.safeParse(uid);
  if (validationResult.success) {
    try {
      const customerData = await getTutorCustomerData(uid);
      if (customerData.type === "error") {
        return {
          type: "error",
          message: customerData.message,
        };
      } else if (customerData.subscriptionStatus === "canceled") {
        return {
          type: "error",
          message: "Subscription already cancelled",
        };
      } else {
        const response = await fetch("/api/payment/cancel-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customerData.customerId,
            planType: customerData.planType,
          }),
        });

        if (response.ok) {
          return {
            type: "success",
            message: "Subscription cancelled successfully",
          };
        } else {
          const data = await response.json();
          return {
            type: "error",
            message: data.message || "Failed to cancel subscription",
          };
        }
      }
    } catch (e) {
      return {
        type: "error",
        message:
          e instanceof Error
            ? e.message
            : "Failed to cancel subscription, try again later",
      };
    }
  } else {
    return {
      type: "error",
      message: validationResult.error.message,
    };
  }
};

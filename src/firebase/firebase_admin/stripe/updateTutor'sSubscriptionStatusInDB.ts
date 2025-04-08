import { adminDb } from "../initializeAdmin";
import z from "zod";

const validateCustomerData = z.object({
  uid: z.string().min(4, "UID is required"),
  subscriptionStatus: z.string().min(1, "PlanStatus is required"),
});

type CustomerType = z.infer<typeof validateCustomerData>;

export default async function updateTutorsSubscriptionStatus({
  uid,
  subscriptionStatus,
}: CustomerType): Promise<{
  message: string;
  type: "success" | "error";
}>{
  try {
    validateCustomerData.parse({
      uid,
      subscriptionStatus,
    });

    await adminDb.collection("TUTORS").doc(uid).set(
      {
        subscription_status: subscriptionStatus,
      },
      { merge: true }
    );
    

    return { message: "Customer subscription status updated successfully", type: "success" };
  } catch (error: any) {
    return { message: error.message, type: "error" };
  }
};



import { adminDb } from "../initializeAdmin";
import z from "zod";

const validateCustomerData = z.object({
  uid: z.string().min(4, "UID is required"),
  customerId: z.string().min(4, "CustomerId is required"),
  planType: z.string().min(1, "PlanType is required"),
});

type CustomerType = z.infer<typeof validateCustomerData>;

const addTutorAsCustomerToDB = async ({
  uid,
  customerId,
  planType,
}: CustomerType): Promise<{
  message: string;
  type: "success" | "error";
}> => {
  console.log("tutor data arrived in fn :", customerId, planType);
  try {
    validateCustomerData.parse({
      uid,
      customerId,
      planType,
    });

    await adminDb
      .collection("TUTORS")
      .doc(uid)
      .collection("TUTOR_SECRETS")
      .doc("STRIPE")
      .set({ stripe_customer_id: customerId });

    await adminDb.collection("TUTORS").doc(uid).set(
      {
        planType: planType,
      },
      { merge: true }
    );

    return { message: "Customer added successfully", type: "success" };
  } catch (error: any) {
    return { message: error.message, type: "error" };
  }
};

export default addTutorAsCustomerToDB;

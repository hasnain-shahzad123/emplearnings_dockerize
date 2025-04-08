import { adminDb } from "../initializeAdmin";
import z from "zod";

const validateCustomerData = z.object({
  uid: z.string().min(4, "UID is required"),
});

type CustomerType = z.infer<typeof validateCustomerData>;

const removeTutorAsCustomerToDB = async ({
  uid,
}: CustomerType): Promise<{
  message: string;
  type: "success" | "error";
}> => {
  try {
    validateCustomerData.parse({ uid });

    await adminDb
      .collection("TUTORS")
      .doc(uid)
      .collection("TUTOR_SECRETS")
      .doc("STRIPE")
      .delete();

    await adminDb.collection("TUTORS").doc(uid).set(
      {
        subscription_status: "canceled",
      },
      { merge: true }
    );

    return { message: "Customer removed successfully", type: "success" };
  } catch (error: any) {
    console.error("Error removing customer:", error);
    return { message: error.message, type: "error" };
  }
};

export default removeTutorAsCustomerToDB;

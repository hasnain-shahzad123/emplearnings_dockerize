import { z } from "zod";
import { firestore } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const getCustomerIdSchema = z.object({
  uid: z.string().min(1, "UID is required"),
});

export const getTutorCustomerData = async ({
  uid,
}: z.infer<typeof getCustomerIdSchema>) => {
  const validationResult = getCustomerIdSchema.safeParse({ uid });
  if (!validationResult.success) {
    return {
      type: "error",
      customerId: null,
      planType: null,
      subscriptionStatus: null,
      message: validationResult.error.message,
    };
  }

  try {
    const tutorDocRef = doc(firestore, "TUTORS", uid);
    const tutorDocSnap = await getDoc(tutorDocRef);

    if (!tutorDocSnap.exists()) {
      return {
        type: "error",
        customerId: null,
        planType: null,
        subscriptionStatus: null,
        message: "Tutor not found",
      };
    }

    const tutorData = tutorDocSnap.data();
    const planType = tutorData?.planType || null;
    const subscriptionStatus = tutorData?.subscription_status || null;

    const stripeDocRef = doc(
      firestore,
      "TUTORS",
      uid,
      "TUTOR_SECRETS",
      "STRIPE"
    );
    const stripeDocSnap = await getDoc(stripeDocRef);

    let customerId = null;
    if (stripeDocSnap.exists()) {
      const stripeData = stripeDocSnap.data();
      customerId = stripeData?.stripe_customer_id || null;
    }

    return {
      type: "success",
      customerId,
      planType,
      subscriptionStatus,
      message:
        "Customer ID, plan type, and subscription status fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching tutor data:", error);
    return {
      type: "error",
      customerId: null,
      planType: null,
      subscriptionStatus: null,
      message: "Failed to fetch tutor data",
    };
  }
};

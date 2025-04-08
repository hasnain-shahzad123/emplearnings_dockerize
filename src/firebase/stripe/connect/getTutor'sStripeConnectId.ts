import { firestore } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { z } from "zod";

const getTutorStripeConnectIdSchema = z.object({
  uid: z.string().min(1, "Request made without uid"),
});
const getTutorStripeConnectId = async ({
  uid,
}: {
  uid: string;
}): Promise<{
  type: string;
  message: string | string[];
  stripeConnectId?: string;
  errorType?: "db_error" | "no_stripe_account" | "no_stripe_id";
}> => {
  const validationResult = getTutorStripeConnectIdSchema.safeParse({ uid });

  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors.map((e) => e.message),
    };
  }

  try {
    const tutorDocRef = doc(firestore, "TUTORS", uid);
    const stripeConnectRef = doc(
      collection(tutorDocRef, "TUTOR_SECRETS"),
      "STRIPE_CONNECT"
    );

    const stripeConnectDoc = await getDoc(stripeConnectRef);

    // Case 1: Document doesn't exist
    if (!stripeConnectDoc.exists()) {
      return {
        type: "error",
        message: "No Stripe Connect account found for this tutor",
        errorType: "no_stripe_account",
      };
    }

    const stripeConnectData = stripeConnectDoc.data();

    // Case 2: Document exists but no `stripe_connect_id`
    if (!stripeConnectData?.stripe_connect_id) {
      return {
        type: "error",
        message: "Stripe Connect ID is missing for this tutor",
        errorType: "no_stripe_id",
      };
    }

    // Case 3: Successfully fetched the ID
    return {
      type: "success",
      message: "Successfully fetched Stripe Connect ID",
      stripeConnectId: stripeConnectData.stripe_connect_id,
    };
  } catch (error) {
    // Case 4: Database error
    console.error("Database error while fetching Stripe Connect ID:", error);
    return {
      type: "error",
      message: "Failed to fetch Stripe Connect data due to a database error",
      errorType: "db_error",
    };
  }
};

export default getTutorStripeConnectId
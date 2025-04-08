import { firestore } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { z } from "zod";

const hasTutorCompletedVerificationSchema = z.object({
  uid: z.string().min(1, "Request made without uid"),
});

const hasTutorCompletedVerification = async ({
  uid,
}: {
  uid: string;
}): Promise<{
  type: string;
  message: string | string[];
  hasCompletedVerification?: boolean;
}> => {
  const validationResult = hasTutorCompletedVerificationSchema.safeParse({
    uid,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((e) => {
      return e.message;
    });
    return {
      type: "error",
      message: errors,
    };
  }

  try {
    const tutorDocRef = doc(firestore, "TUTORS", uid);
    const stripeConnectRef = doc(
      collection(tutorDocRef, "TUTOR_SECRETS"),
      "STRIPE_CONNECT"
    );
    const stripeConnectDoc = await getDoc(stripeConnectRef);

    if (!stripeConnectDoc.exists()) {
      return {
        type: "success",
        message: "successfully checked",
        hasCompletedVerification: false,
      };
    }

    const stripeConnectData = stripeConnectDoc.data();
    if (
      stripeConnectData.stripe_connect_id &&
      !stripeConnectData.connect_account_verified
    ) {
      return {
        type: "success",
        hasCompletedVerification: false,
        message: "successfully checked",
      };
    }
    if (stripeConnectData.connect_account_verified === true)
      return {
        type: "success",
        hasCompletedVerification: true,
        message: "successfully checked",
      };
  } catch (error) {
    return {
      type: "error",
      message: "Failed to fetch stripe connect data from db",
    };
  }
  return {
    type: "error",
    message: "Failed to fetch stripe connect data from db",
  };
};

export default hasTutorCompletedVerification;

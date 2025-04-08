import { firestore } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
import { z } from "zod";

const hasTutorOnboardedSchema = z.object({
  uid: z.string().min(1, "Request made without uid"),
});

const hasTutorOnboarded = async ({
  uid,
}: {
  uid: string;
}): Promise<{
  type: string;
  message: string | string[];
  hasOnboarded?: boolean;
}> => {
  const validationResult = hasTutorOnboardedSchema.safeParse({ uid });

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
        hasOnboarded: false,
      };
    }

    const stripeConnectData = stripeConnectDoc.data();
    if (
      stripeConnectData.has_finished_onboarding &&
      stripeConnectData.has_finished_onboarding === true
    ) {
      return {
        type: "success",
        hasOnboarded: true,
        message: "successfully checked",
      };
    } else {
      return {
        type: "success",
        hasOnboarded: false,
        message: "successfully checked",
      };
    }
  } catch (error) {
    return {
      type: "error",
      message: "Failed to fetch stripe connect data from db",
    };
  }
};

export default hasTutorOnboarded;

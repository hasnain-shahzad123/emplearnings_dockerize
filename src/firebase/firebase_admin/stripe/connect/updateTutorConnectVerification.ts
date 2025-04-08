// This function updates the verification status of a tutor's Stripe Connect account.
// It accepts an objeect having Tutor's UID and verification status.
// Updates are made in Firestore under the TUTORS collection in a TUTOR_SECRETS subcollection.
// Success returns a confirmation message, while errors (validation/database) return appropriate error messages.

import z from "zod";
import {adminDb} from "../../initializeAdmin";
import { FirebaseError } from "firebase/app";

type ConnectVerificationUpdationResponse = {
  message: string;
  type: "success" | "error";
};

// Schema for validating input data with strict requirements
const tutorConnectVerificationSchema = z.object({
  uid: z.string().min(4, "Tutor ID must be at least 4 characters"),
  status: z.boolean({
    required_error: "Status is required",
    invalid_type_error: "Status must be a boolean",
  }),
});

type TutorConnectVerificationInput = z.infer<
  typeof tutorConnectVerificationSchema
>;

const updateTutorConnectVerification = async ({
  uid,
  status,
}: TutorConnectVerificationInput): Promise<ConnectVerificationUpdationResponse> => {
  try {
    // Validating input data against schema
    tutorConnectVerificationSchema.parse({ uid, status });

    // Performing Firestore update
    await adminDb
      .collection("TUTORS")
      .doc(uid)
      .collection("TUTOR_SECRETS")
      .doc("STRIPE_CONNECT")
      .set({ connect_account_verified: status }, { merge: true });
    // Returning success response with status confirmation
    return {
      type: "success",
      message: `Tutor verification updated successfully. Status: ${status}`,
    };
  } catch (error) {
    //  Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      console.error("Validation error:", errorMessage);
      return {
        type: "error",
        message: `Input validation failed: ${errorMessage}`,
      };
    }

    //  Firebase errors
    if (error instanceof FirebaseError) {
      console.error("Firestore error:", error);
      return {
        type: "error",
        message: `Database operation failed: ${error}`,
      };
    }

    //  unexpected errors
    console.error("Unexpected error:", error);
    return {
      type: "error",
      message: "An unexpected error occurred while updating verification",
    };
  }
};

export default updateTutorConnectVerification;

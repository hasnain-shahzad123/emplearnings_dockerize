import z from "zod";
import {adminDb} from "../../initializeAdmin";
import { FirebaseError } from "firebase/app";

type PayoutStatusUpdationResponse = {
  message: string;
  type: "success" | "error";
};

// Schema for validating input data with strict requirements
const tutorPayoutStatusSchema = z.object({
  uid: z.string().min(4, "Tutor ID must be at least 4 characters"),
  hasErrored: z.boolean({
    required_error: "hasErrored is required",
    invalid_type_error: "hasErrored must be a boolean",
  }),
});

type TutorPayoutStatusInput = z.infer<typeof tutorPayoutStatusSchema>;

const updateTutorPayoutStatus = async ({
  uid,
  hasErrored,
}: TutorPayoutStatusInput): Promise<PayoutStatusUpdationResponse> => {
  try {
    // Validating input data against schema
    tutorPayoutStatusSchema.parse({ uid, hasErrored });

    // Performing Firestore update
    await adminDb
      .collection("TUTORS")
      .doc(uid)
      .collection("TUTOR_SECRETS")
      .doc("STRIPE_CONNECT")
      .set({ payout_has_errored: hasErrored }, { merge: true });

    // Returning success response with status confirmation
    return {
      type: "success",
      message: `Tutor payout status updated successfully. Status: ${hasErrored}`,
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
      message: "An unexpected error occurred while updating payout status",
    };
  }
};

export default updateTutorPayoutStatus;

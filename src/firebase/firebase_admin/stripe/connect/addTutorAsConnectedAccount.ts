// This function adds a tutor as a Stripe Connect account in our system.
// It accepts an object containing the tutor's UID and their Stripe Connect ID.
// The data is stored in Firestore under the TUTORS collection in a TUTOR_SECRETS subcollection.
// Success returns a confirmation message, while errors (validation/database) return appropriate error messages.

import {adminDb} from "../../initializeAdmin";
import z from "zod";

// Define response type for consistent error handling
type addTutorConnectAccountResponse = {
  message: string;
  type: "success" | "error";
};

// Schema for validating input data with specific Stripe Connect format
const connectAccountSchema = z.object({
  uid: z.string().min(4, "Tutor ID must be at least 4 characters"),
  stripeConnectId: z
    .string()
    .min(4, "Invalid Stripe Connect ID")
    .regex(/^acct_/, "Invalid Stripe Connect ID format")
    .describe("Stripe Connect account ID"),
});

type ConnectAccountInput = z.infer<typeof connectAccountSchema>;

const addTutorAsConnectedAccount = async ({
  uid,
  stripeConnectId,
}: ConnectAccountInput): Promise<addTutorConnectAccountResponse> => {
  try {
    // Validating the input data against schema
    connectAccountSchema.parse({
      uid,
      stripeConnectId,
    });

    // Adding the data to Firestore
    const docRef = adminDb
      .collection("TUTORS")
      .doc(uid)
      .collection("TUTOR_SECRETS")
      .doc("STRIPE_CONNECT");

    const existingDoc = await docRef.get();
    //Already linked with stripe connect
    if (existingDoc.exists) {
      const existingData = existingDoc.data();
      if (existingData?.stripe_connect_id) {
        return {
          message: `Tutor already has a connected account: ${existingData.stripe_connect_id}`,
          type: "error",
        };
      }
    }
    await docRef.set({ stripe_connect_id: stripeConnectId });
    // Returning success response
    return {
      message: "Tutor successfully added as a connected account",
      type: "success",
    };
  } catch (error) {
    //  Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      console.error("Validation error:", errorMessage);
      return {
        message: `Input validation failed: ${errorMessage}`,
        type: "error",
      };
    }

    // Firestore errors
    if ((error as { code?: string; message?: string }).code) {
      const firestoreError = error as { code: string; message: string };
      console.error("Firestore error:", firestoreError.message);
      return {
        message: `Database operation failed: ${firestoreError.message}`,
        type: "error",
      };
    }

    // unexpected errors
    console.error("Unexpected error:", error);
    return {
      message:
        "An unexpected error occurred while adding the connected account.",
      type: "error",
    };
  }
};
export default addTutorAsConnectedAccount;

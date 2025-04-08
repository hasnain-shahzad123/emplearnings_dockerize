import { z } from "zod";
import { adminDb } from "../../initializeAdmin";
import { FirebaseError } from "firebase/app";

const hasTutorOnboardedSchema = z.object({
	uid: z.string().min(1, "uid was required"),
	status: z.boolean(),
});
const updateTutorOnboardingStatus = async ({
	uid,
	status,
}: z.infer<typeof hasTutorOnboardedSchema>) => {
	const validationResult = hasTutorOnboardedSchema.safeParse({ uid, status });
	if (validationResult.error) {
		const errors = validationResult.error.errors.flatMap((e) => {
			return e.message;
		});

		return {
			type: "error",
			message: "invalid request to firebase function" + errors,
		};
	} else {
		try {
			await adminDb
				.collection("TUTORS")
				.doc(uid)
				.collection("TUTOR_SECRETS")
				.doc("STRIPE_CONNECT")
				.set({ has_finished_onboarding: status }, { merge: true });
			return {
				type: "success",
				message: `Tutor onboarding status updated successfully. Status: ${status}`,
			};
		} catch (error) {
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
				message:
					"An unexpected error occurred while updating onboarding status",
			};
		}
	}
};
export default updateTutorOnboardingStatus;

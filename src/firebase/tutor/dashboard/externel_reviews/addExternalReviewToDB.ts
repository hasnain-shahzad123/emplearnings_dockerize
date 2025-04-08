"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import z from "zod";

const addTutorExternalReviewsDataSchema = z.object({
	uid: z.string().min(1, "uid must be atleast 1 character long"),
	external_review: z.object({
		external_platform: z
			.string()
			.min(1, "external_platform must be atleast 1 character long"),
		review_from: z
			.string()
			.min(1, "review_from must be atleast 1 character long"),
		is_verified: z.boolean(),
		review_link: z
			.string()
			.min(1, "review_link must be atleast 1 character long"),
		review_content: z
			.string()
			.min(1, "review_content must be atleast 1 character long"),
	}),
});

type addTutorExternalReviewsDataInput = z.infer<
	typeof addTutorExternalReviewsDataSchema
>;

export default async function addTutorExternalReviewToDB({
	uid,
    external_review,
}: addTutorExternalReviewsDataInput): Promise<{
	type: "success" | "error";
	message: string;
}> {
	try {
		// Validate the input data

		addTutorExternalReviewsDataSchema.parse({
			uid,
            external_review
		});

		// Fetch external_reviews document
		const external_reviewsRef = doc(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_EXTERNAL_REVIEWS",
			uid
		);

		await updateDoc(external_reviewsRef, {
			external_reviews: arrayUnion(external_review),
		});

		// Return the response
		return {
			type: "success",
			message: "Successfully added external_review to DB.",
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard external_reviews.",
		};
	}
}

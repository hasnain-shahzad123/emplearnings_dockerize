"use client";
import { firestore } from "@/firebase/firebaseConfig";
import {
	TutorDocumentDataType,
	TutorCertificationsDataType,
	TutorExternalReviewsDataType,
} from "@/types";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import z from "zod";

const getTutorExternalReviewsDataSchema = z.object({
	uid: z.string().min(1, "uid is required"),
	updateIndex: z.number().int().min(0, "updateIndex is required"),
	external_reviews: z.array(
		z.object({
			external_platform: z
				.string()
				.min(1, "external_platform must be atleast 1 character long"),
			review_from: z
				.string()
				.min(1, "Review_from must be atleast 1 character long"),
			is_verified: z.boolean(),
			review_link: z
				.string()
				.min(1, "Review_link must be atleast 1 character long"),
			review_content: z
				.string()
				.min(1, "Review_content must be atleast 1 character long"),
		})
	),
	newReview: z.object({
		external_platform: z
			.string()
			.min(1, "external_platform must be atleast 1 character long"),
		review_from: z
			.string()
			.min(1, "Review_from must be atleast 1 character long"),
		is_verified: z.boolean(),
		review_link: z
			.string()
			.min(1, "Review_link must be atleast 1 character long"),
		review_content: z
			.string()
			.min(1, "Review_content must be atleast 1 character long"),
	}),
});

type GetTutorExternalReviewsDataInput = z.infer<
	typeof getTutorExternalReviewsDataSchema
>;

export default async function updateTutorExternalReviewFromDB({
	uid,
	updateIndex,
	newReview,
	external_reviews,
}: GetTutorExternalReviewsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	external_reviews: TutorExternalReviewsDataType[] | null;
}> {
	try {
		// Validate the input data
		getTutorExternalReviewsDataSchema.parse({
			uid,
			updateIndex,
			newReview,
			external_reviews,
		});

		// Fetch external_reviews

		const updatedCertifications = external_reviews.map((cert, certIndex) => {
			if (certIndex === updateIndex) {
				return newReview;
			} else {
				return cert;
			}
		});

		// Assign external_reviews or fallback to default
		await updateDoc(
			doc(firestore, "TUTORS", uid, "TUTOR_EXTERNAL_REVIEWS", uid),
			{
				external_reviews: updatedCertifications,
			}
		);
		// Return the response
		return {
			type: "success",
			external_reviews: updatedCertifications,
			message: "Fetched tutor dashboard data successfully.",
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				external_reviews: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				external_reviews: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard external_reviews.",
			external_reviews: null,
		};
	}
}

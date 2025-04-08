"use client";
import { TutorExternalReviewsDataType } from "@/components/tutorPages/personel_info/education/ExternalReviews";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import z from "zod";

const getTutorReviewsDataSchema = z.object({
	uid: z.string().min(1, "uid is required"),
	deleteIndex: z.number().int().min(0, "deleteIndex is required"),
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
});

type GetTutorReviewsDataInput = z.infer<typeof getTutorReviewsDataSchema>;

export default async function deleteTutorExternalReviewsFromDB({
	uid,
	deleteIndex,
	external_reviews,
}: GetTutorReviewsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	external_reviews: TutorExternalReviewsDataType[] | null;
}> {
	try {
		// Validate the input data
		getTutorReviewsDataSchema.parse({
			uid,
			deleteIndex,
			external_reviews,
		});

		// Fetch Reviews

		const filteredReviews = external_reviews.filter(
			(_, certIndex) => certIndex !== deleteIndex
		);

		// Assign Reviews or fallback to default
		await updateDoc(
			doc(firestore, "TUTORS", uid, "TUTOR_EXTERNAL_REVIEWS", uid),
			{
				external_reviews: filteredReviews,
			}
		);

		// Return the response
		return {
			type: "success",
			external_reviews: filteredReviews,
			message: "Fetched tutor external reviews successfully.",
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
			message: "Failed to fetch tutor dashboard Reviews.",
			external_reviews: null,
		};
	}
}

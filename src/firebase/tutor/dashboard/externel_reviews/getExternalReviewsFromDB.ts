import React from "react";
import z from "zod";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { TutorExternalReviewsDataType } from "@/types";

const getTutorExternalReviewsDataSchema = z.object({
	uid: z.string().min(1, "uid must be atleast 1 character long"),
});

type GetTutorExternalReviewsDataInput = z.infer<
	typeof getTutorExternalReviewsDataSchema
>;

export default async function getTutorExternalReviewsFromDB({
	uid,
}: GetTutorExternalReviewsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	ExternalReviewsData: TutorExternalReviewsDataType[] | null;
}> {
	try {
		// Validate the input data
		getTutorExternalReviewsDataSchema.parse({ uid });

		// Fetch ExternalReviews document
		const ExternalReviewsRef = doc(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_EXTERNAL_REVIEWS",
			uid
		);

		const ExternalReviewsDoc = await getDoc(ExternalReviewsRef);
		const ExternalReviewsData = ExternalReviewsDoc.data()
			?.external_reviews as TutorExternalReviewsDataType[];

		// Return the response
		return {
			type: "success",
			ExternalReviewsData: ExternalReviewsData,
			message: "Fetched tutor ExternalReviews data successfully.",
		};
	} catch (error: any) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				ExternalReviewsData: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				ExternalReviewsData: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor ExternalReviews ExternalReviews.",
			ExternalReviewsData: null,
		};
	}
}

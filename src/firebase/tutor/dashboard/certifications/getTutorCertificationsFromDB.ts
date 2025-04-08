"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorDocumentDataType, TutorCertificationsDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import { collection, doc, getDoc } from "firebase/firestore";
import z from "zod";

const getTutorCertificationsDataSchema = z.object({
	uid: z.string(),
});

const defaultcertifications: TutorCertificationsDataType[] = [];
type GetTutorCertificationsDataInput = z.infer<
	typeof getTutorCertificationsDataSchema
>;

export default async function getTutorCertificationsFromDB({
	uid,
}: GetTutorCertificationsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	certifications: TutorCertificationsDataType[] | null;
}> {
	try {
		// Validate the input data
		getTutorCertificationsDataSchema.parse({ uid });

		// Fetch certifications document
		const certificationsRef = doc(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_CERTIFICATIONS",
			uid
		);

		const certificationsDoc = await getDoc(certificationsRef);
		let certificationsArray: TutorCertificationsDataType[] = [];
		if (certificationsDoc.exists()) {
			// Get the certifications array directly from the 'certifications' field
			const data = certificationsDoc.data();
			certificationsArray = data.certifications || [];
		}

		// Return the response
		return {
			type: "success",
			certifications: certificationsArray,
			message: "Fetched tutor dashboard data successfully.",
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				certifications: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				certifications: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard certifications.",
			certifications: null,
		};
	}
}

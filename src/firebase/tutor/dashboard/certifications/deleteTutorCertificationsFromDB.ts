"use client";
import { firestore, storage } from "@/firebase/firebaseConfig";
import { deleteObject, ref } from "firebase/storage";
import { TutorDocumentDataType, TutorCertificationsDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import z from "zod";

const getTutorCertificationsDataSchema = z.object({
	uid: z.string().min(1, "uid is required"),
	deleteIndex: z.number().int().min(0, "deleteIndex is required"),
	certifications: z.array(
		z.object({
			uid: z.string().min(1, "uid is required"),
			certification_heading: z
				.string()
				.min(1, "certification_heading is required"),
			is_verified: z.boolean(),
			image_url: z.string().min(1, "image_url is required"),
		})
	),
});

const defaultcertifications: TutorCertificationsDataType[] = [];
type GetTutorCertificationsDataInput = z.infer<
	typeof getTutorCertificationsDataSchema
>;

export default async function deleteTutorCertificationsFromDB({
	uid,
	deleteIndex,
	certifications,
}: GetTutorCertificationsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	certifications: TutorCertificationsDataType[] | null;
}> {
	try {
		// Validate the input data
		getTutorCertificationsDataSchema.parse({
			uid,
			deleteIndex,
			certifications,
		});

		// Fetch certifications
		const certificationToDelete = certifications[deleteIndex];
		// Delete the certification image from the storage
		// Delete the certification image from the storage
		const imageRef = ref(storage, certificationToDelete.image_url);
		await deleteObject(imageRef);

		const filteredCertifications = certifications.filter(
			(_, certIndex) => certIndex !== deleteIndex
		);

		// Assign certifications or fallback to default
		await updateDoc(
			doc(firestore, "TUTORS", uid, "TUTOR_CERTIFICATIONS", uid),
			{
				certifications: filteredCertifications,
			}
		);
		// Return the response
		return {
			type: "success",
			certifications: filteredCertifications,
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

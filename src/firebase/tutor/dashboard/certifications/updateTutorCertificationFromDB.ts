"use client";
import { firestore, storage } from "@/firebase/firebaseConfig";
import { TutorDocumentDataType, TutorCertificationsDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import z from "zod";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

const getTutorCertificationsDataSchema = z.object({
	uid: z.string().min(1, "uid is required"),
	updateIndex: z.number().int().min(0, "updateIndex is required"),
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
	newCertification: z.object({
		uid: z.string().min(1, "uid is required"),
		certification_heading: z
			.string()
			.min(1, "certification_heading is required"),
		is_verified: z.boolean(),
		image_url: z.string().min(1, "image_url is required"),
	}),
	image_file: z.instanceof(File).nullable(),
});

type GetTutorCertificationsDataInput = z.infer<
	typeof getTutorCertificationsDataSchema
>;

export default async function updateTutorCertificationsFromDB({
	uid,
	updateIndex,
	newCertification,
	certifications,
	image_file,
}: GetTutorCertificationsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	certifications: TutorCertificationsDataType[] | null;
}> {
	try {
		// Validate the input data
		getTutorCertificationsDataSchema.parse({
			uid,
			updateIndex,
			certifications,
			newCertification,
			image_file,
		});
		console.log("Data is Certf",newCertification);
		debugger;

		if (image_file) {
			// Upload image to Firebase Storage
			const storageRef = ref(
				storage,
				`TUTOR_CERTIFICATIONS/${uid}/${updateIndex}`
			);
			await uploadBytes(storageRef, image_file);

			// Get the download URL
			newCertification.image_url = await getDownloadURL(storageRef);
		}

		const updatedCertifications = certifications.map((cert, certIndex) => {
			if (certIndex === updateIndex) {
				return newCertification;
			} else {
				return cert;
			}
		});

		// Assign certifications or fallback to default
		await updateDoc(
			doc(firestore, "TUTORS", uid, "TUTOR_CERTIFICATIONS", uid),
			{
				certifications: updatedCertifications,
			}
		);
		// Return the response
		return {
			type: "success",
			certifications: updatedCertifications,
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

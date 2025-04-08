"use client";
import { firestore, storage } from "@/firebase/firebaseConfig";
import { TutorDocumentDataType, TutorCertificationsDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import {
	collection,
	doc,
	addDoc,
	arrayUnion,
	updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import z from "zod";

const addTutorCertificationsDataSchema = z.object({
	uid: z.string(),
	certification: z.object({
		uid: z.string().min(1, "uid must be at least 1 character long"),
		certification_heading: z
			.string()
			.min(1, "certification_heading must be at least 1 character long"),
		is_verified: z.boolean(),
	}),
	image_file: z.instanceof(File),
	array_size: z.number().int().min(0, "array_size must be at least 0"),
});

type addTutorCertificationsDataInput = z.infer<
	typeof addTutorCertificationsDataSchema
>;

export default async function addTutorCertificationsToDB({
	uid,
	certification,
	image_file,
	array_size,
}: addTutorCertificationsDataInput): Promise<{
	type: "success" | "error";
	message: string;
}> {
	try {
		// Validate the input data
		addTutorCertificationsDataSchema.parse({
			uid,
			certification,
			image_file,
			array_size,
		});

		// Upload image to Firebase Storage
		const storageRef = ref(
			storage,
			`TUTORS/TUTOR_CERTIFICATIONS/${uid}/${array_size}`
		);
		await uploadBytes(storageRef, image_file);

		// Get the download URL
		const downloadURL = await getDownloadURL(storageRef);

		// Update the certification object with the image URL
		const updatedCertification = {
			...certification,
			image_url: downloadURL,
		};

		// Fetch certifications document
		const certificationsRef = doc(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_CERTIFICATIONS",
			uid
		);

		await updateDoc(certificationsRef, {
			certifications: arrayUnion(updatedCertification),
		});

		// Return the response
		return {
			type: "success",
			message: "Successfully added certification to DB.",
		};
	} catch (error) {
		console.error("Error adding tutor certification:", error);

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
			message: "Failed to add tutor certification.",
		};
	}
}

"use client";
import { FirebaseError } from "firebase/app";
import { collection, doc, updateDoc } from "firebase/firestore";
import z from "zod";
import { firestore } from "@/firebase/firebaseConfig";

const addYearsOfExperienceToDBSchema = z.object({
	uid: z.string(),
	experience: z.number().min(0, "Experience must be a positive number"),
});

type AddYearsOfExperienceToDBInput = z.infer<
	typeof addYearsOfExperienceToDBSchema
>;

export default async function addTutorYearsOfExperienceToDB({
	uid,
	experience,
}: AddYearsOfExperienceToDBInput): Promise<{
	type: "success" | "error";
	message: string;
}> {
	try {
		// Validate the input data
		addYearsOfExperienceToDBSchema.parse({ uid, experience });

		// Add the years of experience to the database
		const docRef = doc(firestore, "TUTORS", uid);
		await updateDoc(docRef, {
			experience_years: experience,
		});

		// Return the response
		return {
			type: "success",
			message: "Years of experience added successfully.",
		};
	} catch (error) {
		console.error("Error adding years of experience to DB:", error);

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
			message: "Failed to add years of experience to DB.",
		};
	}
}

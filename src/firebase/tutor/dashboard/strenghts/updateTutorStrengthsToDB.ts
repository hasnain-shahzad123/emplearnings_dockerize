"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorStrengthDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import z from "zod";

const addTutorStrengthsDataSchema = z.object({
	uid: z.string(),
	index: z.number().min(0, "index should be greater than or equal to zero."),
	new_strength: z.object({
		heading: z
			.string()
			.min(1, "Strength_heading must be atleast 1 character long"),
		domain: z
			.string()
			.min(1, "Strength_domain must be atleast 1 character long"),
		description: z
			.string()
			.min(1, "strength description must be atleast 1 character long"),
	}),
	strengths: z.array(
		z.object({
			heading: z
				.string()
				.min(1, "Strength_heading must be atleast 1 character long"),
			domain: z
				.string()
				.min(1, "Strength_domain must be atleast 1 character long"),
			description: z
				.string()
				.min(1, "strength dsescription must be atleast 1 character long"),
		})
	),
});

type addTutorStrengthsDataInput = z.infer<typeof addTutorStrengthsDataSchema>;

export default async function updateTutorStrengthsToDB({
	uid,
	new_strength,
	index,
	strengths,
}: addTutorStrengthsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	updated_strengths: TutorStrengthDataType[] | null;
}> {
	try {
		// Validate the input data
		addTutorStrengthsDataSchema.parse({ uid, strengths, index, new_strength });

		const StrengthsRef = doc(firestore, "TUTORS", uid, "TUTOR_STRENGTHS", uid);

		// Filter Strengths document

		const updatedStrengths = strengths.map((str, strIndex) => {
			if (strIndex === index) {
				return new_strength;
			} else {
				return str;
			}
		});

	
		await updateDoc(StrengthsRef, {
			strengths: updatedStrengths,
		});

		// Return the response
		return {
			type: "success",
			message: "Successfully updated Strength to DB.",
			updated_strengths: updatedStrengths,
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				updated_strengths: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				updated_strengths: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard Strengths.",
			updated_strengths: null,
		};
	}
}

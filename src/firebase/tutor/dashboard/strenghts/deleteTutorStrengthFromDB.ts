"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorStrengthDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import z from "zod";

const TutorStrengthsDataSchema = z.object({
	uid: z.string().min(1, "uid is required"),
	deleteIndex: z.number().int().min(0, "deleteIndex is required"),
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

type GetTutorStrengthsDataInput = z.infer<typeof TutorStrengthsDataSchema>;

export default async function deleteTutorStrengthsFromDB({
	uid,
	deleteIndex,
	strengths,
}: GetTutorStrengthsDataInput): Promise<{
	type: "success" | "error";
	message: string;
	strengths: TutorStrengthDataType[] | null;
}> {
	try {
		// Validate the input data
		TutorStrengthsDataSchema.parse({
			uid,
			deleteIndex,
			strengths,
		});

		// Fetch strengths

		const filteredStrengths = strengths.filter(
			(_, certIndex) => certIndex !== deleteIndex
		);

		// Assign strengths or fallback to default
		await updateDoc(doc(firestore, "TUTORS", uid, "TUTOR_STRENGTHS", uid), {
			strengths: filteredStrengths,
		});
		// Return the response
		return {
			type: "success",
			strengths: filteredStrengths,
			message: "Fetched tutor strenghts data successfully.",
		};
	} catch (error) {
		console.error("Error fetching tutor strenghts data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				strengths: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				strengths: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor strenghts strengths.",
			strengths: null,
		};
	}
}

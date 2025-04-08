"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import z from "zod";

const addTutorLessonRateSchema = z.object({
	tutor_uid: z.string().min(1, "UID must be at least 1 character long."),
	lesson_rate: z.number().min(1, "Lesson rate must be at least 1."),
});

type AddTutorLessonRateInput = z.infer<typeof addTutorLessonRateSchema>;

export default async function addUpdateTutorLessonRateToDB({
	tutor_uid,
	lesson_rate,
}: AddTutorLessonRateInput): Promise<{
	type: "success" | "error";
	message: string;
}> {
	try {
		// Validate the input data
		addTutorLessonRateSchema.parse({
			tutor_uid,
			lesson_rate,
		});

		// Reference to the tutor document
		const tutorRef = doc(firestore, "TUTORS", tutor_uid);

		// Update the document with the new lesson rate
		await updateDoc(tutorRef, {
			per_lesson_rate:lesson_rate,
		});

		// Return the success response
		return {
			type: "success",
			message: "Successfully added lesson rate to the database.",
		};
	} catch (error) {
		console.error("Error updating lesson rate in the database:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message:
					"Validation error: " + error.errors.map((e) => e.message).join(", "),
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Firebase error: " + error.message,
			};
		}

		return {
			type: "error",
			message: "An unexpected error occurred while adding the lesson rate.",
		};
	}
}

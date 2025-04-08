"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import {
	addDoc,
	arrayUnion,
	collection,
	doc,
	updateDoc,
} from "firebase/firestore";
import z from "zod";

const addTutorNewCategorySchema = z.object({
	tutor_uid: z.string().min(1, "uid must be atleast 1 character long"),
	new_category: z.object({
		category_name: z
			.string()
			.min(1, "category_name must be atleast 1 character long"),
		sub_category_name: z
			.string()
			.min(1, "sub_category_name must be atleast 1 character long"),
		sup_category: z
			.string()
			.min(1, "sub_category_name must be atleast 1 character long"),
	}),
});

type addTutorNewCategoryInput = z.infer<typeof addTutorNewCategorySchema>;

export default async function addTutorCategoryToDB({
	tutor_uid,
	new_category,
}: addTutorNewCategoryInput): Promise<{
	type: "success" | "error";
	message: string;
}> {
	try {
		// Validate the input data

		addTutorNewCategorySchema.parse({
			tutor_uid,
			new_category,
		});

		// Fetch external_reviews document
		const categories_Ref = doc(firestore, "TUTORS",tutor_uid);

		await updateDoc(categories_Ref, {
			categories: arrayUnion(new_category),
		});

		// Return the response
		return {
			type: "success",
			message: "Successfully added new category to DB.",
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

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
			message: "Failed to fetch tutor dashboard external_reviews.",
		};
	}
}

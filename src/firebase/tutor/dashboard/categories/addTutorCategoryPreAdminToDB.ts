"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorPendingCategoryType } from "@/types";
import { FirebaseError } from "firebase/app";
import {
	addDoc,
	collection,
	doc,
	updateDoc,
	arrayUnion,
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

export default async function addTutorCategoryPreAdminToDB({
	tutor_uid,
	new_category,
}: addTutorNewCategoryInput): Promise<{
	type: "success" | "error";
	message: string;
	category: TutorPendingCategoryType | null;
}> {
	try {
		// Validate the input data

		addTutorNewCategorySchema.parse({
			tutor_uid,
			new_category,
		});

		// Fetch external_reviews document
		const categories_Ref = collection(firestore, "PRE_CATEGORIES_ADMIN");

		const response = await addDoc(categories_Ref, {
			new_category,
			tutor_uid,
		});

		let category_with_doc_id = new_category as TutorPendingCategoryType;

		category_with_doc_id.pending_document_uid = response.id;

		const tutors_Ref = doc(firestore, "TUTORS", tutor_uid);

		await updateDoc(tutors_Ref, {
			pending_categories: arrayUnion(category_with_doc_id),
		});

		// Return the response
		return {
			type: "success",
			message: "Successfully added new category to DB.",
			category: category_with_doc_id,
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				category: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				category: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard external_reviews.",
			category: null,
		};
	}
}

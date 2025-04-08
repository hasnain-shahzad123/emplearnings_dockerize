"use client";
import { pending } from "@/assets";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc, arrayRemove, deleteDoc } from "firebase/firestore";
import z from "zod";

const deleteTutorNewCategorySchema = z.object({
	tutor_uid: z.string().min(1, "uid must be at least 1 character long"),
	new_category: z.object({
		category_name: z
			.string()
			.min(1, "category_name must be at least 1 character long"),
		sub_category_name: z
			.string()
			.min(1, "sub_category_name must be at least 1 character long"),
		sup_category: z
			.string()
			.min(1, "sub_category_name must be at least 1 character long"),
		pending_document_uid: z
			.string()
			.min(1, "pending_document_uid must be at least 1 character long"),
	}),
});

type deleteTutorNewCategoryInput = z.infer<typeof deleteTutorNewCategorySchema>;

export default async function deleteTutorCategoryFromDBPreAdmin({
	tutor_uid,
	new_category,
}: deleteTutorNewCategoryInput): Promise<{
	type: "success" | "error";
	message: string;
}> {
	try {
		// Validate the input data

		deleteTutorNewCategorySchema.parse({
			tutor_uid,
			new_category,
		});

		// Fetch external_reviews document
		const categories_Ref = doc(firestore, "TUTORS", tutor_uid);

		await updateDoc(categories_Ref, {
			pending_categories: arrayRemove(new_category),
		});

		// delete document from PRE_CATEGORIES_ADMIN

		const pre_categories_Ref = doc(
			firestore,
			"PRE_CATEGORIES_ADMIN",
			new_category.pending_document_uid
		);
        
		await deleteDoc(pre_categories_Ref);

		// Return the response
		return {
			type: "success",
			message: "Successfully deleted  category from DB.",
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
			message: "Failed to delete Tutor Category.",
		};
	}
}

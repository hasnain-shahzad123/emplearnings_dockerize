"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorCategoryType } from "@/types";
import { FirebaseError } from "firebase/app";
import { updateDoc, arrayUnion,arrayRemove, doc } from "firebase/firestore";
import z from "zod";

const updateTutorNewCategorySchema = z.object({
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
	old_category: z.object({
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
	categories_array: z.array(
		z.object({
			category_name: z
				.string()
				.min(1, "category_name must be atleast 1 character long"),
			sub_category_name: z
				.string()
				.min(1, "sub_category_name must be atleast 1 character long"),
			sup_category: z
				.string()
				.min(1, "sub_category_name must be atleast 1 character long"),
		})
	),
});

type updateTutorNewCategoryInput = z.infer<typeof updateTutorNewCategorySchema>;

export default async function updateTutorCategoryToDB({
	tutor_uid,
	new_category,
	old_category,
    categories_array
}: updateTutorNewCategoryInput): Promise<{
	type: "success" | "error";
	message: string;
    categories_array: TutorCategoryType[] | null;
}> {
	try {
		// Validate the input data

		updateTutorNewCategorySchema.parse({
			tutor_uid,
			new_category,
			old_category,
			categories_array,
		});

		categories_array.splice(categories_array.indexOf(old_category), 1,new_category);

		// Fetch external_reviews document
		const tutorRef = doc(firestore, "TUTORS", tutor_uid);
        console.log("Old category: ", old_category);
        console.log("New category: ", new_category);
		// Remove the old category and add the new category in a single update
		await updateDoc(tutorRef, {
			categories: arrayRemove(old_category),
		});

		await updateDoc(tutorRef, {
			categories: arrayUnion(new_category),
		});
        console.log("Updated categories array: ", categories_array);

		// Return the response
		return {
			type: "success",
			message: "Successfully updateed new category to DB.",
            categories_array: categories_array,
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
                categories_array: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				categories_array: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard external_reviews.",
			categories_array: null,
		};
	}
}

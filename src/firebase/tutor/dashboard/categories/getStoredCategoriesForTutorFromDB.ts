"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorStoredCategoriesDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import {
	getDoc,
	arrayUnion,
	collection,
	doc,
	updateDoc,
} from "firebase/firestore";

export default async function getTutorStoredCategoriesFromDB(): Promise<{
	type: "success" | "error";
	message: string;
	categories: TutorStoredCategoriesDataType | null;
}> {
	try {
		//fetch all the categories from the DB

		const categories_Ref = doc(firestore, "CATEGORIES", "1");
		const categoriesSnap = await getDoc(categories_Ref);
		const categoriesData =
			categoriesSnap.data() as TutorStoredCategoriesDataType;

		// Return the response
		return {
			type: "success",
			message: "Successfully geted new category to DB.",
			categories: categoriesData,
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				categories: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard external_reviews.",
			categories: null,
		};
	}
}

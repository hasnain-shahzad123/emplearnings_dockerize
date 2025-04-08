import {
	selfIntroduction,
	tutorCountry,
} from "@/types";

import { firestore} from "../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

// Contains functions related to saving the tutor's personal details to the database

const addTutorTaglineAndAboutToDB = async ({
	tutorId,
	tagline,
	about,
}: selfIntroduction) => {
	try {
		const tutorDocRef = doc(firestore, "TUTORS", tutorId);
		await updateDoc(tutorDocRef, { tagline, about });
		return {
			type: "success",
			message: "Updated tutor's self-introduction successfully",
		};
	} catch (error: unknown) {
		if (error instanceof FirebaseError) {
			console.error("Firebase error updating self-introduction:", error);
			return {
				type: "error",
				message: error.message,
			};
		} else {
			console.error("Unexpected error updating self-introduction:", error);
			return {
				type: "error",
				message:
					"An unexpected error occurred while updating self-introduction.",
			};
		}
	}
};



export default addTutorTaglineAndAboutToDB;
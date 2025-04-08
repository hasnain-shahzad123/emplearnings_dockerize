import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";

import z from "zod";
import { FirebaseError } from "firebase/app";

const funcSchema = z.object({
	tutorId: z.string().min(1, "Please provide a tutor ID"),
	newLanguageObject: z.object({
		language_name: z.string().min(1, "language name cannot be empty"),
		proficiency_level: z.string().min(1, "Please provide a proficiency level"),
	}),
});

type paramsType = z.infer<typeof funcSchema>;

const addTutorLanguageProficiencyToDB = async ({
	tutorId,
	newLanguageObject,
}: paramsType): Promise<{
	type: "success" | "error";
	message: string;
}> => {
	try {
		funcSchema.parse({ tutorId, newLanguageObject });

		const tutorDocRef = doc(firestore, "TUTORS", tutorId);
		await updateDoc(tutorDocRef, {
			languages: arrayUnion(newLanguageObject),
		});

		return {
			type: "success",
			message: "Updated tutor's language proficiencies successfully",
		};
	} catch (error: unknown) {
		if (error instanceof FirebaseError) {
			console.error("Firebase error updating language proficiencies:", error);
			return {
				type: "error",
				message: error.message,
			};
		} else {
			console.error("Unexpected error updating language proficiencies:", error);
			return {
				type: "error",
				message:
					"An unexpected error occurred while updating language proficiencies.",
			};
		}
	}
};

export default addTutorLanguageProficiencyToDB;

import { doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { tutorCountry } from "@/types";

const addCountryToDB = async ({
	tutorId,
	country,
}: tutorCountry): Promise<{
	type: "success" | "error";
	message: string;
}> => {
	try {
		const tutorDocRef = doc(firestore, "TUTORS", tutorId);
		await updateDoc(tutorDocRef, { country });
		return {
			type: "success",
			message: "Updated tutor's country",
		};
	} catch (error: unknown) {
		if (error instanceof FirebaseError) {
			console.error("Firebase error updating country:", error);
			return {
				type: "error",
				message: error.message,
			};
		} else {
			console.error("Unexpected error updating country:", error);
			return {
				type: "error",
				message: "An unexpected error occurred while updating tutor's country",
			};
		}
	}
};

export default addCountryToDB;

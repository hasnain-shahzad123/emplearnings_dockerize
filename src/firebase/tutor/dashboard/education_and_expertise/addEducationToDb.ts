import { firestore } from "@/firebase/firebaseConfig";
import { Education } from "@/types";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { z } from "zod";

const educationSchema = z.object({
	uid: z.string().min(1, "User ID can't be empty"),
	highest_degree: z.string().min(1, "Degree name can't be empty"),
	field_of_study: z.string().min(1, "Field can't be empty"),
	institution_name: z.string().min(1, "Institute can't be empty"),
	graduation_year: z
		.number()
		.min(1900, "Graduation year must be a valid year")
		.max(new Date().getFullYear(), "Graduation year can't be in the future"),
	is_verified: z.boolean().default(false),
});

type AddEducationToDBInput = z.infer<typeof educationSchema>;

const addTutorEducationToDB = async ({
	uid,
	highest_degree,
	field_of_study,
	institution_name,
	graduation_year,
	is_verified=false,
}: AddEducationToDBInput) => {
	
	const validationResult = educationSchema.safeParse({
		uid,
		highest_degree,
		field_of_study,
		institution_name,
		graduation_year,
		is_verified,
	});

	if (!validationResult.success) {
		const errors = validationResult.error.errors.map((err) => err.message);
		console.log("Zod errors: ", errors);
		return {
			type: "error",
			message: `${errors.join(", ")}`,
		};
	}

	try {
		const ref = doc(firestore, "TUTORS", uid, "TUTOR_EDUCATION", uid);
		await setDoc(ref, {
			highest_degree,
			field_of_study,
			institution_name,
			graduation_year,
			is_verified,
		});

		return {
			type: "success",
			message: "Education record saved successfully",
		};
	} catch (error) {
		console.error("Error saving education to Firestore:", error);
		return {
			type: "error",
			message:
				"An unexpected error occurred while saving your education details. Please try again later.",
		};
	}
};

export default addTutorEducationToDB;

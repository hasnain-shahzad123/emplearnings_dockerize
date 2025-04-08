import z from "zod";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { TutorTrialLessonScheduleDataType } from "@/types";

const deleteTutorTrialLessonScheduleSchema = z.object({
	uid: z.string().min(1, "uid must be atleast 1 character long"),
	lesson_schedule: z.object({
		day: z.string().min(1, "day must be atleast 1 character long"),
		lesson_index: z
			.number()
			.min(0, "index must be greater than equal to  0 character."),
	}),

	schedule: z.object({
		week_one: z.object({
			Sun: z.array(z.string()),
			Mon: z.array(z.string()),
			Tue: z.array(z.string()),
			Wed: z.array(z.string()),
			Thu: z.array(z.string()),
			Fri: z.array(z.string()),
			Sat: z.array(z.string()),
		})
	}),
});

type deleteTutorTrialLessonScheduleInput = z.infer<
	typeof deleteTutorTrialLessonScheduleSchema
>;

export default async function deleteTutorTrialLessonScheduleFromDB({
	uid,
	lesson_schedule,
	schedule,
}: deleteTutorTrialLessonScheduleInput): Promise<{
	type: "success" | "error";
	message: string;
	TrialLessonScheduleData: TutorTrialLessonScheduleDataType | null;
}> {
	try {
		// Validate the input data
		deleteTutorTrialLessonScheduleSchema.parse({
			uid,
			lesson_schedule,
			schedule,
		});
		// Fetch Tutor lesson schedule document

		const lessonScheduleRef = doc(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_TRIAL_LESSON_SCHEDULE",
			uid
		);

		// delete the new lesson schedule to the existing schedule

		schedule["week_one"][
			lesson_schedule.day as
				| "Sun"
				| "Mon"
				| "Tue"
				| "Wed"
				| "Thu"
				| "Fri"
				| "Sat"
		].splice(lesson_schedule.lesson_index, 1);

		// delete the new schedule to the database

		await updateDoc(lessonScheduleRef, {
			["week_one"]: schedule["week_one"],
		});

		// Return the response
		return {
			type: "success",
			TrialLessonScheduleData: schedule as TutorTrialLessonScheduleDataType,
			message: "Deleted tutor trail lesson schedule data successfully.",
		};
	} catch (error: any) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				TrialLessonScheduleData: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				TrialLessonScheduleData: null,
			};
		}

		return {
			type: "error",
			message: "Failed to delete tutor Tutor lesson schedule.",
			TrialLessonScheduleData: null,
		};
	}
}

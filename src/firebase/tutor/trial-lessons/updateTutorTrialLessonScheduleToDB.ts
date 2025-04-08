import z from "zod";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { TutorTrialLessonScheduleDataType } from "@/types";

const updateTutorTrialLessonScheduleSchema = z.object({
	uid: z.string().min(1, "uid must be atleast 1 character long"),
	lesson_schedule: z.object({
		day: z.string().min(1, "day must be atleast 1 character long"),
		time: z.string().min(1, "time must be atleast 1 character long"),
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
		}),
	}),
});

type updateTutorTrialLessonScheduleInput = z.infer<
	typeof updateTutorTrialLessonScheduleSchema
>;

export default async function updateTutorTrialLessonScheduleToDB({
	uid,
	lesson_schedule,
	schedule,
}: updateTutorTrialLessonScheduleInput): Promise<{
	type: "success" | "error";
	message: string;
	TrialLessonScheduleData: TutorTrialLessonScheduleDataType | null;
}> {
	try {
		// Validate the input data
		updateTutorTrialLessonScheduleSchema.parse({
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

		// update the new lesson schedule to the existing schedule

		schedule["week_one"][
			lesson_schedule.day as
				| "Sun"
				| "Mon"
				| "Tue"
				| "Wed"
				| "Thu"
				| "Fri"
				| "Sat"
		][lesson_schedule.lesson_index] = lesson_schedule.time;

		// Sorting the schedule times in ascending order
		schedule["week_one"][
			lesson_schedule.day as
				| "Sun"
				| "Mon"
				| "Tue"
				| "Wed"
				| "Thu"
				| "Fri"
				| "Sat"
		].sort((a, b) => {
			const parseTime = (time: string): number => {
				const [hourMinute, period] = time.split(" ");
				let [hour, minute] = hourMinute.split(":").map(Number);
				if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
				if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
				return hour * 60 + minute;
			};

			return parseTime(a) - parseTime(b);
		});

		// update the new schedule to the database

		await updateDoc(lessonScheduleRef, {
			week_one: schedule["week_one"],
		});

		// Return the response
		return {
			type: "success",
			TrialLessonScheduleData: schedule as TutorTrialLessonScheduleDataType,
			message: "Fetched tutor trial lesson schedule data successfully.",
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
			message: "Failed to update Tutor trail lesson schedule.",
			TrialLessonScheduleData: null,
		};
	}
}

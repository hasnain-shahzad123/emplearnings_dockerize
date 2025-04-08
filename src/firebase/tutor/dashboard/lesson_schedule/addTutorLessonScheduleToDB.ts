import React from "react";
import z from "zod";
import { addDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { TutorLessonScheduleDataType } from "@/types";

const addTutorLessonScheduleSchema = z.object({
	uid: z.string().min(1, "uid must be atleast 1 character long"),
	lesson_schedule: z.object({
		day: z.string().min(1, "day must be atleast 1 character long"),
		week: z.string().min(1, "week must be atleast 1 character long"),
		time: z.array(z.string().min(1, "time must be atleast 1 character long")),
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
		week_two: z.object({
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

type addTutorLessonScheduleInput = z.infer<typeof addTutorLessonScheduleSchema>;

export default async function addTutorLessonScheduleToDB({
	uid,
	lesson_schedule,
	schedule,
}: addTutorLessonScheduleInput): Promise<{
	type: "success" | "error";
	message: string;
	LessonScheduleData: TutorLessonScheduleDataType | null;
}> {
	try {
		// Validate the input data
		addTutorLessonScheduleSchema.parse({ uid, lesson_schedule, schedule });
		// Fetch Tutor lesson schedule document

		const lessonScheduleRef = doc(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_LESSON_SCHEDULE",
			uid
		);

		// Add the new lesson schedule to the existing schedule
		
		const updatedSchedule = structuredClone(schedule); // Deep clone
		updatedSchedule[lesson_schedule.week as "week_one" | "week_two"][
			lesson_schedule.day as
				| "Sun"
				| "Mon"
				| "Tue"
				| "Wed"
				| "Thu"
				| "Fri"
				| "Sat"
		].push(...lesson_schedule.time);


		// Sorting the schedule times in ascending order
		schedule[lesson_schedule.week as "week_one" | "week_two"][
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

		// Add the new schedule to the database

		await updateDoc(lessonScheduleRef, {
			[lesson_schedule.week as "week_one" | "week_two"]:
				schedule[lesson_schedule.week as "week_one" | "week_two"],
		});

		// Return the response
		return {
			type: "success",
			LessonScheduleData: schedule as TutorLessonScheduleDataType,
			message: "Fetched tutor Tutor lesson schedule data successfully.",
		};
	} catch (error: any) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				LessonScheduleData: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				LessonScheduleData: null,
			};
		}

		return {
			type: "error",
			message: "Failed to add tutor Tutor lesson schedule.",
			LessonScheduleData: null,
		};
	}
}

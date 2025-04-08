import React from "react";
import z from "zod";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { TutorLessonScheduleDataType } from "@/types";

const getTutorLessonScheduleSchema = z.object({
	uid: z.string().min(1, "uid must be atleast 1 character long"),
});

type GetTutorLessonScheduleInput = z.infer<typeof getTutorLessonScheduleSchema>;

export default async function getTutorLessonScheduleFromDB({
	uid,
}: GetTutorLessonScheduleInput): Promise<{
	type: "success" | "error";
	message: string;
	LessonScheduleData: TutorLessonScheduleDataType | null;
}> {
	try {
		// Validate the input data
		getTutorLessonScheduleSchema.parse({ uid });
         console.log("UID",uid)
		// Fetch Tutorlesson schedule document
		const ExternalReviewsRef = doc(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_LESSON_SCHEDULE",
			uid
		);

		const tutorLessonScheduleDoc = await getDoc(ExternalReviewsRef);
		const LessonScheduleData = tutorLessonScheduleDoc.data() as TutorLessonScheduleDataType;
         
		// Return the response
		return {
			type: "success",
			LessonScheduleData: LessonScheduleData,
			message: "Fetched tutor Tutorlesson schedule data successfully.",
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
			message: "Failed to fetch tutor Tutor lesson schedule.",
			LessonScheduleData: null,
		};
	}
}

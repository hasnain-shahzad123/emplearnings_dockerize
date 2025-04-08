import React from "react";
import z from "zod";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { TutorTrialLessonScheduleDataType } from "@/types";

const getTutorTrialLessonScheduleSchema = z.object({
  uid: z.string().min(1, "uid must be atleast 1 character long"),
});

type GetTutorTrialLessonScheduleInput = z.infer<
  typeof getTutorTrialLessonScheduleSchema
>;

export default async function getTutorTrialLessonScheduleFromDB({
  uid,
}: GetTutorTrialLessonScheduleInput): Promise<{
  type: "success" | "error";
  message: string;
  TrialLessonScheduleData: TutorTrialLessonScheduleDataType | null;
}> {
  try {
    // Validate the input data
    getTutorTrialLessonScheduleSchema.parse({ uid });
    // Fetch Tutorlesson schedule document
    const trialLessonsScheduleRef = doc(
      firestore,
      "TUTORS",
      uid,
      "TUTOR_TRIAL_LESSON_SCHEDULE",
      uid
    );

    const tutorLessonScheduleDoc = await getDoc(trialLessonsScheduleRef);
    let TrialLessonScheduleData =
      tutorLessonScheduleDoc.data() as TutorTrialLessonScheduleDataType;
    if (TrialLessonScheduleData === undefined) {
      TrialLessonScheduleData = {
        week_one: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        },
      } as TutorTrialLessonScheduleDataType;
    }

    return {
      type: "success",
      TrialLessonScheduleData: TrialLessonScheduleData,
      message: "Fetched tutor Tutor trial lesson schedule data successfully.",
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
      message: "Failed to fetch tutor Tutor trial lesson schedule.",
      TrialLessonScheduleData: null,
    };
  }
}

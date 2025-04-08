import React from "react";
import z from "zod";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { TutorTrialLessonScheduleDataType } from "@/types";

const addTutorTrialLessonScheduleSchema = z.object({
  uid: z.string().min(1, "uid must be at least 1 character long"),
  lesson_schedule: z.object({
    day: z.string().min(1, "day must be at least 1 character long"),
    time: z.array(z.string().min(1, "time must be at least 1 character long")),
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

type addTutorTrialLessonScheduleInput = z.infer<
  typeof addTutorTrialLessonScheduleSchema
>;

export default async function addTutorTrialLessonScheduleToDB({
  uid,
  lesson_schedule,
  schedule,
}: addTutorTrialLessonScheduleInput): Promise<{
  type: "success" | "error";
  message: string;
  TrialLessonScheduleData: TutorTrialLessonScheduleDataType | null;
}> {
  try {
    // Validate the input data
    addTutorTrialLessonScheduleSchema.parse({ uid, lesson_schedule, schedule });
    // Fetch Tutor lesson schedule document
    const lessonScheduleRef = doc(
      firestore,
      "TUTORS",
      uid,
      "TUTOR_TRIAL_LESSON_SCHEDULE",
      uid
    );
    const lessonScheduleSnap = await getDoc(lessonScheduleRef);

    if (!lessonScheduleSnap.exists()) {
      // Initialize schedule if it doesn't exist
      schedule = {
        week_one: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        },
      };

      await setDoc(lessonScheduleRef, schedule);
    } else {
      // Use existing schedule data
      schedule = lessonScheduleSnap.data() as TutorTrialLessonScheduleDataType;
    }
    // Merge the new lesson schedule time with the existing schedule
    const daySchedule =
      schedule["week_one"][
        lesson_schedule.day as
          | "Sun"
          | "Mon"
          | "Tue"
          | "Wed"
          | "Thu"
          | "Fri"
          | "Sat"
      ];

    // Push new lesson times into the array
    daySchedule.push(...lesson_schedule.time);

    // Sort the schedule times in ascending order
    daySchedule.sort((a, b) => {
      const parseTime = (time: string): number => {
        const [hourMinute, period] = time.split(" ");
        let [hour, minute] = hourMinute.split(":").map(Number);
        if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
        if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
        return hour * 60 + minute;
      };

      return parseTime(a) - parseTime(b);
    });

    // Update the schedule in Firebase
    await updateDoc(lessonScheduleRef, {
      week_one: schedule["week_one"],
    });

    // Return the response
    return {
      type: "success",
      message: "Tutor trial lesson schedule updated successfully.",
      TrialLessonScheduleData: schedule as TutorTrialLessonScheduleDataType,
    };
  } catch (error: any) {
    console.error("Error updating tutor lesson schedule:", error);

    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: "Validation error: " + error.message,
        TrialLessonScheduleData: null,
      };
    } else if (error instanceof FirebaseError) {
      return {
        type: "error",
        message: "Firebase error: " + error.message,
        TrialLessonScheduleData: null,
      };
    }

    return {
      type: "error",
      message: "Failed to update tutor trial lesson schedule.",
      TrialLessonScheduleData: null,
    };
  }
}

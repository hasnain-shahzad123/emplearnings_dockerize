"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorStrengthDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import z from "zod";

const getTutorStrengthsDataSchema = z.object({
  uid: z.string(),
});

type GetTutorStrengthsDataInput = z.infer<typeof getTutorStrengthsDataSchema>;
export default async function getTutorStrengthsFromDB({
  uid,
}: GetTutorStrengthsDataInput): Promise<{
  type: "success" | "error";
  message: string;
  strengths: TutorStrengthDataType | null;
}> {
  try {
    getTutorStrengthsDataSchema.parse({ uid });

    const strengthsRef = doc(firestore, "TUTORS", uid, "TUTOR_STRENGTHS", uid);
    const strengthsDoc = await getDoc(strengthsRef);

    if (!strengthsDoc.exists()) {
      return {
        type: "error",
        message: "Tutor Strengths document does not exist.",
        strengths: null,
      };
    }

    return {
      type: "success",
      message: "Fetched tutor strengths successfully.",
      strengths: strengthsDoc.data() as TutorStrengthDataType,
    };
  } catch (error) {
    console.error("Firestore error:", error);

    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: "Validation error: " + error.message,
        strengths: null,
      };
    } else if (error instanceof FirebaseError) {
      return {
        type: "error",
        message: "Firebase error: " + error.message,
        strengths: null,
      };
    }

    return {
      type: "error",
      message: "Unexpected error occurred.",
      strengths: null,
    };
  }
}

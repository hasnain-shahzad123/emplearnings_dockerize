"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { doc, setDoc, getDoc } from "firebase/firestore";
import z from "zod";

const addTutorStrengthDataSchema = z.object({
  uid: z.string(),
  strength: z.object({
    description: z
      .string()
      .min(10, "Strength must be at least 10 characters long"),
  }),
});

type addTutorStrengthDataInput = z.infer<typeof addTutorStrengthDataSchema>;

export default async function addTutorStrengthsToDB({
  uid,
  strength,
}: addTutorStrengthDataInput): Promise<{
  type: "success" | "error";
  message: string;
}> {
  try {
    addTutorStrengthDataSchema.parse({ uid, strength });

    const strengthRef = doc(firestore, "TUTORS", uid, "TUTOR_STRENGTHS", uid);
    

    await setDoc(strengthRef, {
      description: strength.description
    });

    return {
      type: "success",
      message: "Successfully added Strength to DB.",
    };
  } catch (error) {
    console.error("Error handling tutor strength:", error);

    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: "Error during data validation with zod: " + error.message,
      };
    } else if (error instanceof FirebaseError) {
      return {
        type: "error",
        message: "Error while interacting with Firebase: " + error.message,
      };
    }

    return {
      type: "error",
      message: "Failed to handle tutor strength.",
    };
  }
}
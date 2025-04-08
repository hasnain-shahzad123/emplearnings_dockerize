"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import z from "zod";

// Define the schema for the demo answers

const demoAnswersSchema = z.object({
  email: z.string().email(),
  answers: z.object({
    question_1: z.array(z.string().min(1, "answer cannot be empty")),
    question_2: z.array(z.string().min(1, "answer cannot be empty")),
    question_3: z.array(z.string().min(1, "answer cannot be empty")),
    question_4: z.array(z.string().min(1, "answer cannot be empty")),
  }),
});

// Define the type for the demo answers
export type DemoAnswers = z.infer<typeof demoAnswersSchema>;

export default async function addDemoAnswersToDB({
  email,
  answers,
}: DemoAnswers): Promise<{
  type: "success" | "error";
  message: string;
}> {
  try {
    console.log("in above db:", answers);

    // Parse the incoming values with Zod
    demoAnswersSchema.parse({
      email,
      answers,
    });

    const uid = crypto.randomUUID();

    const demoRef = collection(firestore, "DEMO_ANSWERS");

    await setDoc(doc(demoRef, uid), {
      uid: uid,
      email: email,
      answers: answers,
      time: Timestamp.now(),
    });

    return {
      type: "success",
      message: "Question has been added successfully",
    };
  } catch (e) {
    console.error(e);

    return {
      type: "error",
      message: "Unable to add question at this time",
    };
  }
}

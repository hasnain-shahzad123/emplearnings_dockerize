"use client";
import addDemoAnswersToDB from "@/firebase/demo_questions/addDemoAnswersToDB";
import z from "zod";

// Define the schema for the form values
const demoRequestFormSchema = z.object({
  email: z.string().email(),
  answers: z.array(z.array(z.string())),
});

// Define the type for the form values
export type DemoRequestFrom = z.infer<typeof demoRequestFormSchema>;

export const submitDemoRequestForm = async ({
  email,
  answers,
}: DemoRequestFrom) => {
  try {
    // Parse the incoming values with Zod
    demoRequestFormSchema.parse({
      email,
      answers,
    });

    const answerMap = {
      question_1: answers[0],
      question_2: answers[1],
      question_3: answers[2],
      question_4: answers[3],
    };

    const response = await addDemoAnswersToDB({ email, answers: answerMap, });
    if (response.type === "error") {
      return {
        type: "error",
        message: "Unable to submit request at this time",
      };
    }
    
    return {
      type: "success",
      message: "Request has been submitted successfully",
    };
  } catch (e) {
    console.error(e);
    return {
      type: "error",
      message: "Unable to submit request at this time",
    };
  }
};

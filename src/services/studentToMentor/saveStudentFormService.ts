import { addStudentFormAnswersToDB } from "@/firebase/student/student_to_mentor/addStudentFormAnswersToDb";
import { z } from "zod";

interface StudentFormInput {
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  answers: {
    [key: string]: string[];
  };
}

const answerSchema = z.array(z.string().min(1, "Answer cannot be empty"));

const studentFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  category: z.string().min(1, "Category is required"),
  answers: z.record(answerSchema),
});

export const saveStudentToMentorForm = async ({
  firstName,
  lastName,
  email,
  category,
  answers,
}: StudentFormInput) => {
  try {
    const validationResult = studentFormSchema.safeParse({
      firstName,
      lastName,
      email,
      category,
      answers,
    });

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (error) => error.message
      );
      return {
        type: "error",
        message: errorMessages,
      };
    } else {
      const responseFromDb = await addStudentFormAnswersToDB({
        firstName,
        lastName,
        email,
        category,
        answers,
      });
      return responseFromDb;
    }
  } catch (e) {
    console.log("Error occurred while saving to DB", e);
    return {
      type: "error",
      message: "Error occurred while saving to the database",
    };
  }
};

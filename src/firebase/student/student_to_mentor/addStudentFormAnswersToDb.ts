import { firestore } from "@/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
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

export const addStudentFormAnswersToDB = async ({
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
    if (validationResult.success) {
      const collectionRef = collection(firestore, "STUDENT_FORM_ANSWERS");
      const docRef = await addDoc(collectionRef, {
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        category,
        answers,
      });
      console.log(docRef);
      return {
        type: "success",
        message: "successfully saved to databse",
      };
    } else if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (error) => error.message
      );
      return {
        type: "error",
        message: errorMessages,
      };
    }
  } catch (e) {
    console.log("error has occured in db", e);
    return {
      type: "error",
      message: "error has occurred while saving to database",
      e,
    };
  }
};

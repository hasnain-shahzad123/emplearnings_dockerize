import { z } from "zod";
import { firestore } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const addStudentToDBSchema = z.object({
  uid: z.string().min(4, "UID is required"),
  username: z.string().min(4, "Username is required"),
  email: z.string().email(),
});

const addStudentToDB = async (params: z.infer<typeof addStudentToDBSchema>) => {
  const validationResult = addStudentToDBSchema.safeParse(params);
  if (validationResult.error) {
    const errors = validationResult.error.errors.map((e) => {
      e.message;
    });

    return {
      type: "error",
      message: errors.join(","),
    };
  } else {
    const docRef = doc(firestore, "STUDENTS", params.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        type: "success",
        message: "student signed in successfully",
      };
    } else {
      try {
        await setDoc(docRef, {
          uid: params.uid,
          username: params.username,
          email: params.email,
          number_of_reviews: 0,
          rating: 0,
          completed_lessons: 0,
          booked_lessons: 0,
          total_courses: 0,
        });
        return {
          type: "success",
          message: "student signed in successfully",
        };
      } catch (e) {
        if (e instanceof FirebaseError) {
          return {
            type: "error",
            message: e.message,
          };
        } else {
          console.error(e);
          return {
            type: "error",
            message: "Something went wrong while creating student account",
          };
        }
      }
    }
  }
};
export default addStudentToDB;

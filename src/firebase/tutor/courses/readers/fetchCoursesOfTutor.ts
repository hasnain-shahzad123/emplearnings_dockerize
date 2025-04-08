import { firestore } from "@/firebase/firebaseConfig";
import { Course } from "@/types";
import {
  collection,
  query,
  where,
  getDocs,
  FirestoreError,
} from "firebase/firestore";
import { z } from "zod";

const fetchCoursesOfTutorSchema = z.object({
  tutorId: z.string().min(1, "Tutor ID is required."),
});

const fetchCoursesOfTutor = async ({
  tutorId,
}: z.infer<typeof fetchCoursesOfTutorSchema>) => {
  const validationResult = fetchCoursesOfTutorSchema.safeParse({ tutorId });
  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors[0].message,
      courses: null,
    };
  }

  try {
    const coursesRef = collection(firestore, "COURSES");

    const coursesQuery = query(coursesRef, where("tutorId", "==", tutorId));

    const snapshot = await getDocs(coursesQuery);

    const courses = snapshot.docs.map((doc) => {
      return {
        courseId: doc.id,
        ...doc.data(),
      };
    });

    return {
      type: "success",
      courses: courses as Course[],
      message: "Courses fetched successfully.",
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    if (error instanceof FirestoreError) {
      return {
        type: "error",
        message: error.message,
        courses: null,
      };
    } else {
      return {
        type: "error",
        message: "An unexpected error occurred while fetching courses.",
        courses: null,
      };
    }
  }
};

export default fetchCoursesOfTutor;

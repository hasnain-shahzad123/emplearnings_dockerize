import { collection, doc, documentId, getDoc } from "firebase/firestore";
import { z } from "zod";
import { firestore } from "../../../firebaseConfig";
import { Course } from "@/types";

const fetchCourseDataSchema = z.object({
  courseId: z.string().min(1, "Course id not provided"),
});
const fetchCourseData = async ({ courseId }: { courseId: string }) => {
  const validationResult = fetchCourseDataSchema.safeParse({ courseId });
  if (validationResult.error) {
    return {
      type: "error",
      message: validationResult.error.errors[0],
    };
  } else {
    const courseRef = doc(firestore, "COURSES", courseId);
    try {
      const courseSnapshot = await getDoc(courseRef);
      const course = {
        courseId: courseSnapshot.id,
        ...courseSnapshot.data(),
      };

      if (courseSnapshot.exists()) {
        return {
          type: "success",
          course: course as Course,
          message: "successfully retreived course",
        };
      } else {
        console.log("No such document!");
        return { type: "error", message: "course doesnt exist", course: null };
      }
    } catch (e) {
      console.error("Error getting document:", e);
      return {
        type: "error",
        message: "unexpected error getting course details",
        course: null,
      };
    }
  }
};

export default fetchCourseData;

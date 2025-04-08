import { addDoc, collection } from "firebase/firestore";
import { z } from "zod";
import { firestore } from "../../../firebaseConfig";

const CourseSchema = z.object({
  tutorId: z.string().min(1, "tutorId is required"),
  title: z.string().min(1, "title is required").max(150, "title too long"),
  description: z.string().min(1, "description is required"),
  price: z.number().min(0.00001, "Price too low or not provided"),
  levels: z.string().min(1, "level for this course is required"),
  tags: z
    .array(z.string().min(1, "tag not provided"))
    .min(1, "tags array can't be empty"),
});

const addTutorCourseToDB = async (courseData: z.infer<typeof CourseSchema>) => {
  const validationResult = CourseSchema.safeParse(courseData);

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return {
      type: "error",
      message: errors,
    };
  }

  try {
    const collectionRef = collection(firestore, "COURSES");

    const result = await addDoc(collectionRef, {
      ...courseData,
      total_lectures: 0,
    });

    return {
      type: "success",
      message: "Course added successfully",
      courseId: result.id,
    };
  } catch (e) {
    console.error("Error adding course:", e);
    return {
      type: "error",
      message: "Failed to add course. Please try again.",
    };
  }
};

export default addTutorCourseToDB;

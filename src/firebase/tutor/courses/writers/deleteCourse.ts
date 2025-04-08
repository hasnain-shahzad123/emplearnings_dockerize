import { firestore, storage } from "@/firebase/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject, listAll } from "firebase/storage";
import { z } from "zod";

const deleteCourseSchema = z.object({
  courseId: z.string().min(1, "Course ID is required."),
});

const deleteCourse = async ({
  courseId,
}: z.infer<typeof deleteCourseSchema>) => {
  const validationResult = deleteCourseSchema.safeParse({ courseId });
  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
    };
  }

  try {
    const docRef = doc(firestore, "COURSES", courseId);

    await deleteDoc(docRef);

    const storageRef = ref(storage, `COURSES/${courseId}`);

    const items = await listAll(storageRef);

    const deletePromises = items.items.map((itemRef) => deleteObject(itemRef));
    await Promise.all(deletePromises);

    return {
      type: "success",
      message: "Course and associated files have been successfully deleted.",
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      type: "error",
      message: `Failed to delete course: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

export default deleteCourse;

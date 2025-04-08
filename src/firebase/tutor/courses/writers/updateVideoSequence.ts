import { firestore } from "@/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { z } from "zod";

const updatingVideoSequenceSchema = z.object({
  courseId: z.string().min(1, "course id is required"),
  videoIds: z
    .array(z.string().min(1, "video id is required"))
    .min(1, "missing video ids array"),
});
export const updateVideoSequence = async ({
  courseId,
  videoIds,
}: z.infer<typeof updatingVideoSequenceSchema>) => {
  const validationResult = updatingVideoSequenceSchema.safeParse({
    courseId,
    videoIds,
  });
  if (validationResult.error) {
    const errors = validationResult.error.errors.map((e) => {
      e.message;
    });
    return {
      type: "error",
      message: errors,
    };
  }
  try {
    const courseRef = doc(firestore, "COURSES", courseId);
    await updateDoc(courseRef, {
      videoSequence: videoIds,
    });
    return { type: "success", message: "updated videos sequence successfully" };
  } catch (error) {
    console.error("Error updating video sequence", error);
    return {
      type: "error",
      message: `Failed to update videos sequence ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

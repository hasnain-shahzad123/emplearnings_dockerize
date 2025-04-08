import { firestore, storage } from "@/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { z } from "zod";

const CourseEditSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  videoFile: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.type.startsWith("video/"), {
      message: "File must be a video.",
    })
    .refine((file) => !file || /\.(mp4|mov|flv|mkv|avi)$/i.test(file.name), {
      message: "File extension must be .mp4, .mov, .flv, .mkv, or .avi.",
    }),
  title: z.string().optional(),
  level: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
});

type EditResponse = {
  type: "success" | "error";
  message: string;
  downloadURL?: string;
};

const editCourse = async ({
  courseId,
  videoFile,
  title,
  level,
  description,
  price,
}: z.infer<typeof CourseEditSchema>): Promise<EditResponse> => {
  const validationResult = CourseEditSchema.safeParse({
    courseId,
    videoFile,
    title,
    level,
    description,
    price,
  });

  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
    };
  }

  try {
    const updates: Record<string, string> = {};

    if (videoFile) {
      const fileExtension = videoFile.name.substring(
        videoFile.name.lastIndexOf(".") + 1
      );
      const storageRef = ref(
        storage,
        `COURSES/${courseId}/${courseId}.${fileExtension}`
      );

      await uploadBytes(storageRef, videoFile);
      const downloadURL = await getDownloadURL(storageRef);
      updates.intro_video_url = downloadURL;
    }

    if (title) updates.title = title;
    if (description) updates.description = description;
    if (level) updates.level = level;
    if (price) updates.price = price;

    if (Object.keys(updates).length > 0) {
      const docRef = doc(firestore, "COURSES", courseId);
      await updateDoc(docRef, updates);
    }

    return {
      type: "success",
      message: "Course video updated successfully",
      downloadURL: updates.intro_video_url,
    };
  } catch (error) {
    console.error("Error updating course ", error);
    return {
      type: "error",
      message: "Failed to update course video.",
    };
  }
};

export default editCourse;

import { storage } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { ref, StorageError, getDownloadURL } from "firebase/storage";
import { z } from "zod";

const fetchCourseIntroVideoSchema = z.object({
  courseId: z.string().min(1, "course id is required"),
});

const VIDEO_FORMATS = [".mp4", ".mov", ".avi", ".mkv", ".webm"] as const;
type VideoFormat = (typeof VIDEO_FORMATS)[number];

const fetchCourseIntroductoryVideo = async ({
  courseId,
}: z.infer<typeof fetchCourseIntroVideoSchema>) => {
  const validationResult = fetchCourseIntroVideoSchema.safeParse({ courseId });

  if (!validationResult.success) {
    return {
      type: "error",
      video: null,
      message: validationResult.error.errors[0].message,
    };
  }

  for (const format of VIDEO_FORMATS) {
    try {
      const storageRef = ref(
        storage,
        `COURSES/${courseId}/${courseId}${format}`
      );
      const videoURL = await getDownloadURL(storageRef);

      return {
        type: "success",
        video: videoURL,
        message: "Video URL fetched successfully",
      };
    } catch (e) {
      if (e instanceof FirebaseError && e.code === "storage/object-not-found") {
        continue;
      }

      if (e instanceof StorageError || e instanceof FirebaseError) {
        return {
          type: "error",
          message: e.message,
          video: null,
        };
      }

      return {
        type: "error",
        video: null,
        message:
          "An unexpected error occurred while fetching the introductory video",
      };
    }
  }

  return {
    type: "error",
    video: null,
    message: `No video found for course ${courseId}. Tried formats: ${VIDEO_FORMATS.join(
      ", "
    )}`,
  };
};

export default fetchCourseIntroductoryVideo;

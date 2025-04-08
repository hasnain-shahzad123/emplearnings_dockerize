import { collection, getDocs } from "firebase/firestore";
import { z } from "zod";
import { firestore } from "@/firebase/firebaseConfig";
import { VideoData } from "@/types";

const fetchCourseVideosDataSchema = z.object({
  courseId: z.string().min(1, "Course id not provided"),
});

const fetchCourseVideosData = async ({ courseId }: { courseId: string }) => {
  const validationResult = fetchCourseVideosDataSchema.safeParse({ courseId });
  if (!validationResult.success) {
    return {
      type: "error",
      message: validationResult.error.errors[0].message,
    };
  }

  const videosRef = collection(firestore, "COURSES", courseId, "VIDEOS");

  try {
    const videosSnapshot = await getDocs(videosRef);

    if (!videosSnapshot.empty) {
      const videosData: VideoData[] = videosSnapshot.docs.map((doc) => {
        const video = doc.data();
        return {
          videoId: doc.id,
          title: video.title,
          description: video.description,
          url: video.url,
          video_duration: video.video_duration,
        };
      });

      return {
        type: "success",
        videos: videosData,
        message: "Successfully retrieved course videos",
      };
    } else {
      return {
        type: "success",
        message: "No videos found for this course",
        videos: [],
      };
    }
  } catch (e) {
    console.error("Error getting videos:", e);
    return {
      type: "error",
      message: "Unexpected error getting course videos",
    };
  }
};

export default fetchCourseVideosData;

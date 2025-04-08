import { firestore, storage } from "@/firebase/firebaseConfig";
import { time } from "console";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { url } from "inspector";
import { z } from "zod";


const CourseVideoEditSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  videoId: z.string().min(1, "Video ID is required"),
  videoFile: z.instanceof(File).optional(),
  video_duration: z.string().optional(), 
  title: z.string().optional(),
  description: z.string().optional(),
});
type EditVideoResponse = {
    type: "success" | "error";
    message: string;
};


const editCourseVideo = async ({
    courseId,
    videoId,
    videoFile,
    video_duration,
    title,
    description,
}: z.infer<typeof CourseVideoEditSchema>): Promise<EditVideoResponse> => {
    console.log(courseId, videoId, videoFile, video_duration, title, description);
    const validationResult = CourseVideoEditSchema.safeParse({
        courseId,
        videoId,
        videoFile,
        video_duration,
        title,
        description,
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
              `COURSES/${courseId}/VIDEOS/${videoId}.${fileExtension}`
            );
            await uploadBytes(storageRef, videoFile);
            const downloadURL = await getDownloadURL(storageRef);
            updates.url = downloadURL;
        }
        if (video_duration) {
            updates.video_duration = video_duration;
        }
        if (title) {
            updates.title = title;
        }
        if (description) {
            updates.description = description;
        }

        const courseRef = doc(firestore, "COURSES", courseId);
        const videoRef = doc(courseRef, "VIDEOS", videoId);
        await updateDoc(videoRef, updates);
        return {
            type: "success",
            message: "Course video updated successfully.",
        };
    } catch (error) {
        // console.error("Error updating course video:", error);
        return {
            type: "error",
            message: "Failed to update course video.",
        };
    }
}
export default editCourseVideo;
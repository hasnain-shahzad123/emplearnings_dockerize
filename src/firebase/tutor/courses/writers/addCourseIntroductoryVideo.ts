import { UploadProgressType } from "@/contexts/ProgressBannerContext";
import { firestore, storage } from "@/firebase/firebaseConfig";
import formatBytes from "@/lib/formatBytes";
import { doc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { z } from "zod";

const VideoFileSchema = z.object({
  videoFile: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("video/"), {
      message: "File must be a video.",
    })
    .refine((file) => /\.(mp4|mov|flv|mkv|avi)$/i.test(file.name), {
      message: "File extension must be .mp4, .mov, .flv, .mkv, or .avi.",
    }),
  courseId: z.string().min(1, "course id is required"),
});

type UploadResponse = {
  type: "success" | "error";
  message: string;
  downloadURL?: string;
};

const addCourseIntroductoryVideo = async ({
  videoFile,
  courseId,
  setUploadProgress,
}: z.infer<typeof VideoFileSchema> & {
  setUploadProgress: (progress: UploadProgressType) => void;
}): Promise<UploadResponse> => {
  const validationResult = VideoFileSchema.safeParse({ courseId, videoFile });

  if (!validationResult.success) {
    console.error(
      "Validation error:",
      validationResult.error.errors.map((err) => err.message).join(", ")
    );
    return {
      type: "error",
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
    };
  }

  try {
    const fileExtension = videoFile.name.substring(
      videoFile.name.lastIndexOf(".") + 1
    );
    const storageRef = ref(
      storage,
      `COURSES/${courseId}/${courseId}.${fileExtension}`
    );

    // Uploading the file
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    return new Promise<UploadResponse>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress({
            percentage: progress,
            uploadedBytes: formatBytes(snapshot.bytesTransferred),
            totalBytes: formatBytes(snapshot.totalBytes),
          });
        },
        (error) => {
          console.error("Error uploading the video:", error);
          return {
            type: "error",
            message: "Failed to upload the video.",
          };
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef);
            const docRef = doc(firestore, "COURSES", courseId);
            await setDoc(
              docRef,
              { intro_video_url: downloadURL },
              { merge: true }
            );

            resolve({
              type: "success",
              message: "Video uploaded successfully",
              downloadURL,
            });
          } catch (error) {
            console.error("Error uploading the video:", error);
            reject({
              type: "error",
              message: "Failed to upload the video.",
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("Error uploading the video:", error);
    return {
      type: "error",
      message: "Failed to upload the video.",
    };
  }
};

export default addCourseIntroductoryVideo;

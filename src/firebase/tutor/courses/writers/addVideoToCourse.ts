import { firestore } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import formatBytes from "@/lib/formatBytes";
import { UploadProgressType } from "@/contexts/ProgressBannerContext";

interface VideoUploadResponse {
  type: "success" | "error";
  message: string;
  data?: {
    videoId: string;
    videoURL?: string;
  };
}

const addVideoToCourse = async (
  courseId: string,
  tutorId: string,
  videoFile: File,
  title: string,
  description: string,
  video_duration: string,
  setUploadProgress: (progress: UploadProgressType) => void
): Promise<VideoUploadResponse> => {
  if (title.length < 3) {
    return {
      type: "error",
      message: "Title must be at least 3 characters.",
    };
  }

  if (description.length < 10) {
    return {
      type: "error",
      message: "Description must be at least 10 characters.",
    };
  }

  try {
    const videoRef = await addDoc(
      collection(firestore, "COURSES", courseId, "VIDEOS"),
      {
        tutorId,
        title,
        description,
        video_duration,
      }
    );
    const videoId = videoRef.id;

    const fileExtension = videoFile.name.substring(
      videoFile.name.lastIndexOf(".") + 1
    );
    const videoStorageRef = ref(
      storage,
      `COURSES/${courseId}/VIDEOS/${videoId}.${fileExtension}`
    );

    const uploadTask = uploadBytesResumable(videoStorageRef, videoFile);

    return new Promise<VideoUploadResponse>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          const bytesTransferred = formatBytes(snapshot.bytesTransferred);
          const totalBytes = formatBytes(snapshot.totalBytes);
          setUploadProgress({
            percentage: progress,
            uploadedBytes: bytesTransferred,
            totalBytes: totalBytes,
          });
        },
        (error) => {
          reject({
            type: "error",
            message: `Video upload failed: ${error.message || "Unknown error"}`,
            data: { videoId },
          });
        },
        async () => {
          try {
            const videoURL = await getDownloadURL(videoStorageRef);
            await setDoc(videoRef, { url: videoURL }, { merge: true });
            const courseRef = doc(firestore, "COURSES", courseId);
            const courseSnap = await getDoc(courseRef);
            if (courseSnap.exists()) {
              const currentVideoSequence =
                courseSnap.data()?.videoSequence || [];
              const updatedVideoSequence = [...currentVideoSequence, videoId];
              await updateDoc(courseRef, {
                videoSequence: updatedVideoSequence,
                total_hours: courseSnap.data()?.total_hours + video_duration,
                total_lectures: courseSnap.data()?.total_lectures + 1,
              });
              resolve({
                type: "success",
                message: "Video added successfully.",
                data: { videoId, videoURL },
              });
            }
          } catch (error) {
            reject({
              type: "error",
              message: `Failed to finalize video upload: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              data: { videoId },
            });
          }
        }
      );
    });
  } catch (error) {
    return {
      type: "error",
      message: `Failed to initialize video upload: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

export default addVideoToCourse;

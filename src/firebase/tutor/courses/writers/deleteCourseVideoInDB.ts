import { firestore } from "../../../firebaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

const deleteVideoOfCourseFromDB = async (
	courseId: string,
	videoId: string,
	videosSequence: string[]
) => {
	try {
		const videoStorageRef = ref(
			storage,
			`COURSES/${courseId}/VIDEOS/${videoId}.mp4`
		);

		// First delete the file from Firebase Storage
		await deleteObject(videoStorageRef);

		// Then delete the Firestore document
		const videoRef = doc(firestore, "COURSES", courseId, "VIDEOS", videoId);
		await deleteDoc(videoRef);

		const updatedVideosSequence = videosSequence.filter((id) => id !== videoId);
		const courseRef = doc(firestore, "COURSES", courseId);
		await updateDoc(courseRef, {
			videoSequence: updatedVideosSequence,
			// total_hours: ,
		});

		return {
			type: "success",
			message: "Video deleted successfully",
		};
	} catch (error) {
		return {
			type: "error",
			message: `Failed to delete video: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		};
	}
};

export default deleteVideoOfCourseFromDB;

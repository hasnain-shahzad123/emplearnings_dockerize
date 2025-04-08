import { ProfilePhoto } from "@/types";
import { storage, firestore } from "@/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const addProfilePhoto = async ({ tutorId, profilePhoto }: ProfilePhoto) => {
	try {
		const path = `TUTORS/${tutorId}`;
		const storageRef = ref(storage, path);

		// Upload the profile photo to Firebase Storage
		const response = await uploadBytes(storageRef, profilePhoto);
        console.log("In profile photo update page: ", response);
		// Get the download URL of the uploaded photo
		const downloadURL = await getDownloadURL(storageRef);

		const tutorDocRef = doc(firestore, "TUTORS", tutorId); 
		await updateDoc(tutorDocRef, {
			profilePhotoURL: downloadURL, 
		});

		return {
			type: "success",
			message: "Updated tutor's profile photo",
		};
	} catch (error: any) {
		if (error instanceof FirebaseError) {
			console.error("Firebase error uploading profile photo:", error);
			return {
				type: "error",
				message: error.message,
			};
		} else {
			console.error("Unexpected error uploading profile photo:", error);
			return {
				type: "error",
				message:
					"An unexpected error occurred while uploading the profile photo",
			};
		}
	}
};

export default addProfilePhoto;

import { TutorDocumentDataType, NotificationType } from "@/types";
import { FirebaseError } from "firebase/app";
import z from "zod";
import { adminDb } from "@/firebase/firebase_admin/initializeAdmin";

const getTutorDashBoardDataSchema = z.object({
  uid: z.string(),
});

type GetTutorDashBoardDataInput = z.infer<typeof getTutorDashBoardDataSchema>;

export default async function getTutorDocumentData({
  uid,
}: GetTutorDashBoardDataInput): Promise<{
  type: "success" | "error";
  message: string;
  data: TutorDocumentDataType | null;
}> {
	try {
		// Validate the input data
		getTutorDashBoardDataSchema.parse({ uid });
		// Fetch the tutor's document from Firestore using their unique ID
		let tutorData: TutorDocumentDataType | null = null;
		const tutorDoc = await adminDb.collection("TUTORS").doc(uid).get();
		if (tutorDoc.exists) {
			tutorData = tutorDoc.data() as TutorDocumentDataType;
		} else {
			console.log("No such tutor document!");
		}


		// Return the response
		return {
			type: "success",
			data: tutorData,
			message: "Fetched tutor dashboard data successfully.",
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: "Error during data validation with zod: " + error.message,
        data: null,
      };
    } else if (error instanceof FirebaseError) {
      return {
        type: "error",
        message: "Error while interacting with Firebase: " + error.message,
        data: null,
      };
    }

    return {
      type: "error",
      message: "Failed to fetch tutor dashboard data.",
      data: null,
    };
  }
}

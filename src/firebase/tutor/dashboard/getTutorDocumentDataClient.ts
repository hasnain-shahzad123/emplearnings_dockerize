import { TutorDocumentDataType } from "@/types";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { z } from "zod";
import { firestore } from "@/firebase/firebaseConfig";

const getTutorDataSchema = z.object({
  uid: z.string().min(1, "Tutor ID is required"),
});

export default async function getTutorDocumentDataClient({ uid }: { uid: string }) {
  try {
    getTutorDataSchema.parse({ uid });

    const tutorRef = doc(firestore, "TUTORS", uid);
    const tutorSnap = await getDoc(tutorRef);

    if (!tutorSnap.exists()) {
      return {
        type: "error" as const,
        message: "Tutor not found",
        data: null,
      };
    }

    const tutorData = tutorSnap.data() as TutorDocumentDataType;

    return {
      type: "success" as const,
      data: tutorData,
      message: "Tutor data fetched successfully",
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        type: "error" as const,
        message: "Invalid input: " + error.message,
        data: null,
      };
    }
    
    if (error instanceof FirebaseError) {
      return {
        type: "error" as const,
        message: "Firebase error: " + error.message,
        data: null,
      };
    }

    return {
      type: "error" as const,
      message: "Failed to fetch tutor data",
      data: null,
    };
  }
}
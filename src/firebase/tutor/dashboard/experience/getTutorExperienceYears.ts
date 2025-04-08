import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { z } from "zod";

const getTutorExperienceSchema = z.object({
  uid: z.string().min(1, "uid must be at least 1 character long"),
});

export default async function getTutorExperienceYears({ uid }: { uid: string }) {
  try {
    getTutorExperienceSchema.parse({ uid });
    
    const tutorRef = doc(firestore, "TUTORS", uid);
    const tutorDoc = await getDoc(tutorRef);
    
    if (!tutorDoc.exists()) {
      return {
        type: "error",
        message: "Tutor not found",
        data: null,
      };
    }

    const data = tutorDoc.data();
    return {
      type: "success",
      data: {
        experience_years: data?.experience_years || 0,
        is_verified: data?.is_verified || false,
      },
      message: "Experience years fetched successfully",
    };
  } catch (error) {
    return {
      type: "error",
      message: "Failed to fetch experience years",
      data: null,
    };
  }
}
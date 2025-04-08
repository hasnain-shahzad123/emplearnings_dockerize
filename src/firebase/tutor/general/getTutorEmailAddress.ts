import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { z } from "zod";

const getTutorEmailSchema = z.object({
  uid: z.string().min(1, "uid is required for fetching email address"),
});
const getTutorEmailAddress = async ({
  uid,
}: z.infer<typeof getTutorEmailSchema>) => {
  const validationResult = getTutorEmailSchema.safeParse({ uid });
  if (validationResult.error) {
    const errors = validationResult.error.errors.map((error) => {
      error.message;
    });
    return {
      type: "error",
      message: "zod error" + errors,
    };
  } else {
    try {
      const tutorDocRef = doc(firestore, "TUTORS", uid);
      const tutor = await getDoc(tutorDocRef);
      if (!tutor.exists) {
        return {
          type: "error",
          message: "no record of tutor in the database",
        };
      }
      const tutorData = tutor.data();
      if (tutorData && tutorData.email) {
        return {
          type: "success",
          message: tutorData.email,
        };
      } else {
        return {
          type: "error",
          message: "unable to get tutor's email address right now",
        };
      }
    } catch (e) {
      console.error("error in getting email address of tutor", e);
      return {
        type: "error",
        message: "unable to get tutor's email address right now",
      };
    }
  }
};

export default getTutorEmailAddress;

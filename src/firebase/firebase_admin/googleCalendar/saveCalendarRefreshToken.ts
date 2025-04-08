import {adminDb} from "../initializeAdmin";
import z from "zod";

//schema for validating fields to be stored in db
const validateRefreshToken = z.object({
  uid: z.string().min(4, "UID is required"),
  refreshToken: z.string().min(1, "Refresh token is required"),
});

const saveCalendarRefreshToken = async ({
  uid,
  refreshToken,
}: {
  uid: string;
  refreshToken: string;
}) => {
  try {
    validateRefreshToken.parse({ uid, refreshToken }); //validating fields

    //storing refreshToken in database to be retrieved later
    await adminDb
      .collection("TUTORS") // Top-level collection
      .doc(uid) // Document for the specific tutor
      .collection("TUTOR_SECRETS") // Subcollection for secrets
      .doc("REFRESH_TOKEN") // Specific document within the subcollection
      .set(
        // Setting data in the document
        {
          refreshToken: refreshToken,
        },
        { merge: true } // Merging to avoid overwriting existing data
      );
    return { message: "refresh token saved successfully", type: "success" };
  } catch (error: any) {
    return { message: error.message, type: "error" };
  }
};
export default saveCalendarRefreshToken;

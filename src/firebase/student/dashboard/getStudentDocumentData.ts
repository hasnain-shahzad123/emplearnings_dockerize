import { firestore, auth } from "@/firebase/firebaseConfig";
import { StudentDocumentDataType } from "@/types";

import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import z from "zod";

const getStudentDocumentDataSchema = z.object({
  uid: z.string(),
});

type GetStudentDocumentDataInput = z.infer<typeof getStudentDocumentDataSchema>;

export default async function getStudentDocumentData({
  uid,
}: GetStudentDocumentDataInput): Promise<{
  type: "success" | "error";
  message: string;
  data: StudentDocumentDataType | null;
}> {
  try {

    await auth.currentUser?.getIdToken(true);

    getStudentDocumentDataSchema.parse({ uid });


    const studentRef = doc(firestore, "STUDENTS", uid);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      return {
        type: "error",
        message: "No student exists with this UID.",
        data: null,
      };
    }

    const studentData = studentDoc.data() as StudentDocumentDataType;

    return {
      type: "success",
      data: studentData,
      message: "Fetched student data successfully.",
    };
  } catch (error) {
    console.error("Error fetching student data:", error);

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
      message: "Failed to fetch student data.",
      data: null,
    };
  }
}
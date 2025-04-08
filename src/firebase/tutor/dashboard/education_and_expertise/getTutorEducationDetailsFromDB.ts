import React from "react";
import z from "zod";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorEducationDataType } from "@/types";
import { FirebaseError } from "firebase/app";

const getTutorEducationDataSchema = z.object({
  uid: z.string().min(1, "uid must be atleast 1 character long"),
});

type GetTutorEducationDataInput = z.infer<typeof getTutorEducationDataSchema>;

export default async function getTutorEducationDetailsFromDB({
  uid,
}: GetTutorEducationDataInput): Promise<{
  type: "success" | "error";
  message: string;
  educationData: TutorEducationDataType | null;
}> {
  try {
    // Validate the input data
    getTutorEducationDataSchema.parse({ uid });

    // Fetch educations document
    const educationsRef = doc(firestore, "TUTORS", uid, "TUTOR_EDUCATION", uid);

    const educationsDoc = await getDoc(educationsRef);
    const educationData = educationsDoc.data();
    if (educationData) {
      const formattedData = {
        highest_degree: educationData.highest_degree,
        field_of_study: educationData.field_of_study,
        institution_name: educationData.institution_name,
        graduation_year: educationData.graduation_year,
        is_verified: educationData.is_verified,
      } as TutorEducationDataType;

      // Return the response
      return {
        type: "success",
        educationData: formattedData,
        message: "Fetched tutor education data successfully.",
      };
    }
    return {
      type: "error",
      message: "Failed to fetch tutor education educations.",
      educationData: null,
    };
  } catch (error: any) {
    console.error("Error fetching tutor dashboard data:", error);

    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: "Error during data validation with zod: " + error.message,
        educationData: null,
      };
    } else if (error instanceof FirebaseError) {
      return {
        type: "error",
        message: "Error while interacting with Firebase: " + error.message,
        educationData: null,
      };
    }

    return {
      type: "error",
      message: "Failed to fetch tutor education educations.",
      educationData: null,
    };
  }
}

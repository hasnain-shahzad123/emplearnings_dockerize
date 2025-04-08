"use client";
import z from "zod";
import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Strengths from "@/components/tutorPages/personel_info/education/Strengths";

// Define the schema for the form values
const addTutorToDBSchema = z.object({
  uid: z.string().min(4, "UID is required"),
  username: z.string().min(4, "Username is required"),
  email: z.string().email(),
});

// Define the type for the form values
export type AddTutorToDBFormValues = z.infer<typeof addTutorToDBSchema>;
export default async function addTutorToDB({
  uid,
  username,
  email,
}: AddTutorToDBFormValues): Promise<{
  type: "success" | "error";
  message: string;
}> {
  try {
    // Parse the incoming values with Zod
    const parsedValues = addTutorToDBSchema.parse({
      uid,
      username,
      email,
    });

    // Check if the student already exists in the DB
    // Reference to the collection

    // Reference to the document we want to create using uid as the doc ID
    const ref = doc(firestore, "TUTORS", uid);

    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return {
        message: "Tutor Signed In Successfully.",
        type: "success",
      };
    } else {
      // Adding student to the DB

      //creating the document with the data

      await setDoc(ref, {
        uid,
        username,
        email,
        total_students: 0,
        active_students: 0,
        completed_lessons: 0,
        pending_lessons: 0,
        total_reviews: 0,
        rating: 0,
        profilePhotoURL: "",
        per_lesson_rate: 0,
        free_trail_lesson_enable: true,
        country: "",
        languages: [],
        categories: [],
        number_of_reviews: 0,
        tagline: "",
        about: "",
        experience_years: 0,
        plan_type: "free",
        subscription_status: "active",
        pending_categories: [],
      });

      const external_reviewsRef = doc(
        firestore,
        "TUTORS",
        uid,
        "TUTOR_EXTERNAL_REVIEWS",
        uid
      );

      await setDoc(external_reviewsRef, {
        external_reviews: [],
      });

      const StrengthsRef = doc(
        firestore,
        "TUTORS",
        uid,
        "TUTOR_STRENGTHS",
        uid
      );

      await setDoc(StrengthsRef, {
        strengths: [],
      });

      const CertificationsRef = doc(
        firestore,
        "TUTORS",
        uid,
        "TUTOR_CERTIFICATIONS",
        uid
      );

      await setDoc(CertificationsRef, {
        certifications: [],
      });

      const lessonScheduleRef = doc(
        firestore,
        "TUTORS",
        uid,
        "TUTOR_TRIAL_LESSON_SCHEDULE",
        uid
      );

      await setDoc(lessonScheduleRef, {
        week_one: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        },
      });

      const lessonScheduleRef2 = doc(
        firestore,
        "TUTORS",
        uid,
        "TUTOR_LESSON_SCHEDULE",
        uid
      );

      await setDoc(lessonScheduleRef2, {
        week_one: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        },
        week_two: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        },
      });

      //returning the success message
      return {
        message: "Signed In Successfully.",
        type: "success",
      };
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error("Error parsing the form values:", error.errors);

      return {
        message: error.errors[0].message,
        type: "error",
      };
    }
    console.error("Error adding tutor to DB:", error);
    return {
      message: error.message,
      type: "error",
    };
  }
}

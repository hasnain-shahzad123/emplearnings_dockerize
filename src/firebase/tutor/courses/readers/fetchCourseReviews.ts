import {
  collection,
  doc,
  getDocs,
} from "firebase/firestore";
import { z } from "zod";
import { firestore } from "../../../firebaseConfig";
import { Course, CourseReview } from "@/types";
import { FirebaseError } from "firebase/app";

const fetchCourseReviewsSchema = z.object({
  courseId: z.string().min(1, "Course id not provided"),
});

const fetchCourseReviews = async ({
  courseId,
}: {
  courseId: string;
}): Promise<{
  type: "success" | "error";
  reviews: CourseReview[] | null;
  message: string | null;
}> => {
  try {
    const validationResult = fetchCourseReviewsSchema.safeParse({ courseId });
    if (!validationResult.success) {
      return {
        type: "error" as const,
        message: validationResult.error.errors[0].message,
        reviews: null,
      };
    }

    const courseRef = doc(firestore, "COURSES", courseId);
    const reviewsRef = collection(courseRef, "REVIEWS");
    const reviewsSnapshot = await getDocs(reviewsRef);

    if (reviewsSnapshot.empty) {
      return {
        type: "success" as const,
        reviews: [],
        message: "No reviews found for this course",
      };
    }

    const reviews = reviewsSnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as CourseReview[];

    return {
      type: "success" as const,
      reviews,
      message: "Successfully retrieved reviews",
    };
  } catch (error) {
    console.error("Error fetching course reviews:", error);

    if (error instanceof FirebaseError) {
      return {
        type: "error" as const,
        reviews: null,
        message: `Firebase error: ${error.message}`,
      };
    }

    return {
      type: "error" as const,
      reviews: null,
      message: "An unexpected error occurred while fetching course reviews",
    };
  }
};

export default fetchCourseReviews;

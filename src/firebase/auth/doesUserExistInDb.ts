"use client";
import z from "zod";
import { firestore, auth } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const doesUserExistSchema = z
  .object({
    uid: z.string().min(4, "UID is required").optional(),
    email: z.string().email("Invalid email").optional(),
    userType: z.string().min(1, "user type is required"),
  })
  .refine((data) => data.uid || data.email, {
    message: "Either uid or email must be provided",
  });

export type DoesUserExistInput = z.infer<typeof doesUserExistSchema>;

export default async function doesUserExistInDb({
  uid,
  email,
  userType,
}: DoesUserExistInput): Promise<{
  type: "success" | "error";
  message: string;
  exists: boolean;
}> {
  try {
    const result = doesUserExistSchema.safeParse({
      uid,
      email,
      userType,
    });

		if (!result.success) {
			const errors = result.error.errors.map((e) => e.message);
			return {
				message: errors.join(","),
				type: "error",
				exists: false,
			};
		}

		await auth.currentUser?.getIdToken(true); // Force refresh

    const collectionName = userType === "tutor" ? "TUTORS" : "STUDENTS";

    if (email) {
      const querySnapshot = await getDocs(
        query(collection(firestore, collectionName), where("email", "==", email))
      );

      return {
        message: querySnapshot.empty
          ? `${userType} does not exist`
          : `${userType} exists in DB`,
        type: querySnapshot.empty ? "error" : "success",
        exists: !querySnapshot.empty,
      };
    }

    if (uid) {
      const docSnap = await getDoc(doc(firestore, collectionName, uid));

      return {
        message: docSnap.exists()
          ? `${userType} exists in DB`
          : `${userType} does not exist`,
        type: docSnap.exists() ? "success" : "error",
        exists: docSnap.exists(),
      };
    }

    return {
      message: "No identifier provided",
      type: "error",
      exists: false,
    };
  } catch (error: any) {
    console.error("Error checking user in DB:", error);
    return {
      message: error.message || "Error checking user existence",
      type: "error",
      exists: false,
    };
  }
}
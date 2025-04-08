import { firestore } from "@/firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { z } from "zod";

// Define schema for email validation
const EmailSchema = z.object({
  uid: z.string().min(1, "User ID is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["tutor", "student"], {
    errorMap: () => ({ message: "Role must be either 'tutor' or 'student'" }),
  }),
});

type UpdateEmailParams = z.infer<typeof EmailSchema>;

export default async function updateEmailInDb({
  uid,
  email,
  role,
}: UpdateEmailParams): Promise<{ type: "success" | "error"; message: string }> {
  try {
    // Validate input
    EmailSchema.parse({ uid, email, role });

    // Determine collection based on role
    const collectionName = role === "tutor" ? "TUTORS" : "STUDENTS";

    // Check if email is already in use by another user in the appropriate collection
    const usersRef = collection(firestore, collectionName);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingUser = querySnapshot.docs[0];
      if (existingUser.id !== uid) {
        return {
          type: "error",
          message: "This email is already in use by another account",
        };
      }
    }

    // Reference to the user document in the appropriate collection
    const userRef = doc(firestore, collectionName, uid);

    // Update the email field
    await updateDoc(userRef, {
      email: email,
    });

    return {
      type: "success",
      message: "Email updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: error.errors[0].message || "Invalid email data",
      };
    }

    console.error("Error updating email:", error);
    return {
      type: "error",
      message: "Failed to update email in database",
    };
  }
}

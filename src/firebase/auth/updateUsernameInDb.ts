import { firestore } from "@/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { z } from "zod";

// Define schema for username validation
const UsernameSchema = z.object({
  uid: z.string().min(1, "User ID is required"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  role: z.enum(["tutor", "student"], {
    errorMap: () => ({ message: "Role must be either 'tutor' or 'student'" }),
  }),
});

type UpdateUsernameParams = z.infer<typeof UsernameSchema>;

export default async function updateUsernameInDb({
  uid,
  username,
  role,
}: UpdateUsernameParams): Promise<{ success: boolean; message: string }> {
  try {
    // Validate input
    UsernameSchema.parse({ uid, username, role });

    // Determine collection based on role
    const collectionName = role === "tutor" ? "TUTORS" : "STUDENTS";

    // Reference to the user document in the appropriate collection
    const userRef = doc(firestore, collectionName, uid);

    // Update the username field
    await updateDoc(userRef, {
      username: username,
    });

    return {
      success: true,
      message: "Username updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message || "Invalid username data",
      };
    }

    console.error("Error updating username:", error);
    return {
      success: false,
      message: "Failed to update username in database",
    };
  }
}

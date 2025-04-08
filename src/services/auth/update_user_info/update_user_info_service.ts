import z from "zod";
import { auth } from "@/firebase/firebaseConfig";
import {
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  username: z.string().min(3).optional(),
  currentPassword: z
    .string()
    .min(8, "Current password required for verification"),
});

export type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;

export default async function updateUserService({
  email,
  password,
  username,
  currentPassword,
}: UpdateUserFormValues): Promise<{
  type: "success" | "error" | "info";
  message: string;
}> {
  try {
    console.log("1. Starting update user service");
    // Log the received values for debugging (excluding password for security)
    console.log("2. Update service received:", {
      email: email || "(not provided)",
      username: username || "(not provided)",
      hasPassword: !!password,
      hasCurrentPassword: !!currentPassword,
      currentUser: auth.currentUser ? {
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        emailVerified: auth.currentUser.emailVerified
      } : null
    });

    if (!auth.currentUser) {
      console.log("3. No current user found");
      return { type: "error", message: "User not authenticated." };
    }

    // Reauthenticate user first
    console.log("4. Attempting to reauthenticate with:", {
      userEmail: auth.currentUser.email,
      passwordLength: currentPassword ? currentPassword.length : 0
    });
    
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email!,
      currentPassword
    );
    
    try {
      console.log("5. Calling reauthenticateWithCredential");
      await reauthenticateWithCredential(auth.currentUser, credential);
      console.log("6. Reauthentication successful");
    } catch (reAuthError: any) {
      console.error("7. Reauthentication failed:", reAuthError.code, reAuthError.message);
      throw reAuthError;
    }

    // Update profile fields one by one
    let updatedEmail = false;

    // Update username if provided
    if (username) {
      console.log("8. Updating username to:", username);
      try {
        await updateProfile(auth.currentUser, { displayName: username });
        console.log("9. Username update successful");
      } catch (usernameError: any) {
        console.error("10. Username update failed:", usernameError);
        throw usernameError;
      }
    }

    // Update password if provided
    if (password) {
      console.log("11. Updating password");
      try {
        await updatePassword(auth.currentUser, password);
        console.log("12. Password update successful");
      } catch (passwordError: any) {
        console.error("13. Password update failed:", passwordError);
        throw passwordError;
      }
    }

    // Update email if provided - this requires verification
    if (email && email !== auth.currentUser.email) {
      console.log("14. Attempting to update email to:", email);
      try {
        // Check if the current email is verified
        console.log("15. Current email verified status:", auth.currentUser.emailVerified);
        if (!auth.currentUser.emailVerified) {
          console.log("16. Current email not verified, cannot update");
          return {
            type: "error",
            message:
              "Please verify your current email address before changing to a new one.",
          };
        }

        console.log("17. Calling verifyBeforeUpdateEmail");
        await verifyBeforeUpdateEmail(auth.currentUser, email);
        console.log("18. verifyBeforeUpdateEmail successful");
        updatedEmail = true;
      } catch (error: any) {
        console.error("19. Email update failed:", error.code, error.message);
        if (error.code === "auth/requires-recent-login") {
          return {
            type: "error",
            message:
              "Please sign out and sign in again before changing your email.",
          };
        } else if (error.code === "auth/operation-not-allowed") {
          return {
            type: "error",
            message:
              "Email update requires verification of your current email. Please check your inbox for a verification link.",
          };
        }
        throw error;
      }
    }

    console.log("20. All updates completed successfully");
    return {
      type: "success",
      message: updatedEmail
        ? "Profile updated successfully. Please check your inbox to verify your new email address."
        : "Profile updated successfully.",
    };
  } catch (error: any) {
    console.error("21. Error updating user:", error);

    if (error.code === "auth/wrong-password") {
      return { type: "error", message: "Incorrect current password." };
    }

    if (error.code === "auth/requires-recent-login") {
      return {
        type: "error",
        message:
          "For security reasons, please sign out and sign in again before making these changes.",
      };
    }

    if (error.code === "auth/email-already-in-use") {
      return {
        type: "error",
        message: "This email is already in use by another account.",
      };
    }

    if (error.code === "auth/invalid-credential") {
      return {
        type: "error",
        message: "Invalid credentials. Please check your current password and try again.",
      };
    }

    return {
      type: "error",
      message: `Error (${error.code}): ${error.message || "Failed to update user details."}`,
    };
  }
}

import z from "zod";
import { auth } from "@/firebase/firebaseConfig";
import {
  confirmPasswordReset,
  signInWithEmailAndPassword,
} from "firebase/auth";
import doesUserExistInDb from "@/firebase/auth/doesUserExistInDb";

// Define the schema for the form values
export const LoginUserWithEmailAndPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  userType: z.enum(["student", "tutor"]),
});

// Define the type for the form values
export type LoginUserWithEmailAndPasswordFormValues = z.infer<
  typeof LoginUserWithEmailAndPasswordSchema
>;

type SessionApiResponseType = {
  message: string;
  type: "success" | "error" | "info";
};

export default async function loginUserWithEmailAndPasswordService({
  email,
  password,
  userType,
}: LoginUserWithEmailAndPasswordFormValues): Promise<{
  type: "success" | "error";
  message: string;
}> {
  try {
    // First check if user exists in DB before attempting Firebase auth
    const userExists = await doesUserExistInDb({
      email,
      userType,
    });

    if (!userExists.exists) {
      return {
        type: "error",
        message: "Please register yourself before login!",
      };
    }

    // Attempt Firebase authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;
    const displayName = userCredential.user.displayName;

    if (uid) {
      console.log("Sending login request to API with data:", {
        uid: userCredential.user.uid,
        username: displayName || email.split("@")[0],
        email,
        callType: "login",
        userType,
        isVerified: userCredential.user.emailVerified || false,
      });
      
      const response = await fetch(`/api/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          username: displayName || email.split("@")[0],
          email,
          callType: "login",
          userType,
          isVerified: userCredential.user.emailVerified || false,
        }),
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Status Text:", response.statusText);
      
      // Read the response body only once
      const apiResponseData = await response.json();
      console.log("API Response Data:", JSON.stringify(apiResponseData, null, 2));

      if (!response.ok) {
        return {
          type: "error",
          message:
            apiResponseData.message ||
            `Oops! We faced an error while logging in the ${userType}.`,
        };
      }

      if (apiResponseData.type === "success") {
        return {
          type: "success",
          message: `${userType} successfully logged in.`,
        };
      }

      return {
        type: "error",
        message:
          apiResponseData.message || `Error while logging in the ${userType}!`,
      };
    }

    return {
      type: "error",
      message: `Error while logging in the ${userType}!`,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: error.errors[0]?.message || "Validation error",
      };
    } else if (error.code === "auth/invalid-credential") {
      return {
        type: "error",
        message: "Invalid Credentials, please try again!",
      };
    }

    return {
      type: "error",
      message: "Oops! We faced an error while logging in. " + error.message,
    };
  }
}

import { signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { FacebookAuthProvider } from "firebase/auth";
import doesUserExistInDb from "@/firebase/auth/doesUserExistInDb";
import { z } from "zod";

const provider = new FacebookAuthProvider();

const loginSchema = z.object({
  userType: z.string().min(1, "User type is required"),
});

type SessionApiResponseType = {
  message: string;
  type: "error" | "success";
};

export default async function loginUserWithFacebookService({
  userType,
}: z.infer<typeof loginSchema>): Promise<{
  type: "success" | "error";
  message: string;
}> {
  try {
    // Validate userType
    loginSchema.parse({ userType });

    // Sign in with Facebook popup
    const result = await signInWithPopup(auth, provider);

    if (result.user.uid) {
      const { uid, displayName, email } = result.user;

      // Check if user exists in DB
      const doesExists = await doesUserExistInDb({
        uid,
        userType: userType as "student" | "tutor",
      });

      if (!doesExists.exists) {
        return {
          type: "error",
          message: "Please register yourself before login!",
        };
      }

      const response = await fetch(`/api/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          callType: "login",
          userType,
          username: result.user.displayName,
          email: result.user.email
        }),
      });

      if (!response.ok) {
        return {
          type: "error",
          message: `Error while logging in the ${userType}!`,
        };
      }

      const apiResponseData: SessionApiResponseType = await response.json();

      if (apiResponseData.type === "success") {
        return {
          type: apiResponseData.type,
          message: `${userType} successfully logged in`,
        };
      }

      return {
        type: "error",
        message: `Error while logging in the ${userType}!`,
      };
    }

    return {
      type: "error",
      message: "No user ID returned from Facebook Auth",
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: error.errors[0]?.message || "Validation error",
      };
    }

    console.error(
      "Facebook Auth Error",
      error.code,
      error.message,
      error.email,
      error.credential
    );

    return {
      type: "error",
      message: error.message || "Failed to login with Facebook",
    };
  }
}

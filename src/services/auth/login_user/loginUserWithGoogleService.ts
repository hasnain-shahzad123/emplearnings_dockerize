import { signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import doesUserExistInDb from "@/firebase/auth/doesUserExistInDb";

const provider = new GoogleAuthProvider();

type SessionApiResponseType = {
	message: string;
	type: "error" | "success";
};

export default async function loginUserWithGoogleService(userType: "student" | "tutor"): Promise<{
  type: "success" | "error";
  message: string;
}> {
  try {
    const result = await signInWithPopup(auth, provider);

    if (result.user.uid) {
      const { uid } = result.user;

      const doesExists = await doesUserExistInDb({ uid, userType });
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
          isVerified: auth.currentUser?.emailVerified || false,
        }),
      });
			
      if (!response.ok) {
        return {
          type: "error",
          message: "Error while registering the user!",
        };
      }

      const apiResponseData: SessionApiResponseType = await response.json();

      if (apiResponseData.type === "success") {
        return {
          type: apiResponseData.type,
          message: apiResponseData.message,
        };
      }

      // In case the API response is error or it didn't match the conditions
      return {
        type: "error",
        message: "Error while signing up the user!",
      };
    }

    // If result.user.uid is missing or any other error occurs
    return {
      type: "error",
      message: "No user ID returned from Google Auth",
    };
  } catch (error: any) {
    // Log error details for debugging
    console.error(
      "Google Auth Error",
      error.code,
      error.message,
      error.email,
      error.credential
    );

    return {
      type: "error",
      message: error.message || "Failed to register user with Google",
    };
  }
}

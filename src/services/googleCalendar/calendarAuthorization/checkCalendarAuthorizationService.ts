"use server";
import fetchRefreshToken from "@/firebase/firebase_admin/googleCalendar/fetchRefreshToken";
// Function to verify if a refresh token is valid
const checkRefreshTokenValidity = async (
  refreshToken: string
): Promise<boolean> => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    // Checking if the response is ok and if there's no error in the body
    if (!response.ok) {
      const errorData = await response.json();
      if (
        errorData.error === "invalid_grant" ||
        errorData.error === "invalid_request"
      ) {
        // The refresh token has been revoked or is invalid
        console.error(
          "Refresh token is invalid or revoked:",
          errorData.error_description
        );
        return false;
      }
      return false;
    }

    // If no error was encountered, the refresh token is valid
    return true;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return false;
  }
};
const isCalendarAuthorized = async ({
  uid,
}: {
  uid: string;
}): Promise<boolean> => {
  try {
    const response = await fetchRefreshToken({ uid });
    if (response.token === null) {
      return false;
    } else {
      const isValidRefreshToken = await checkRefreshTokenValidity(
        response.token
      );
      return isValidRefreshToken;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default isCalendarAuthorized;

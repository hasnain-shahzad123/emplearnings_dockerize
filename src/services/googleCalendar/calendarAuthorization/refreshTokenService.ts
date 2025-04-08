// Checks if the user's access token has expired and refreshes it using the stored refresh token if necessary.
// Retrieves the expiration time from cookies and the refresh token from Firestore. If expired,
//the function requests a new access token from Google's OAuth2 API and updates the cookie.
// Returns a success or error message based on the outcome of the token refresh process.

import setTokenAsCookie from "@/app/api/serverUtilityFunctions/googleAuthorizationUtilityFunctions/setTokenAsCookie";
import { cookies } from "next/headers";
import fetchRefreshToken from "@/firebase/firebase_admin/googleCalendar/fetchRefreshToken";

const refreshTokenIfExpiredService = async ({
  uid,
}: {
  uid: string;
}): Promise<{
  message: string;
  type: string;
  token: string | null;
}> => {
  try {
    const cookieStore = cookies();

    // Retrieving stored token expiration
    const expiryString = cookieStore.get("calendarAccessTokenExpiry")?.value;

    // If there's no expiration cookie found, we directly fetch the refresh token
    if (!expiryString) {
      const response = await fetchRefreshToken({ uid });
      if (response.token === null) {
        return {
          message: "User has not authorized Google Calendar or revoked access.",
          type: "error",
          token: null,
        };
      }

      // If refresh token is available, attempting to refresh the access token
      const refreshToken = response.token;

      // Making a request to OAuth to refresh the token
      const oauthResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!,
          client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!oauthResponse.ok) {
        return {
          message: "Failed to refresh access token.",
          type: "error",
          token: null,
        };
      }

      const data = await oauthResponse.json();
      setTokenAsCookie({
        accessToken: data.access_token,
        expiresIn: data.expires_in,
      });

      return {
        message: "Access token refreshed successfully.",
        type: "success",
        token: data.access_token,
      };
    }

    // If expiry string exists, checking if token is expired
    const expiryTimestamp = parseInt(expiryString, 10);
    const currentTimestamp = Date.now();

    // Token expired, attempting to refresh it
    if (currentTimestamp >= expiryTimestamp) {
      const reqResponse = await fetchRefreshToken({ uid });

      if (reqResponse.token !== null) {
        const refreshToken = reqResponse.token;

        // Making a request to OAuth to refresh the token
        const oauthResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!,
              client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
              refresh_token: refreshToken,
              grant_type: "refresh_token",
            }),
          }
        );

        if (!oauthResponse.ok) {
          return {
            message: "Failed to refresh access token.",
            type: "error",
            token: null,
          };
        }

        const data = await oauthResponse.json();
        setTokenAsCookie({
          accessToken: data.access_token,
          expiresIn: data.expires_in,
        });

        return {
          message: "Access token refreshed successfully.",
          type: "success",
          token: data.access_token,
        };
      } else {
        return {
          message: "No refresh token available to refresh the access token.",
          type: "error",
          token: null,
        };
      }
    } else {
      // Token is still valid
      return {
        message: "Access token is still valid.",
        type: "success",
        token: cookieStore.get("calendarAccessToken")?.value || null,
      };
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return {
      message: "Unexpected error while refreshing token.",
      type: "error",
      token: null,
    };
  }
};

export default refreshTokenIfExpiredService;

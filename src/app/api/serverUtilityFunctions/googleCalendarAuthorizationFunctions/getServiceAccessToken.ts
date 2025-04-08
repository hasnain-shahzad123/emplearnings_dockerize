// This function retrieves a fresh Google OAuth access token for the admin account.
// It uses a refresh token stored in environment variables to generate a new access token.
// If the refresh token or required credentials are missing, an error is returned.
// The function handles API errors gracefully and logs detailed error messages when necessary.
// On success, it returns the new access token along with a success message.

const getAdminAccountToken = async (): Promise<{
  message: string;
  type: "success" | "error";
  token: string | null;
}> => {
  try {
    // Retrieving the refresh token from environment variables
    const refreshToken = process.env.ADMIN_REFRESH_TOKEN;
    if (!refreshToken) {
      return {
        message: "Refresh token is not defined in the environment variables.",
        type: "error",
        token: null,
      };
    }

    // Constructing the request to fetch the access token
    const oauthResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    // Checking if the response is successful
    if (!oauthResponse.ok) {
      const errorData = await oauthResponse.json();
      console.error("OAuth error response:", errorData);
      return {
        message: `Failed to refresh access token: ${
          errorData.error_description || "Unknown error"
        }`,
        type: "error",
        token: null,
      };
    }

    const data = await oauthResponse.json();
    if (!data.access_token) {
      return {
        message: "Access token not found in the response.",
        type: "error",
        token: null,
      };
    }

    // Returning the refreshed access token
    return {
      message: "Access token refreshed successfully.",
      type: "success",
      token: data.access_token,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return {
      message: "Unexpected error while refreshing token.",
      type: "error",
      token: null,
    };
  }
};

export default getAdminAccountToken;
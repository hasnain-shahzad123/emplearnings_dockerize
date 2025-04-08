import { z } from "zod";
//this function is used to generate the OAuth consent link
//in simpler words : returns the link for getting google calendar authorization

//schema for validating fields to be stored in db
const validateField = z.object({
  uid: z.string().min(4, "UID is required"),
});

export default function generateOAuthConsentLinkService({
  uid,
}: {
  uid: string;
}): string {
  try {
    validateField.parse({ uid });
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!;
    const redirectUri = `${(process.env.NEXT_PUBLIC_URL || "").replace(
      /\/$/,
      ""
    )}/api/googleAuthorization/callback`;
    const scope = "https://www.googleapis.com/auth/calendar"; // Scope for Google Calendar access {max scope}
    const responseType = "code"; // Requesting authorization code
    const accessType = "offline"; // Requesting refresh token as well

    // Google OAuth 2.0 authorization endpoint
    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

    // required query parameters
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      access_type: accessType,
      response_type: responseType,
      state: JSON.stringify({ uid }), // Securely encoding the UID in the state (to be retrieved in the callback route)
    });

    // Appending query parameters to the base URL
    googleAuthUrl.search = params.toString();

    // Returning the full OAuth consent URL
    return googleAuthUrl.toString();
  } catch (e) {
    console.error("error during generation of link" + e);
    return (
      process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID! +
      "/dummyDash?status=error"
    );
  }
}

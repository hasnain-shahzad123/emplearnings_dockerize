// This route handles the callback from Google's OAuth 2.0 authorization flow.
// It exchanges the provided authorization code for an access token and refresh token.
// The refresh token is securely stored in Firebase Firestore under the associated tutor's UID.

// to indicate failure. On successful completion, the user is redirected to their dashboard with a
// `success` query parameter to confirm the operation was successful.

// If any errors occur during the process (e.g., missing code, state, or invalid parameters),
// the user is redirected back to their dashboard for a seamless experience, with an `error` query parameter

import saveCalendarRefreshToken from "@/firebase/firebase_admin/googleCalendar/saveCalendarRefreshToken";
import { GoogleTokenResponse } from "@/types"; //custom type
import { NextResponse } from "next/server";
import setTokenAsCookie from "../../serverUtilityFunctions/googleAuthorizationUtilityFunctions/setTokenAsCookie";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  //google will provide code on successfull authorization
  const code = searchParams.get("code");
  //state will contain uid of our tutor
  const state = searchParams.get("state");
  //error while getting consent
  if (!code) {
    console.error("no authorization code recieved");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}`);
  }
  // parsing state to retreive uid of tutor
  let uid: string;
  if (!state) {
    console.error("missing state parameter, unable to get uid");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}`);
  }
  try {
    const parsedState = JSON.parse(state);
    if (!parsedState.uid) {
      console.error("missing state parameter, unable to get uid");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}`);
    }
    uid = parsedState.uid;
  } catch (error: any) {
    console.error("unable to get uid from state parameters", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}`);
  }

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
  const redirectUri =
    process.env.NODE_ENV === "production"
      ? "https://emplearnings.com/api/googleAuthorization/callback"
      : `${(process.env.NEXT_PUBLIC_URL || "").replace(
          /\/$/,
          ""
        )}/api/googleAuthorization/callback`;
  //exchanging authorization code for access token and refresh token
  try {
    const response = await fetch(tokenUrl, {
      //post request to get access and refresh token from OAuth
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const data: GoogleTokenResponse = await response.json();

    if (!response.ok) {
      console.error("failed to exchange code for tokens");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL}/mentor-dashboard/${uid}?status=error`
      );
    }

    //success scenario, successfull in retreiving access token and refresh
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    //storing refresh token in db
    const storeRefreshToken = await saveCalendarRefreshToken({
      uid: uid,
      refreshToken: refreshToken,
    });
    if (storeRefreshToken.type === "error") {
      console.error(storeRefreshToken.message);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL}/mentor-dashboard/${uid}?status=error`
      );
    }
    //setting accessToken in cookies
    const setCookiesResponse = await setTokenAsCookie({
      accessToken: accessToken,
      expiresIn: data.expires_in,
    });
    if (setCookiesResponse.type === "error") {
      console.error(storeRefreshToken.message);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL}/mentor-dashboard/${uid}?status=error`
      );
    }

    //complete success + redirecting to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/mentor-dashboard/${uid}?status=success`
    );
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/mentor-dashboard/${uid}?status=error`
    );
  }
}

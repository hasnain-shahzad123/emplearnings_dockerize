import { NextRequest, NextResponse } from "next/server";
import verifySession from "./app/api/serverUtilityFunctions/verifySession";

const PUBLIC_ROUTES = [
  "/",
  "/verification-pending",
  "/action", // This handles email verification and password reset
  "/reset-password",
  "dummyDash",
  "/select-user-type",
  "/login",
  "/student-login",
  "/register",
  "/register-by-email",
  "/how-it-works",
  "/our-approach",
  "/work-with-us",
  "/testimonials",
  "/tutor_questions",
  "/student-to-mentor-1",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/payment/create-subscription",
  "/category",
  "/agreement",
  "/student-to-mentor-2",
  "/sentry-example-page",
  "/student-question",
  "/demo-for-mentors",
  "/education",
  "/bio",
  "/profile",
  "/class-schedule",
  "/my-category",
  "/pricing",
  "/tutor-preview-screen",
  "/tutor-agreement",
  "/stripe-connect-test",
  "/api/stripe-connect/create-account",
  "/api/stripe-connect/buy-course",
  "/api/stripe-connect/onboard",
  "/api/stripe-connect/retrieve-account",
  "/api/stripe-connect/mentor-dashboard",
  "/tutor-list",
  "/contact-us",
  "/demo-calendar",
  "/student-register",
  "/student-email-register",
  "/student-dashboard/123",
];

const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.includes(pathname);
const isApiOrStripeRoute = (pathname: string) =>
  pathname.startsWith("/api") || pathname.startsWith("/stripe");

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("AuthToken")?.value;
  const { pathname, origin } = req.nextUrl;

  // Allow direct access to API & Stripe routes
  if (isApiOrStripeRoute(pathname)) return NextResponse.next();
  if (pathname === "/dummyDash") return NextResponse.next();
  // If token exists, verify session
  if (token) {
    try {
      const { isValid, uid, role, isVerified } = await verifySession(token);

      if (isValid) {
        // Redirect users with unverified email
        if (
          pathname.startsWith("/mentor-dashboard") ||
          pathname.startsWith("/student-dashboard")
        ) {
          if (!isVerified && pathname !== "/verification-pending") {
            return NextResponse.redirect(
              new URL("/verification-pending", req.url)
            );
          }
        }

        // Restrict mentor-dashboard access based on UID
        if (pathname.startsWith("/mentor-dashboard")) {
          const match = pathname.match(/^\/mentor-dashboard\/(\w+)/);
          const tutorUid = match ? match[1] : null;

          if (tutorUid && tutorUid !== uid) {
            return NextResponse.redirect(new URL("/access-denied", req.url));
          }
        }

        // Allow direct access to email verification and password reset actions
        if (pathname === "/action") {
          const searchParams = req.nextUrl.searchParams;
          const mode = searchParams.get("mode");
          const oobCode = searchParams.get("oobCode");

          if ((mode === "verifyEmail" || mode === "resetPassword" || mode === "verifyAndChangeEmail") && oobCode) {
            return NextResponse.next();
          }
        }

        // Redirect authenticated users to their dashboard
        if (role === "tutor") {
          if (pathname.startsWith(`/mentor-dashboard/${uid}`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            new URL(`/mentor-dashboard/${uid}`, req.url)
          );
        } else if (role === "student") {
          if (pathname.startsWith(`/student-dashboard/${uid}`)) {
            return NextResponse.next();
          }
          return NextResponse.redirect(
            new URL(`/student-dashboard/${uid}`, req.url)
          );
        }
      }
    } catch (err) {
      console.error("Error verifying token:", err);
      // Clear token and redirect to login on verification failure
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("AuthToken");
      return response;
    }
  }

  // Allow unauthenticated access to public routes
  if (isPublicRoute(pathname)) return NextResponse.next();
  // Redirect unauthenticated users to login or user type selection
  return NextResponse.redirect(new URL("/select-user-type", req.url));
}

export const config = { matcher: "/((?!.*\\.).*)" };

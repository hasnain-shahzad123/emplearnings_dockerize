import { NextRequest, NextResponse } from "next/server";
import createSession from "../serverUtilityFunctions/createSession";
import createFirebaseTutorClaim from "@/firebase/firebase_admin/tutor/createFirebaseTutorClaim";
import createFirebaseStudentClaim from "@/firebase/firebase_admin/student/createFirebaseStudentClaim";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        {
          message: "Invalid content type. Expected application/json",
          type: "error",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { uid, callType, userType, isVerified } = body;

    if (!uid || typeof uid !== "string") {
      return NextResponse.json(
        {
          message: "Invalid or missing uid in request body",
          type: "error",
        },
        { status: 400 }
      );
    }

    if (!callType || typeof callType !== "string") {
      return NextResponse.json(
        {
          message: "Call type of Api is not defined",
          type: "error",
        },
        { status: 400 }
      );
    }

    if (!userType || !["student", "tutor"].includes(userType)) {
      return NextResponse.json(
        {
          message: "Invalid or missing user type",
          type: "error",
        },
        { status: 400 }
      );
    }

    if (isVerified === null || typeof isVerified !== "boolean") {
      return NextResponse.json(
        {
          message: "Invalid or missing isVerified in request body",
          type: "error",
        },
        { status: 400 }
      );
    }

    const sessionResponse = await createSession(uid, userType, isVerified);

    if (!sessionResponse) {
      return NextResponse.json(
        {
          message: "Error creating the Session",
          type: "error",
        },
        { status: 400 }
      );
    }

    if (callType === "register") {
      const response =
        userType === "tutor"
          ? await createFirebaseTutorClaim(uid)
          : await createFirebaseStudentClaim(uid);

      if (response.type === "error") {
        return NextResponse.json(
          {
            message: `Error creating Firebase Custom Token for ${userType}`,
            type: "error",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: `${userType} Session successfully created, firebase claim successfully added and data successfully written to firestore!`,
          type: "success",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: `${userType} Session successfully created, and data successfully written to firestore!`,
        type: "success",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in session API:", error);
    return NextResponse.json(
      {
        message: error.message || "Error processing the request",
        type: "error",
      },
      { status: 500 }
    );
  }
}

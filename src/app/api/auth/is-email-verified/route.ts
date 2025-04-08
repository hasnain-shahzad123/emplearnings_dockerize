import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase_admin/initializeAdmin";

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    const userRecord = await adminAuth.getUser(uid);

    return NextResponse.json({
      isVerified: userRecord.emailVerified,
      
    });
  } catch (error) {
    return NextResponse.json(
      {
        isVerified: false,
        error: "Failed to verify email status",
      },
      { status: 500 }
    );
  }
}

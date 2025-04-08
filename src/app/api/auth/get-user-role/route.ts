import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase_admin/initializeAdmin";

export async function POST(req: NextRequest) {
  try {

    
    const { email } = await req.json();


    if (!email) {

      return NextResponse.json({
        type: "error",
        role: null,
        message: "Email is required"
      }, { status: 400 });
    }


    const userRecord = await adminAuth.getUserByEmail(email);

    
    const customClaims = userRecord.customClaims || {};



    return NextResponse.json({
      type: "success",
      role: customClaims.role || null,
      message: "User role retrieved successfully"
    });

  } catch (error) {
    console.error("Error getting user role:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({
      type: "error",
      role: null,
      message: error instanceof Error ? error.message : "Failed to get user role"
    }, { status: 500 });
  }
}

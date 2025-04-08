import { NextResponse } from "next/server";
import { auth } from "@/firebase/firebaseConfig";
import { applyActionCode } from "firebase/auth";

export async function POST(request: Request) {
  try {
    const { oobCode } = await request.json();
    
    await applyActionCode(auth, oobCode);
    
    return NextResponse.json({
      message: "Email verified successfully!",
      type: "success"
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message || "Failed to verify email",
      type: "error"
    }, { status: 400 });
  }
}
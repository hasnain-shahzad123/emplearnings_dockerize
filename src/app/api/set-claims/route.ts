import { adminAuth } from "@/firebase/firebase_admin/initializeAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { uid } = await request.json();

		// Set custom claims for the user
		await adminAuth.setCustomUserClaims(uid, {
			admin: true,
			isTutor: true,
			role: "tutor",
			// Add any other custom claims you need
		});

		return NextResponse.json({ message: "Claims set successfully" });
	} catch (error) {
		console.error("Error setting custom claims:", error);
		return NextResponse.json(
			{ error: "Failed to set custom claims" },
			{ status: 500 }
		);
	}
}

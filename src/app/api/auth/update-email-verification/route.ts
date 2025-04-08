import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase_admin/initializeAdmin";

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{
					success: false,
					message: "Email is required",
				},
				{ status: 400 }
			);
		}

		const user = await adminAuth.getUserByEmail(email);
		await adminAuth.setCustomUserClaims(user.uid, {
			...user.customClaims,
			isVerified: true,
		});

		
    // Check if email verification status was updated
    

		return NextResponse.json({
			success: true,
			message: "Email verification status updated",
		});
	} catch (error) {
		console.error("Error updating email verification:", error);
		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error
						? error.message
						: "Failed to update email verification",
			},
			{ status: 500 }
		);
	}
}

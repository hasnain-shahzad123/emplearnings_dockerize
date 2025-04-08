import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebase_admin/initializeAdmin";

export async function checkIfEmailIsVerified({
	uid,
}: {
	uid: string;
}): Promise<{
	isVerified: boolean;
	type: "success" | "error";
}> {
	try {
		const userRecord = await adminAuth.getUser(uid);

		return {
			isVerified: userRecord.emailVerified,
			type: "success",
		};
	} catch (error) {
		return {
			isVerified: false,
			type: "error",
		};
	}
}

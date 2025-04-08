"use server";

import decryptToken from "./decryptToken";
import encryptToken from "./encryptToken";
import { cookies } from "next/headers";

const SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

export default async function verifySession(token: string): Promise<{
	isValid: boolean;
	newToken?: string;
	uid: string | null;
	role?: string | null;
	isVerified: boolean;
}> {
	const session = await decryptToken(token);

	if (
		!session?.uid ||
		!session?.role ||
		!session?.exp ||
		!session?.isVerified
	) {
		return { isValid: false, uid: null, isVerified: false };
	}

	const currentTime = Math.floor(Date.now() / 1000);

	// Check if the token has expired
	if (session.exp <= currentTime) {
		return { isValid: false, uid: null, isVerified: session.isVerified };
	}

	// If the token is close to expiring (e.g., less than 1 day left), refresh it
	if (session.exp - currentTime < 24 * 60 * 60) {
		const newExpiration = Math.floor(Date.now() / 1000) + SESSION_DURATION;
		const newToken = await encryptToken({
			uid: session.uid,
			role: session.role,
			exp: newExpiration,
			isVerified: session.isVerified,
		});

		// Update the cookie with the new token
		const cookieStore = cookies();
		cookieStore.set("AuthToken", newToken, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			expires: new Date(newExpiration * 1000),
		});

		return {
			isValid: true,
			newToken,
			uid: session.uid,
			role: session.role,
			isVerified: session.isVerified,
		};
	}

	return {
		isValid: true,
		uid: session.uid,
		role: session.role,
		isVerified: session.isVerified,
	};
}

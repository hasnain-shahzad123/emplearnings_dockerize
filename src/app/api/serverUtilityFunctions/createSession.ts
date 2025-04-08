"use server";

import encryptToken from "./encryptToken";
import { cookies } from "next/headers";

const cookie = {
	name: "AuthToken",
	options: {
		httpOnly: true,
		secure: true,
		sameSite: "lax" as "lax",
		path: "/",
	},
	duration: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
};

export default async function createSession(
	userId: string,
	role: string,
	isVerified: boolean
): Promise<boolean> {
	try {
		const cookieStore = cookies();

		const expires = new Date(Date.now() + cookie.duration);
		const payload = {
			uid: userId,
			role: role,
			exp: Math.floor(expires.getTime() / 1000),
			isVerified,
		};
		const session = await encryptToken(payload);

		cookieStore.set(cookie.name, session, { ...cookie.options, expires });
		return true;
	} catch (error: any) {
		console.error("Error creating the new Session:", error);
		return false;
	}
}

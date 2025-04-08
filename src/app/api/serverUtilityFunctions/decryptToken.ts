"use server";

import { jwtVerify } from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

type JWTPayload = {
	uid: string;
	role: string;
	exp: number;
	iat: number;
	isVerified: boolean;
};

export default async function decryptToken(
	token: string
): Promise<JWTPayload | null> {
	if (!JWT_SECRET_KEY) {
		throw new Error("JWT_SECRET_KEY is not defined");
	}

	try {
		const { payload } = await jwtVerify<JWTPayload>(
			token,
			new TextEncoder().encode(JWT_SECRET_KEY),
			{
				algorithms: ["HS256"],
			}
		);
		return payload;
	} catch (err) {
		console.error("Error verifying token:", err);
		return null;
	}
}

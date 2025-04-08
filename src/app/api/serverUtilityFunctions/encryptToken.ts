"use server";

import { SignJWT } from "jose";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

type PayloadType = {
	uid: string;
	role: string;
	exp: number;
	isVerified: boolean;
};

export default async function encryptToken(
	payload: PayloadType
): Promise<string> {
	if (!JWT_SECRET_KEY) {
		throw new Error("JWT_SECRET_KEY is not defined");
	}

	// creating token using jose
	const customToken = await new SignJWT(payload)
		.setProtectedHeader({
			alg: "HS256",
		})
		.setIssuedAt()
		.setExpirationTime(payload.exp)
		.sign(new TextEncoder().encode(JWT_SECRET_KEY));

	return customToken;
}

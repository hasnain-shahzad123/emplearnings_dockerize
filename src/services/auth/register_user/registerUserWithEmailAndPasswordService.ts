import z from "zod";
import { auth } from "@/firebase/firebaseConfig";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import addTutorToDB from "@/firebase/tutor/addTutorToDB";
import addStudentToDB from "@/firebase/student/addStudentToDb";

export const RegisterUserWithEmailAndPasswordSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	username: z.string().min(6, "Username must be at least 6 characters long"),
	userType: z.string().min(2, "User Type is required"),
});

export type RegisterUserWithEmailAndPasswordFormValues = z.infer<
	typeof RegisterUserWithEmailAndPasswordSchema
>;

type RegisterApiResponseType = {
	message: string;
	type: string;
};

export default async function registerUserWithEmailAndPasswordService({
	email,
	password,
	username,
	userType,
}: RegisterUserWithEmailAndPasswordFormValues): Promise<{
	type: string;
	message: string;
	redirectTo?: string;
}> {
	try {
		const parsedValues = RegisterUserWithEmailAndPasswordSchema.parse({
			email,
			password,
			username,
			userType,
		});

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const uid = userCredential.user.uid;

		if (uid) {
			const response = await fetch(`/api/session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uid,
					callType: "register",
					userType,
					isVerified: auth.currentUser?.emailVerified || false,
				}),
			});

			if (!response.ok) {
				return {
					type: "error",
					message: "Oops! We faced an error while registering the User.",
				};
			}

			// Read the response body only once
			const apiResponseData: RegisterApiResponseType = await response.json();

			if (apiResponseData.type === "error") {
				return {
					type: apiResponseData.type,
					message: apiResponseData.message,
				};
			}

			if (apiResponseData.type === "success") {
				const dbResponse =
					userType === "tutor"
						? await addTutorToDB({ uid, username, email })
						: await addStudentToDB({ uid, username, email });

				if (dbResponse.type === "success") {
					await sendEmailVerification(userCredential.user, {
						url: `${
							process.env.NEXT_PUBLIC_URL
						}/verify-email`,
						handleCodeInApp: true,
					});

					return {
						type: "success",
						message:
							"Registration successful! Please check your email to verify your account.",
						redirectTo: "/verification-pending",
					};
				}
			}
		}

		return {
			type: "error",
			message: "Error while registering the user!",
		};
	} catch (error: any) {
		console.error(error);
		if (error.code === "auth/email-already-in-use") {
			return {
				type: "error",
				message: "Email already in use. Please try with a different email.",
			};
		}
		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: error.errors[0]?.message || "Validation error",
			};
		}

		return {
			type: "error",
			message: "Oops! We faced an error while registering the User.",
		};
	}
}

"use client";
import { signInWithPopup } from "firebase/auth"; // Remove signOut import
import { auth } from "@/firebase/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import addTutorToDB from "@/firebase/tutor/addTutorToDB";
import addStudentToDB from "@/firebase/student/addStudentToDb";
import { firestore } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export default async function registerUserWithGoogleService(
	userType: string
): Promise<{
	type: string;
	message: string;
	existingUserType?: "tutor" | "student";
	needsSignOut?: boolean; // Add this flag
}> {
	try {
		const result = await signInWithPopup(auth, provider);
		if (result.user.uid) {
			const { uid, displayName, email } = result.user;

			// Check if user exists in either collection
			const tutorDoc = await getDoc(doc(firestore, "TUTORS", uid));
			const studentDoc = await getDoc(doc(firestore, "STUDENTS", uid));

			// If user exists, return error with needsSignOut flag
			if (tutorDoc.exists() || studentDoc.exists()) {
				return {
					type: "error",
					message: tutorDoc.exists()
						? "This Google account is already registered as a tutor. Please use a different account or login as a tutor."
						: "This Google account is already registered as a student. Please use a different account or login as a student.",
					existingUserType: tutorDoc.exists() ? "tutor" : "student",
					needsSignOut: true,
				};
			}

			// Continue with registration if no existing account found
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
					message: "Error while registering the user!",
				};
			}

			const apiResponseData: { type: string; message: string } =
				await response.json();

			if (apiResponseData.type === "error") {
				return {
					type: apiResponseData.type,
					message: apiResponseData.message,
				};
			}

			if (apiResponseData.type === "success" && displayName && email) {
				const dbResponse =
					userType === "tutor"
						? await addTutorToDB({ uid, username: displayName, email })
						: await addStudentToDB({ uid, username: displayName, email });

				if (dbResponse.type === "success") {
					return {
						type: "success",
						message: `${userType} registered successfully`,
					};
				}
			}

			return {
				type: "error",
				message: `Error while signing up the ${userType}!`,
			};
		}

		return {
			type: "error",
			message: "No user ID returned from Google Auth",
		};
	} catch (error: any) {
		console.error(
			"Google Auth Error",
			error.code,
			error.message,
			error.email,
			error.credential
		);

		return {
			type: "error",
			message: error.message || `Failed to register ${userType} with Google`,
		};
	}
}

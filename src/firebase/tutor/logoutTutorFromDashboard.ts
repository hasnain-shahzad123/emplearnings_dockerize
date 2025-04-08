import deleteSession from "@/app/api/serverUtilityFunctions/deleteSession";
import { auth } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";

export default async function logoutTutorFromDashboard(): Promise<
	{ type: "success"; message: string } | { type: "error"; message: string }
> {
	try {
		await signOut(auth);
		if (!(await deleteSession())) {
			console.log("Error deleting the session cookie");
		}
		return { type: "success", message: "Successfully logged out" };
	} catch (error) {
		if (error instanceof FirebaseError) {
			console.error("Firebase Error while Logging out: ", error.code);
			return {
				type: "error",
				message: "Firebase error: " + error.message,
			};
		}
		console.error("Error while logging out tutor from dashboard", error);
		return {
			type: "error",
			message: "Error while logging out tutor from dashboard",
		};
	}
}

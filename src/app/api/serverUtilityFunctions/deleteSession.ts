"use server";
import { cookies } from "next/headers";

export default async function deleteSession(): Promise<boolean> {
	try {
		cookies().delete("AuthToken");
		// cookies().delete("calendarAccessToken");
		// cookies().delete("calendarAccessToken");
		return true;
	} catch (error) {
		console.error("Error deleting the Session:", error);
		return false;
	}
}

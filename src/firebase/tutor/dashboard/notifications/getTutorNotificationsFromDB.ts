"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorDocumentDataType, NotificationType } from "@/types";
import { FirebaseError } from "firebase/app";
import { collection, getDocs } from "firebase/firestore";
import z from "zod";

const getTutorDashBoardDataSchema = z.object({
	uid: z.string(),
});

const defaultNotifications: NotificationType[] = []; // Replace with an appropriate default structure if needed

type GetTutorDashBoardDataInput = z.infer<typeof getTutorDashBoardDataSchema>;

export default async function getTutorNotificationsFromDB({
	uid,
}: GetTutorDashBoardDataInput): Promise<{
	type: "success" | "error";
	message: string;
	notifications: NotificationType[] | null;
}> {
	try {
		// Validate the input data
		getTutorDashBoardDataSchema.parse({ uid });

		// Fetch notifications
		const notificationsRef = collection(
			firestore,
			"TUTORS",
			uid,
			"TUTOR_NOTIFICATIONS"
		);

		const notificationsDoc = await getDocs(notificationsRef);
		const notificationsArray: NotificationType[] = [];
		notificationsDoc.forEach((doc) => {
			notificationsArray.push(doc.data() as NotificationType);
		});

		console.log("Notifications fetched:", notificationsArray);

		notificationsArray.sort((a, b) => {
			if (a.read === b.read) return 0;
			return a.read ? 1 : -1;
		}); // Add a sorting function if needed

		// Assign notifications or fallback to default
		const notifications = notificationsArray || defaultNotifications;

		// Return the response
		return {
			type: "success",
			notifications,
			message: "Fetched tutor dashboard data successfully.",
		};
	} catch (error) {
		console.error("Error fetching tutor dashboard data:", error);

		if (error instanceof z.ZodError) {
			return {
				type: "error",
				message: "Error during data validation with zod: " + error.message,
				notifications: null,
			};
		} else if (error instanceof FirebaseError) {
			return {
				type: "error",
				message: "Error while interacting with Firebase: " + error.message,
				notifications: null,
			};
		}

		return {
			type: "error",
			message: "Failed to fetch tutor dashboard notifications.",
			notifications: null,
		};
	}
}

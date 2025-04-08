import { firestore } from "@/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import z, { ZodError } from "zod";

const markTutorNotificationReadInput = z.object({
	tutorId: z.string().min(1, "tutor id is required"),
	notificationId: z.string().min(1, "notification id is required"),
});

type MarkTutorNotificationReadInputType = z.infer<
	typeof markTutorNotificationReadInput
>;
export default async function markTutorNotificationRead({
	tutorId,
	notificationId,
}: MarkTutorNotificationReadInputType): Promise<{
	type: "success" | "error";
	message: string;
}> {
	try {
		const ref = doc(
			firestore,
			`/TUTORS/${tutorId}/TUTOR_NOTIFICATIONS/${notificationId}`
		);
		setDoc(ref, { read: true }, { merge: true });

		return {
			type: "success",
			message: "Notification marked as read successfully",
		};
	} catch (e: any) {
		if (e instanceof FirebaseError) {
			return {
				type: "error",
				message:
					"Firebase Error while marking the notification read: " + e.message,
			};
		}

		else if (e instanceof ZodError) {
			const errors = e.errors.map((error) => error.message);
			return {
				type: "error",
				message: "Zod validation error(s): " + errors.join(", "),
			};
		}

		return {
			type: "error",
			message:
				"an unexpected error occurred while trying to mark the notification as read " +
				e.message
					? e.message
					: "",
		};
	}
}

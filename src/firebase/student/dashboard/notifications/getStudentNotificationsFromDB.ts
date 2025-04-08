"use client";
import { firestore } from "@/firebase/firebaseConfig";
import { NotificationType } from "@/types";
import { FirebaseError } from "firebase/app";
import { collection, getDocs } from "firebase/firestore";
import z from "zod";

const getStudentNotificationsSchema = z.object({
  uid: z.string(),
});

const defaultNotifications: NotificationType[] = [];

type GetStudentNotificationsInput = z.infer<typeof getStudentNotificationsSchema>;

export default async function getStudentNotificationsFromDB({
  uid,
}: GetStudentNotificationsInput): Promise<{
  type: "success" | "error";
  message: string;
  notifications: NotificationType[] | null;
}> {
  try {
    getStudentNotificationsSchema.parse({ uid });

    const notificationsRef = collection(
      firestore,
      "STUDENTS",
      uid,
      "STUDENT_NOTIFICATIONS"
    );

    const notificationsDoc = await getDocs(notificationsRef);
    const notificationsArray: NotificationType[] = [];
    notificationsDoc.forEach((doc) => {
      notificationsArray.push(doc.data() as NotificationType);
    });

    notificationsArray.sort((a, b) => {
      if (a.read === b.read) return 0;
      return a.read ? 1 : -1;
    });

    const notifications = notificationsArray || defaultNotifications;

    return {
      type: "success",
      notifications,
      message: "Fetched student notifications successfully.",
    };
  } catch (error) {
    console.error("Error fetching student notifications:", error);

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
      message: "Failed to fetch student notifications.",
      notifications: null,
    };
  }
}
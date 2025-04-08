// This function validates the provided input for deleting a Google Calendar event.
// It ensures the tutor's UID and the event ID are present and valid.
// If validation passes, it sends a DELETE request to the API to remove the event.
// If any errors occur during validation or the deletion process, an appropriate error message is returned.
import { adminDb } from "@/firebase/firebase_admin/initializeAdmin";
import { z } from "zod";

const deleteEventInput = z.object({
  uid: z.string().min(1, "tutor uid is required"),
  eventId: z
    .string()
    .min(1, "eventId of the event ur trying to delete is required"),
});
const deleteCalendarEvent = async ({
  uid,
  eventId,
}: z.infer<typeof deleteEventInput>) => {
  try {
    const validationResult = deleteEventInput.safeParse({ uid, eventId });
    if (validationResult.error) {
      const errors = validationResult.error.errors.map((e) => {
        e.message || "unexpected error in validaton";
      });
      return {
        type: "error",
        message: errors,
      };
    } else {
      try {
        const response = await fetch("/api/calendar/event", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid, eventId }),
        });

        if (response.ok) {
          return {
            type: "success",
            message: "Event deleted successfully",
          };
          
        


        } else {
          const data = await response.json();
          return { type: "error", message: data.message };
        }
      } catch (e) {
        console.error(e);
        return {
          type: "error",
          message: "unexpected error while trying to delete event",
        };
      }
    }
  } catch (e: any) {
    return {
      type: "error",
      message:
        "an unexpected error occurred while trying to delete the event " +
        e.message
          ? e.message
          : "",
    };
  }
};

export default deleteCalendarEvent;

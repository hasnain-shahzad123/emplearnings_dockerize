// This function validates and updates a Google Calendar event via a PATCH request.
// It ensures the provided start time and end time are valid, with the end time being greater than the start time.
// If the validation passes, it updates the event details using the provided eventId, startTime, and endTime.
// If any errors occur during validation or the API call, appropriate error messages are returned.
import z from "zod";

const updateCalendarEventSchema = z
  .object({
    uid: z.string().min(1, "User ID is required."),
    eventId: z
      .string()
      .min(1, "EventId of the event you're trying to update is missing"),
    startTime: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ required_error: "Start time is required." })
    ),
    endTime: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ required_error: "End time is required." })
    ),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be greater than start time.",
    path: ["endTime"],
  })
  .refine((data) => data.startTime >= new Date(), {
    message: "Start time cannot be in the past.",
    path: ["startTime"],
  });
const updateCalendarEvent = async ({
  uid,
  eventId,
  startTime,
  endTime,
}: z.infer<typeof updateCalendarEventSchema>) => {
  try {
    const validationResult = updateCalendarEventSchema.safeParse({
      uid,
      eventId,
      startTime,
      endTime,
    });
    if (validationResult.error) {
      const errors = validationResult.error.errors.map((e) => {
        e.message || "unexpected error in validaton";
      });
      return {
        type: "error",
        message: errors,
      };
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/calendar/event`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            eventId,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
          }),
        }
      );
      if (!response.ok) {
        return {
          type: "error",
          message: response,
        };
      } else {
        return {
          type: "success",
          message: "event has been updated successfully",
        };
      }
    }
  } catch (e: any) {
    return {
      type: "error",
      message:
        "an unexpected error occurred while trying to update the event" +
        e.message
          ? e.message
          : "",
    };
  }
};
export default updateCalendarEvent;

// This function validates the event creation form data using Zod and sends a POST request to create an event.
// It ensures the required fields such as UID, title, start time, and end time are valid, along with optional attendees and description.
// If the request is successful, the event data is returned; otherwise, the error response is returned.

import z from "zod";
// interface EventCreationForm {
//   uid: string; // The user ID of the event creator
//   title: string; // The title of the event
//   description?: string | null; // Optional description of the event
//   startTime: string; // Start time in ISO string format
//   endTime: string; // End time in ISO string format
//   attendees: { email: string }[]; // Array of attendees/students with email addresses
// }
const calendarEventSchema = z.object({
  uid: z.string().min(1, "User ID is required."),
  name: z.string().min(1, "Name is required."),
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(), // Description is optional
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  attendees: z
    .array(
      z.object({
        email: z.string().email("Invalid email address."),
      })
    )
    .optional(),
});

type EventCreationForm = z.infer<typeof calendarEventSchema>;
const createCalendarEventService = async ({
  uid,
  name,
  title,
  description,
  startTime,
  endTime,
  attendees,
}: EventCreationForm) => {
  //validating fields
  const FormFields = calendarEventSchema.parse({
    uid,
    name,
    title,
    description,
    startTime,
    endTime,
    attendees,
  });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/calendar/event`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        name,
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        attendees,
      }),
    }
  );
  if (!response.ok) {
    return {
      type: "error",
      details: response,
    };
  }
  const data = await response.json();
  return {
    type: "success",
    createdEvent: data,
  };
};
export default createCalendarEventService;

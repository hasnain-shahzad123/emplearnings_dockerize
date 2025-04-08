// Fetches calendar events for a user by sending a POST request with the user's UID.
// Validates the UID using Zod before making the request to the API.
//Serves as a helper function so that the api doesnt have to be directly called from the pages
"use client";
import z from "zod";
const uidSchema = z.string().min(1, "User ID is required.");
const fetchCalendarEventsService = async ({ uid }: { uid: string }) => {
  try {
    // Validating UID
    uidSchema.parse(uid);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/calendar/fetch/events`,
      {
        method: "POST",
        body: JSON.stringify({ uid: uid }),
      }
    );

    if (!response.ok) {
      console.error("Unable to fetch events", response);
      return {
        type: "error",
        error: response,
      };
    } else {
      const data = await response.json();
      return {
        type: "success",
        events: data.events,
      };
    }
  } catch (e) {
    console.error(e);
    return {
      type: "error",
      events: [],
    };
  }
};

export default fetchCalendarEventsService;

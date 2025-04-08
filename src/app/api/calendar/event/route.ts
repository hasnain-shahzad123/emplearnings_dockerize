import { NextRequest, NextResponse } from "next/server";
import refreshTokenIfExpired from "@/services/googleCalendar/calendarAuthorization/refreshTokenService";

export async function POST(req: Request) {
  try {
    const { uid, name, title, description, startTime, endTime, attendees } =
      await req.json();

    // Fetching Access Token
    const accessToken = await getAccessToken(uid);

    // Creating event object
    const event = {
      summary: `EmpLearning-${title}`,
      location: "123 Main St, Anytown, USA",
      description,
      start: {
        dateTime: startTime,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: endTime,
        timeZone: "America/Los_Angeles",
      },
      attendees,
      extendedProperties: {
        private: {
          attendeeNames: name,
        },
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now().toString()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
    };

    // Making API Call to Create Event
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    // Handling API Response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating event:", errorData);
      return NextResponse.json(
        { error: "Error creating event.", details: errorData },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Event created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Unexpected error occurred while creating the event:",
      error.message || error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred while creating the event." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { uid, eventId, startTime, endTime } = await req.json();

    // Fetching Access Token
    const accessToken = await getAccessToken(uid);

    const eventUpdate = {
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: "America/Los_Angeles",
      },
    };

    // Making API Call to Update Event
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventUpdate),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error updating event ${eventId}:`, errorData);
      return NextResponse.json(
        { error: "Error updating event.", details: errorData },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Event updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Unexpected error occurred while updating the event:",
      error.message || error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred updating the event." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { uid, eventId } = await req.json();

    // Fetching Access Token
    const accessToken = await getAccessToken(uid);

    // Making API Call to Delete Event
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error deleting event ${eventId}:`, errorData);
      return NextResponse.json(
        { error: "Error deleting event.", details: errorData },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Unexpected error occurred while deleting the event:",
      error.message || error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred deleting the event." },
      { status: 500 }
    );
  }
}

// Helper function for token management
async function getAccessToken(uid: string) {
  const requestToken = await refreshTokenIfExpired({ uid });
  if (requestToken.type === "error") {
    console.error("Access token not found or expired. User not authorized.");
    throw new Error("Access token not found. Probably not authorized");
  }
  return requestToken.token;
}

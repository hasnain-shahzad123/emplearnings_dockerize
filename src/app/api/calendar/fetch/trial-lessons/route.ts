import { NextRequest, NextResponse } from "next/server";
import refreshTokenIfExpired from "@/services/googleCalendar/calendarAuthorization/refreshTokenService";
import { Event } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ message: "UID is required" }, { status: 400 });
    }

    const requestToken = await refreshTokenIfExpired({ uid });

    if (requestToken?.type !== "success") {
      console.error("Token refresh failed:", requestToken);
      return NextResponse.json(
        { message: "Failed to refresh access token" },
        { status: 401 }
      );
    }
    // current time in ISO format
    const timeMin = new Date().toISOString();
    // 2 weeks from now in ISO format
    const timeMax = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const accessToken = requestToken.token;
    const url = new URL(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    );
    url.searchParams.append("timeMin", timeMin);
    url.searchParams.append("timeMax", timeMax);
    url.searchParams.append("orderBy", "startTime");
    url.searchParams.append("singleEvents", "true");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Google Calendar API error:", await response.text());
      return NextResponse.json(
        { message: "Failed to fetch calendar events" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const calendarEvents = data.items?.map((event: any) => {
      const attendeeNames = event.extendedProperties?.private?.attendeeNames
        ? event.extendedProperties.private.attendeeNames.split(",").reverse()
        : [];

      return {
        meetingLink:
          event.conferenceData?.entryPoints?.[0]?.uri ||
          event.hangoutLink ||
          null,
        eventLink: event.htmlLink,
        startTime: event.start.dateTime,
        endTime: event.end.dateTime,
        attendees:
          event.attendees?.map((attendee: any, index: number) => ({
            email: attendee.email,
            name: attendeeNames[index] || "Name not available",
          })) || [],
        summary: event.summary,
        eventId: event.id,
      };
    });

    const filteredEvents = calendarEvents
      ?.filter(
        (event: Event) =>
          event.meetingLink && event.summary?.includes("EmpLearning-Trial-")
      )
      .map((event: Event) => ({
        ...event,
        summary: event.summary.replace("EmpLearning-Trial-", ""),
      }));

    return NextResponse.json(
      {
        message: "Successfully retrieved events",
        events: filteredEvents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "This endpoint only supports POST requests" },
    { status: 405 }
  );
}

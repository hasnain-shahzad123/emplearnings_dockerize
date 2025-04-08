import { NextRequest, NextResponse } from "next/server";
import getServiceAccountToken from "../../serverUtilityFunctions/googleCalendarAuthorizationFunctions/getServiceAccessToken";

type ApiResponse = {
  type: "success" | "error";
  message: string;
};

export async function POST(req: NextRequest) {
  const adminCalendarId = process.env.ADMIN_CALENDAR_ID;

  if (!adminCalendarId) {
    return NextResponse.json({
      type: "error",
      message: "Configuration error",
    });
  }

  try {
    const { startTime, endTime, tutorEmail } = await req.json();

    if (!startTime || !endTime || !tutorEmail) {
      return NextResponse.json({
        type: "error",
        message: "Missing required fields",
      });
    }

    const requestToken = await getServiceAccountToken();
    if (requestToken.type === "error") {
      return NextResponse.json({
        type: "error",
        message: "Authorization failed",
      });
    }

    const event = {
      summary: "EmpoweredLearning Demonstration",
      description:
        "Join this private demonstration session with the admin to explore how the system can help you achieve your teaching goals and give you a taste of the potential benefits for your tutoring sessions.",
      start: {
        dateTime: startTime,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: endTime,
        timeZone: "America/Los_Angeles",
      },
      attendees: [
        {
          email: tutorEmail,
          responseStatus: "needsAction",
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now().toString()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: true,
      sendNotifications: true,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
      sendUpdates: "all",
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${adminCalendarId}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${requestToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        type: "error",
        message: "Failed to create calendar event",
      });
    }

    const data = await response.json();

    return NextResponse.json({
      type: "success",
      message: data.htmlLink,
    });
  } catch (error) {
    return NextResponse.json({
      type: "error",
      message: "An unexpected error occurred",
    });
  }
}

// This module organizes a demo meeting between a tutor and the admin.
// Validates meeting details using a Zod schema to ensure correctness.
// Ensures the end time is after the start time and processes date inputs correctly.
// Makes a POST API call to create the meeting on the backend system.
// Returns the result of the operation, handling both validation and API errors.
import z from "zod";

const meetingForDemoSchema = z
  .object({
    startTime: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ required_error: "Start time is required." })
    ),
    endTime: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date({ required_error: "End time is required." })
    ),
    tutorEmail: z.string().email("Valid email address is required."),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be greater than start time.",
    path: ["endTime"],
  });

const scheduleMeetingForDemo = async ({
  tutorEmail,
  startTime,
  endTime,
}: z.infer<typeof meetingForDemoSchema>) => {
  try {
    const validationResult = meetingForDemoSchema.safeParse({
      tutorEmail,
      startTime,
      endTime,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => {
        e.message || "unexpected error in validation";
      });
      return {
        type: "error",
        message: errors,
      };
    }

    const response = await fetch("/api/tutor-demo/organize-meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tutorEmail,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      }),
    });

    if (!response.ok) {
      return {
        type: "error",
        message: "Failed to schedule the meeting",
      };
    }

    return {
      type: "success",
      message: "Meeting has been scheduled successfully",
    };
  } catch (e: any) {
    return {
      type: "error",
      message:
        "an unexpected error occurred while trying to schedule the meeting" +
        (e.message ? e.message : ""),
    };
  }
};

export default scheduleMeetingForDemo;

import { demoAcknowledgementTemplate } from "@/assets/mail-templates/demoAcknowledgementTemplate";
import { z } from "zod";

let MailSchema = z.object({
  email: z.string().email(),
});

export const sendDemoAcknowledgementMail = async (email: String) => {
  const parseResult = MailSchema.safeParse({ email });

  if (parseResult.error) {
    return {
      type: "error",
      message: parseResult.error.message,
    };
  } else {
    try {
      const htmlContent = demoAcknowledgementTemplate;
      const res = await fetch("/api/nodemailer/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Your Demo Request Has Been Received - Empowered Learning",
          text: "Thank you for your demo request. We will review your application within 24-48 hours and get back to you with available time slots for your demo session.",
          html: htmlContent,
        }),
      });

      if (res.ok) {
        return {
          type: "success",
          message: "Mail sent successfully",
        };
      } else {
        return {
          type: "error",
          message: "Error occurred in sending mail",
        };
      }
    } catch (e) {
      console.error(e);
      return {
        type: "error",
        message: "Error occurred in sending mail",
      };
    }
  }
};

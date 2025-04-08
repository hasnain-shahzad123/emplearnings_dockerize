import { z } from "zod";
import hasTutorCompletedVerification from "@/firebase/stripe/connect/hasTutorCompletedVerification";
import hasTutorOnboarded from "@/firebase/stripe/connect/hasTutorOnboarded";
import getTutorStripeConnectId from "@/firebase/stripe/connect/getTutor'sStripeConnectId";
import createStripeConnectAccount from "./createStripeConnectAccountService";

type ActionType = "onboard" | "fulfill" | "redirect";

type SuccessResponse<T> = {
  type: "success";
  message: string;
  action: ActionType;
  data?: T;
};

type ErrorResponse = {
  type: "error";
  message: string | z.ZodError;
};

type DashboardResponse = SuccessResponse<{ link: string }> | ErrorResponse;

const getDashboardLinkSchema = z.object({
  uid: z.string().min(1, "Request made without uid"),
});

async function fetchDashboardLink(
  connectId: string
): Promise<DashboardResponse> {
  try {
    const response = await fetch("/api/stripe-connect/mentor-dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connectId }),
    });

    const data = await response.json();

    if (data.type === "success" && data.url) {
      return {
        type: "success",
        message: "Successfully got dashboard link",
        action: "redirect",
        data: { link: data.url },
      };
    }

    console.error("Failed to get dashboard link:", data.message);
    return {
      type: "error",
      message: data.message || "Failed to get dashboard link",
    };
  } catch (error) {
    console.error("Error fetching dashboard link:", error);
    return {
      type: "error",
      message: "Unable to get your dashboard at this time",
    };
  }
}

async function verifyTutorStatus(uid: string): Promise<DashboardResponse> {
  // Checking if tutor has onboarded
  const onboardingStatus = await hasTutorOnboarded({ uid });
  if (onboardingStatus.type !== "success") {
    console.error(
      "Failed to check onboarding status:",
      onboardingStatus.message
    );
    return {
      type: "error",
      message: "Unable to get your dashboard at this time",
    };
  }

  if (!onboardingStatus.hasOnboarded) {
    const accountId = await getTutorStripeConnectId({ uid });
    if (accountId.type === "success") {
      const connectId = accountId.stripeConnectId;
      const response = await fetch("/api/stripe-connect/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ accountId: connectId }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          type: "success",
          message:
            "Complete your Stripe onboarding to start receiving payments",
          action: "onboard",
          data: {
            link: data.url,
          },
        };
      } else {
        console.error(response);
        return {
          type: "error",
          message: "Unable to get onboarding link at this time",
        };
      }
    } else if (
      accountId.errorType === "no_stripe_account" ||
      accountId.errorType === "no_stripe_id"
    ) {
      //Stripe connect account yet to be created, will create account and take to onboarding
      const creationResponse = await createStripeConnectAccount({ uid });
      if (creationResponse.type === "success") {
        getDashboardLink({ uid });
      } else {
        console.error(
          "error during creation of stripe connect account  :",
          creationResponse
        );
        return {
          type: "error",
          message:
            "error occurred while trying to create connect account for the tutor",
        };
      }
    }
  }

  // Getting Stripe Connect ID for verified tutor
  const connectIdResponse = await getTutorStripeConnectId({ uid });
  if (connectIdResponse.type !== "success") {
    console.error(
      "Failed to get tutor's stripe connect ID:",
      connectIdResponse.message
    );
    return {
      type: "error",
      message: "Unable to get your dashboard at this time",
    };
  }

  if (!connectIdResponse.stripeConnectId) {
    console.error("No Stripe Connect ID found for tutor:", uid);
    return {
      type: "error",
      message: "Unable to get your dashboard at this time",
    };
  }

  // Checking verification status for onboarded tutor
  const verificationStatus = await hasTutorCompletedVerification({ uid });
  if (verificationStatus.type !== "success") {
    console.error(
      "Failed to check verification status:",
      verificationStatus.message
    );
    return {
      type: "error",
      message: "Unable to get your dashboard at this time",
    };
  }

  if (!verificationStatus.hasCompletedVerification) {
    const dashLink = await fetchDashboardLink(
      connectIdResponse.stripeConnectId
    );
    if (dashLink.type === "success") {
      return {
        type: "success",
        message:
          "Complete your Stripe verification requirements to start receiving payments",
        action: "fulfill",
        data: dashLink.data,
      };
    }
    return dashLink;
  }

  // All checks passed, getting dashboard link
  return fetchDashboardLink(connectIdResponse.stripeConnectId);
}

export async function getDashboardLink({
  uid,
}: {
  uid: string;
}): Promise<DashboardResponse> {
  const validationResult = getDashboardLinkSchema.safeParse({ uid });
  if (!validationResult.success) {
    console.error("Input validation failed:", validationResult.error);
    return {
      type: "error",
      message: validationResult.error,
    };
  }

  return verifyTutorStatus(uid);
}

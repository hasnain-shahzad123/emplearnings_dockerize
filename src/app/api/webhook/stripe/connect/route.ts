// Stripe webhook handler for various account and external account events.
// Verifies Stripe webhook signature and processes events like account updates.
// Updates Firebase records for onboarding, verification, and payout statuses.
// Handles errors and logs actions for debugging and auditing purposes.
// Returns a 200 status for handled events or 400 for signature errors.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import updateTutorConnectVerification from "@/firebase/firebase_admin/stripe/connect/updateTutorConnectVerification";
import updateTutorPayoutStatus from "@/firebase/firebase_admin/stripe/connect/updateTutorPayoutErrorStatus";
import updateTutorOnboardingStatus from "@/firebase/firebase_admin/stripe/connect/updateTutorOnboardingStatus";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig || "", webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ message: "Webhook Error" }, { status: 400 });
  }

  switch (event?.type) {
    // Triggered whenever account details change, including requirements status
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      //checking if account has completed onboarding
      //currently due should be empty
      const hasOnboarded = account.requirements?.currently_due?.length === 0;
      if (hasOnboarded) {
        if (account.metadata?.empLearningId) {
          await updateTutorOnboardingStatus({
            uid: account.metadata.empLearningId,
            status: true,
          });
        }
      } else {
        if (account.metadata?.empLearningId) {
          await updateTutorOnboardingStatus({
            uid: account.metadata.empLearningId,
            status: false,
          });
        }
      }
      // Checking if account has fulfilled requirements for verification
      const hasFulfilledRequirements =
        account.requirements?.currently_due?.length === 0 &&
        account.requirements?.pending_verification?.length === 0;

      if (
        hasFulfilledRequirements &&
        account.charges_enabled &&
        account.payouts_enabled
      ) {
        console.log(
          `Tutor with the accountId : ${account.id} is now ready to sell`
        );
        if (account.metadata?.empLearningId) {
          await updateTutorConnectVerification({
            uid: account.metadata.empLearningId,
            status: true,
          });
        }
      } else if (
        !account.charges_enabled ||
        !account.payouts_enabled ||
        !hasFulfilledRequirements
      ) {
        console.log(
          `Account ${account.id} has issues preventing charges/payouts.`
        );
        if (account.metadata?.empLearningId) {
          await updateTutorConnectVerification({
            uid: account.metadata.empLearningId,
            status: false,
          });
        }
      }

      break;
    }
    case "account.external_account.updated": {
      const externalAccount = event.data.object as Stripe.BankAccount;
      const accountId = externalAccount.account as string;
      console.log("event came here : with account", externalAccount);
      // Checking if there was an error with the external account
      if (
        externalAccount.status === "errored" &&
        externalAccount.default_for_currency
      ) {
        console.error(
          `External bank account ${externalAccount.id} has errored.`
        );
        try {
          const account = await stripe.accounts.retrieve(accountId);
          const empLearningId = account.metadata?.empLearningId;

          if (empLearningId) {
            // Updating tutor's payout status to indicate an error in their payouts
            console.log(
              `Updating tutor (${empLearningId}) payout status to errored due to bank account error.`
            );
            await updateTutorPayoutStatus({
              uid: empLearningId,
              hasErrored: true, // indicates an error has occurred in their payout
            });
          }
        } catch (fetchError) {
          console.error(
            `Failed to retrieve account details for account ID: ${accountId}`,
            fetchError
          );
        }
      } else if (
        externalAccount.status === "valid" ||
        externalAccount.status === "new"
      ) {
        // If the external account status is valid, marking the error status as resolved
        console.log(
          `External bank account ${externalAccount.id} has been successfully validated.`
        );
        try {
          const account = await stripe.accounts.retrieve(accountId);
          const empLearningId = account.metadata?.empLearningId;

          if (empLearningId) {
            // Updating tutor's payout status to indicate the error has been resolved
            console.log(
              `Updating tutor (${empLearningId}) payout status to valid after resolving error.`
            );
            await updateTutorPayoutStatus({
              uid: empLearningId,
              hasErrored: false,
            });
          }
        } catch (fetchError) {
          console.error(
            `Failed to retrieve account details for account ID: ${accountId}`,
            fetchError
          );
        }
      }

      break;
    }
    case "account.external_account.created": {
      const externalAccount = event.data.object as Stripe.BankAccount;
      const accountId = externalAccount.account as string;
      console.log("Event received: external account created", externalAccount);

      try {
        const account = await stripe.accounts.retrieve(accountId);
        const empLearningId = account.metadata?.empLearningId;

        if (empLearningId) {
          // Checking the status of the newly created external account ( part of the flow of resolving payout.failed)
          if (
            externalAccount.status === "valid" ||
            externalAccount.status === "new" ||
            externalAccount.status === "verified"
          ) {
            console.log(
              `External bank account ${externalAccount.id} is valid after creation. Updating tutor (${empLearningId}) payout status to valid.`
            );
            await updateTutorPayoutStatus({
              uid: empLearningId,
              hasErrored: false, // Marking as valid after creation
            });
          } else {
            // If the external account has any issues, marking the payout status as errored
            console.log(
              `External bank account ${externalAccount.id} is not valid, updating tutor (${empLearningId}) payout status to errored.`
            );
            await updateTutorPayoutStatus({
              uid: empLearningId,
              hasErrored: true, // Indicating an error has occurred
            });
          }
        }
      } catch (fetchError) {
        console.error(
          `Failed to retrieve account details for account ID: ${accountId}`,
          fetchError
        );
      }
      break;
    }
    default: {
      console.log(`Unhandled event type: ${event.type}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

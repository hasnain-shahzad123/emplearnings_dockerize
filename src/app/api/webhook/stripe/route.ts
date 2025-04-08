import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import addTutorAsCustomerToDB from "@/firebase/firebase_admin/stripe/addTutorAsCustomerToDB";
import getStripePlanType from "../../serverUtilityFunctions/stripeUtilityFunctions/getPlanTypeFromStripe";
import updateTutorsSubscriptionStatus from "@/firebase/firebase_admin/stripe/updateTutor'sSubscriptionStatusInDB";

type Subscription = Stripe.Subscription;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event;

  try {
    if (req.body !== null) {
      event = stripe.webhooks.constructEvent(
        body,
        sig ? sig : "",
        webhookSecret
      );
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ message: "Webhook Error" }, { status: 400 });
  }
  console.log("Received event type:", event?.type);
  switch (event?.type) {
    case "customer.subscription.created": {
      const subscription = event.data.object as Subscription;
      console.log(
        "customer subscription has been created with status : ",
        subscription.status
      );
      const trialEndDate = subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null;
      console.log("Trial End Date:", trialEndDate?.toISOString());

      try {
        // Retrieve customer details
        const customer = (await stripe.customers.retrieve(
          subscription.customer as string
        )) as Stripe.Customer;

        // Determine the plan type based on the product ID
        const getPlanTypeResponse = await getStripePlanType({
          customerId: customer.id,
        });

        if (getPlanTypeResponse.type === "error") {
          return NextResponse.json(
            { message: getPlanTypeResponse.message },
            { status: 400 }
          );
        }

        // Store customer data in Firebase
        const dbResponse = await addTutorAsCustomerToDB({
          uid: customer.metadata.uid,
          customerId: customer.id,
          planType: getPlanTypeResponse.planType as string,
        });

        if (dbResponse.type === "error") {
          console.error(
            "Error adding customer to database:",
            dbResponse.message
          );
        }
      } catch (error) {
        console.error("Error processing customer subscription:", error);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription: Subscription = event.data.object;
      console.log(
        "Customer subscription has been updated with status:",
        subscription.status
      );

      try {
        // Retrieve customer details to get the UID from metadata
        const customer = (await stripe.customers.retrieve(
          subscription.customer as string
        )) as Stripe.Customer;

        await updateTutorsSubscriptionStatus({
          uid: customer.metadata.uid,
          subscriptionStatus: subscription.status,
        });

        console.log(
          "Successfully updated subscription status to:",
          subscription.status
        );
      } catch (error) {
        console.error("Error updating subscription status:", error);
      }

      break;
    }
    case "customer.subscription.deleted": {
      const subscription: Subscription = event.data.object;
      console.log(
        "Customer: ",
        subscription.customer,
        " has ended their subscription ",
        subscription.items.data[0].plan.product
      );
      break;
    }
    case "customer.subscription.trial_will_end": {
      const subscription: Subscription = event.data.object;
      console.log(
        "Customer's trial is about to end, customer id: ",
        subscription.customer,
        "Trial End Date:",
        new Date(subscription.trial_end || 1 * 1000).toISOString()
      );
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Invoice payment succeeded for invoice id:", invoice.id);
      console.log("Customer id:", invoice.customer);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Invoice payment failed for invoice id:", invoice.id);
      console.log("Customer id:", invoice.customer);
      break;
    }
    case "charge.succeeded":
      console.log("Customer has successfully paid the registration fee");
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

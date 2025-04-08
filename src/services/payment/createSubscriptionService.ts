import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";
import z from 'zod'
//initializing stripe promise
//will be used for redirecting to checkout and other public actions
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

//purpose of this function :
//makes  call to api/payment/create-subscription to initialize a checkout session for user and then redirects user to it
//accepts  : planId ("1","2","3") and userEmail ("user@email.com")
//returns  : nothing



//schema for the input data
const createSubscriptionSchema = z.object({
  planId: z.string().min(1,"planId is required"),
  email: z.string().email().min(1,"email is required"),
  uid: z.string().min(1,"uid is required"),
})

//type for the input data
type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>
export async function createSubscriptionService({planId,email,uid}: CreateSubscriptionInput) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_URL+"/api/payment/create-subscription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // user email address
          planId: planId, //id of the plan user wants to subscribe to
          uid: uid, // user id
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      // If response is not ok, throw an error with a message from api
      throw new Error(data.message || "Failed to create checkout session");
    }
    //if ok response
    const { id } = data;
    // Redirect to Stripe Checkout
    if (id) {
      const stripe: Stripe | null = await stripePromise;
      if (stripe !== null) {
        const { error } = await stripe.redirectToCheckout({ sessionId: id });
        if (error) {
          console.error("Stripe Checkout error:", error.message);
        }
        else{
          console.log("Redirecting to checkout");
        }
      }
    } else {
      console.error(
        "Failed to create checkout session: No session ID returned"
      );
    }
  } catch (error) {
    console.error("Error during checkout:", error);
  }
}

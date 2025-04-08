import Stripe from "stripe";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
//initializing stripe with secret key
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-09-30.acacia",
});
export { stripe };

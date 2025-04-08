"use client";
import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";

const StripeConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [buyingCourse, setBuyingCourse] = useState(false);
  const [error, setError] = useState<string>("");
  const [accountId, setAccountId] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const hello = async () => {
      const response = await fetch("/api/stripe-connect/retrieve-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: "acct_1QX5RHRi6bNCwh83",
        }),
      });
      const data = await response.json();
      console.log(data);
    };
    hello();
  }, []);

  async function buyCourse() {
    const user = auth.currentUser;
    setBuyingCourse(true);
    setError("");
    if (user && user.uid) {
      try {
        const courseId = "course123";
        const tutorId = user.uid;
        const tutorStripeAccountId = "acct_1QX6DrRW2lKlBibE";
        const price = 5000;
        const successUrl = `${window.location.origin}/stripe-connect-test?status=success`;
        const cancelUrl = `${window.location.origin}/stripe-connect-test?status=failure`;

        const response = await fetch("/api/stripe-connect/buy-course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            tutorId,
            tutorStripeAccountId,
            price,
            successUrl,
            cancelUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to initiate checkout session");
        }

        const { url } = await response.json();
        if (url) {
          setRedirecting(true);
          window.location.href = url;
        } else {
          throw new Error("Checkout session URL is missing");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
        console.error(e);
      } finally {
        setBuyingCourse(false);
      }
    } else {
      setError("No tutor Id provided");
    }
  }

  // Function to create the Stripe account
  async function createAccount(userEmail: string, userId: string) {
    const response = await fetch("/api/stripe-connect/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailAddress: userEmail,
        uid: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create Stripe account");
    }

    const accountData = await response.json();
    return accountData.accountId; // Return the account ID
  }

  // Function to handle the onboarding process
  async function onboardAccount(accountId: string) {
    const response = await fetch("/api/stripe-connect/onboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId: accountId }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate account link");
    }

    const linkData = await response.json();
    return linkData.url;
  }
  // The main function to handle account creation and onboarding
  async function handleAccountCreation() {
    const user = auth.currentUser;

    if (user && user.email) {
      setLoading(true);
      setError("");

      try {
        // Creating the account
        const accountId = await createAccount(user.email, user.uid);
        setAccountId(accountId); // Set the account ID in state

        // Performing the onboarding step
        const onboardingUrl = await onboardAccount(accountId);

        // Redirect the user to complete the onboarding
        setRedirecting(true);
        window.location.href = onboardingUrl;
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Email Address of tutor not found");
    }
  }

  // Function to redirect user to Stripe Express Dashboard
  async function redirectToExpressDashboard() {
    if (true) {
      try {
        const response = await fetch("/api/stripe-connect/mentor-dashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId: "acct_1QX6DrRW2lKlBibE" }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url; // Redirecting to Express Dashboard
        }
      } catch (e) {
        setError("Failed to redirect to dashboard");
        console.error(e);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Course Platform Setup
        </h1>

        {redirecting && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-4 text-center">
            Redirecting you to complete your process...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {accountId && !redirecting && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-4 text-center">
            Stripe Account Created: {accountId}
          </div>
        )}

        <div className="space-y-4">
          {/* Tutor Onboarding Button */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <button
              onClick={handleAccountCreation}
              disabled={loading || redirecting}
              className={`w-full py-3 rounded-lg transition duration-300 ease-in-out mb-2 ${
                loading || redirecting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {redirecting
                ? "Redirecting..."
                : loading
                ? "Creating Account..."
                : "Tutor Onboarding"}
            </button>
            <p className="text-sm text-blue-800 text-center">
              Complete your profile and payment details before selling courses.
              Verify your identity, link payment information, and set up your
              instructor profile to start earning.
            </p>
          </div>

          {/* View Dashboard Button */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <button
              onClick={redirectToExpressDashboard}
              className={`w-full py-3 rounded-lg transition duration-300 ease-in-out mb-2 ${
                !accountId
                  ? "bg-yellow-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              View Dashboard
            </button>
            <p className="text-sm text-yellow-800 text-center">
              Access your Stripe Express Dashboard to view earnings, manage
              payouts, and track your progress.
            </p>
          </div>

          {/* Buy Course Button */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <button
              onClick={buyCourse}
              disabled={buyingCourse || redirecting}
              className={`w-full py-3 rounded-lg transition duration-300 ease-in-out mb-2 ${
                buyingCourse || redirecting
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {redirecting
                ? "Redirecting..."
                : buyingCourse
                ? "Processing Payment..."
                : "Buy Course"}
            </button>
            <p className="text-sm text-green-800 text-center">
              Students can browse and purchase courses. Select your desired
              course, complete the payment, and gain immediate access to
              learning materials.
            </p>
          </div>

          {/* View Receipt Button */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <button className="w-full py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition duration-300 ease-in-out mb-2">
              View Receipt
            </button>
            <p className="text-sm text-purple-800 text-center">
              Access your transaction history and detailed receipts. View past
              purchases, course payments, and financial transactions on the
              platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeConnectPage;

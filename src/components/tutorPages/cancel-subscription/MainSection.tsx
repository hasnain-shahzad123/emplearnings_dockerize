"use client";
import React from "react";
import BackBtn from "../personel_info/Commonlayout/BackBtn";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { useTutor } from "@/contexts/TutorContext";
import { cancelSubscriptionService } from "@/services/payment/cancelSubscriptionService";
interface MainSectionProps {
  subscription_status: string;
}
const handleCancelSubscription = async ({ uid }: { uid: string }) => {
  const result = await cancelSubscriptionService({ uid });
  if (result?.type === "success") {
    alert("Subscription cancelled successfully!");
  } else {
    alert(result?.message);
  }
};
const MainSection = ({ subscription_status }: MainSectionProps) => {
  const { tutor } = useTutor();
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-start mb-6">
        <BackBtn />
      </div>
      {subscription_status === "inactive" || subscription_status === "" ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-empoweredFlag">
            You haven't bought any subscription yet.
          </p>
          <p className="text-sm mt-10 text-gray-600">
            Subscribe to one of our plans to get access to all the features.{" "}
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={tutor?.username}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={tutor?.email}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="subscription"
                className="block text-sm font-medium text-gray-700"
              >
                Subscription
              </label>
              <input
                type="text"
                id="subscription"
                name="subscription"
                value={subscription_status}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700"
              >
                Reason to Cancel
              </label>
              <select
                id="reason"
                name="reason"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a reason</option>
                <option value="too_expensive">Too Expensive</option>
                <option value="not_useful">Not Useful</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="suggestions"
                className="block text-sm font-medium text-gray-700"
              >
                Any suggestions
              </label>
              <textarea
                id="suggestions"
                name="suggestions"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="text-right">
              <CustomButton
                onclickEvent={() =>
                  handleCancelSubscription({ uid: tutor?.uid as string })
                }
                text="Confirm"
                className="bg-[#4A148C] md:mt-0 mt-5  text-white font-medium rounded-full text-[16px] px-8 py-2.5 text-center"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MainSection;

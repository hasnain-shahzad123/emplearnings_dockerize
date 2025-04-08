"use client";
import Image from "next/image";
import { plan } from "@/assets";
import Link from "next/link";

import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { useTutor } from "@/contexts/TutorContext";

const SubscriptionSettings = () => {
  const { tutor } = useTutor();
  console.log(tutor);
  const uid = tutor?.uid;
  const plans = [
    {
      id: 1,
      name: "standard",
      price: "$85/Month",
      description: "For those seeking a strong online presence",
    },
    {
      id: 2,
      name: "pro",
      price: "$65/Month",
      description: "For growing businesses ready to scale",
    },
    {
      id: 3,
      name: "premium",
      price: "$50/Month",
      description: "For those looking to diversify and maximize revenue",
    },
    {
      id: 4,
      name: "free",
      price: "$0/Month",
      description:
        "A completely free one month access to some of our most popular features",
    },
  ];

  return (
    <div className="max-w-5xl">
      <div className="max-w-5xl bg-[#4A148C] hidden md:block text-white font-semibold text-xl rounded-xl px-5 py-3 custom-shadow">
        Subscription Plan
      </div>
      <div className="p-4">
        <div className="flex md:flex-row flex-col justify-between items-center">
          <div className="flex flex-row justify-center items-center">
            <div>
              <Image src={plan} alt="plan" width={50} height={50} />
            </div>
            <div className="ml-2">
              <h2 className="text-lg text-[#4A148C] font-semibold">
                {tutor?.planType + " Plan"}
              </h2>
              <p className="text-gray-500 text-[14px]">
                {
                  plans.find((plan) => plan.name === tutor?.planType)
                    ?.description
                }
              </p>
            </div>
          </div>
          <div>
            <p className="text-xl md:mt-0 mt-5 font-semibold text-[#4A148C]">
              {plans.find((plan) => plan.name === tutor?.planType)?.price}
            </p>
          </div>
        </div>

        <div className="flex flex-col   md:flex-row justify-between items-center my-5">
          {tutor?.planType !== "free" && (
            <Link href={`/mentor-dashboard/${uid}/cancel-subscription`}>
              <CustomButton
                text="Cancel Subscription"
                className="bg-[#4A148C] md:mt-0 mt-5  text-white font-medium rounded-full text-sm px-5 py-2.5 text-center"
              />
            </Link>
          )}
          <Link href={`/mentor-dashboard/${uid}/upgrade-plan`}>
            <CustomButton
              text="Upgrade Your Plan"
              className="bg-[#4A148C] md:mt-0 mt-5  text-white font-medium rounded-full text-sm px-5 py-2.5 text-center"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;

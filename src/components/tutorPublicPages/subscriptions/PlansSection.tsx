"use client";
import React, { useState, useEffect } from "react";
import ChoosePlanDesktop from "./ChoosePlanDesktop";
import ChoosePlanMobile from "./ChoosePlanMobile";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { createSubscriptionService } from "@/services/payment/createSubscriptionService";
import BackBtn from "@/components/tutorPages/personel_info/Commonlayout/BackBtn";

const PlansSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1100);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOnChoose = async (planId: string) => {
    // Redirect user to login page if not signed in
    if (auth.currentUser === null) {
      router.push(`/login?planId=${planId}`);
    }
    // If signed in then continue to checkout
    else if (auth.currentUser.email) {
      await createSubscriptionService({
        planId,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
      });
    }
  };

  return (
    <>
    <div className="flex justify-start ml-5 mt-5">
      <BackBtn />
    </div>
      {isMobile ? (
        <ChoosePlanMobile onChoosePlan={handleOnChoose} />
      ) : (
        <ChoosePlanDesktop onChoosePlan={handleOnChoose} />
      )}
    </>
  );
};

export default PlansSection;

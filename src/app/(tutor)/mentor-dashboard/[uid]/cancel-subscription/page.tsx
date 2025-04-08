"use client";
import MainSection from "@/components/tutorPages/cancel-subscription/MainSection";
import { useTutor } from "@/contexts/TutorContext";
const CancelSubscription = () => {
  const { tutor } = useTutor();
  let subscription_status = tutor?.subscription_status;
  if (subscription_status === undefined) {
    subscription_status = "inactive";
  }
  return (
    <>
      <MainSection subscription_status={subscription_status} />
    </>
  );
};
export default CancelSubscription;

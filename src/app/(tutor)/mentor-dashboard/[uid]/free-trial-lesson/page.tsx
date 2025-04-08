"use client"
import HeroSection from "@/components/tutorPages/freeTrialLessons/HeroSection";
import { useParams } from "next/navigation";

const FreeTrialLessonPage = () => {
  const { uid } = useParams<{ uid: string }>();
  return (
    <>
      <HeroSection tutorId={uid} />
    </>
  );
};
export default FreeTrialLessonPage;

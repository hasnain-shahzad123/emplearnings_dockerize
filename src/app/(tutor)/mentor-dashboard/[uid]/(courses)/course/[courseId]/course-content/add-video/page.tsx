"use client";
import HeroSection from "@/components/tutorPages/courses_info/addVideo/HeroSection";
import AddVideoSection from "@/components/tutorPages/courses_info/addVideo/AddVideoSection";
import { useParams } from "next/navigation";
const AddVideo = () => {
  const { courseId, uid } = useParams<{ courseId: string; uid: string }>();
  return (
    <>
      <HeroSection />
      <AddVideoSection tutorId={uid} courseId={courseId} />
    </>
  );
};
export default AddVideo;

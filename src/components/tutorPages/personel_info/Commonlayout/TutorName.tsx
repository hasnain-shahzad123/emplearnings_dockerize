"use client";
import { useTutor } from "@/contexts/TutorContext";

const TutorName = () => {
  const { tutor } = useTutor();
  return (
    <div className="max-w-5xl mx-auto my-4">
      <h1 className="font-semibold text-xl md:text-3xl text-[#4A148C] my-3">
        Welcome Back {tutor?.username}
      </h1>
      <h1 className="md:text-xl">Build your Profile</h1>
    </div>
  );
};
export default TutorName;

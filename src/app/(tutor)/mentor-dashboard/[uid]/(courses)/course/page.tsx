"use client";
import React from "react";
import HeroSection from "@/components/tutorPages/courses_info/addCourse/HeroSection";
import AddFiles from "@/components/tutorPages/courses_info/addCourse/AddFiles";
import { useParams } from "next/navigation";
const AddCourse = () => {
  const { uid } = useParams<{ uid: string }>();
  if (!uid) {
    return <p>Error: No course UID found in the URL.</p>;
  }
  return (
    <div className="add-course-page font-poppins">
      <HeroSection />
      <AddFiles uid={uid} />
    </div>
  );
};
export default AddCourse;

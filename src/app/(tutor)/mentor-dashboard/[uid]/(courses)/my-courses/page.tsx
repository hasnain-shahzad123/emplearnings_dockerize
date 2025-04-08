"use client";
import HeroSection from "@/components/tutorPages/courses_info/myCourses/HeroSection";
import Courses from "@/components/tutorPages/courses_info/myCourses/Courses";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchCoursesOfTutor from "@/firebase/tutor/courses/readers/fetchCoursesOfTutor";
import { Course } from "@/types";
import CoursesSkeleton from "@/components/tutorPages/courses_info/myCourses/CoursesSkeleton";

const MyCourses = () => {
  const { uid } = useParams<{ uid: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchCoursesOfTutor({ tutorId: uid });
      if (response.type === "success") {
        setCourses(response.courses ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, [uid]);
  useEffect(() => {
    fetchCourses();
  }, [uid, fetchCourses]);

  return (
    <>
      <HeroSection />
      {loading ? (
        <CoursesSkeleton />
      ) : (
        <Courses refreshCourses={fetchCourses} courses={courses} />
      )}
    </>
  );
};

export default MyCourses;

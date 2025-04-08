"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HeroSection from "@/components/tutorPages/courses_info/courseContent/HeroSection";
import ContentSection from "@/components/tutorPages/courses_info/courseContent/ContentSection";
import ReviewsSection from "@/components/tutorPages/courses_info/courseContent/ReviewsSection";
import fetchCourseData from "@/firebase/tutor/courses/readers/fetchCourseData";
import fetchCourseVideosData from "@/firebase/tutor/courses/readers/fetchCourseVideosData";
import { Course, VideoData } from "@/types";
import Spinner from "@/components/shared/spinner/Spinner";

interface CourseState {
  course: Course | null;
  videosData: VideoData[];
  isLoading: boolean;
  error: string | null;
}

const CourseLoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hero Section Skeleton */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="w-full md:w-[60%] animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-full w-40"></div>
          </div>
          <div className="w-full md:w-[35%] relative">
            <div className="pt-[56.25%] bg-gray-100 rounded-lg relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="mt-10 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-16 bg-gray-200 rounded-md mb-2 shadow-md"
              ></div>
            ))}
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mt-10">
          <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-6 animate-pulse"></div>
          <div className="space-y-6 animate-pulse">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-100 space-y-4"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseContent = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [state, setState] = useState<CourseState>({
    course: null,
    videosData: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCourseContent = async () => {
      if (!courseId) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const [courseResponse, videosResponse] = await Promise.all([
          fetchCourseData({ courseId }),
          fetchCourseVideosData({ courseId }),
        ]);

        if (
          courseResponse.type === "success" &&
          videosResponse.type === "success"
        ) {
          setState({
            course: courseResponse.course || null,
            videosData: videosResponse.videos || [],
            isLoading: false,
            error: null,
          });
          return;
        }

        const errorMessage =
          courseResponse.type === "error"
            ? courseResponse.message
            : videosResponse.type === "error"
              ? videosResponse.message
              : "Failed to fetch data";

        setState({
          course: null,
          videosData: [],
          isLoading: false,
          error: errorMessage.toString(),
        });
      } catch (error) {
        setState({
          course: null,
          videosData: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    };

    fetchCourseContent();
  }, [courseId]);

  if (state.isLoading) {
    return <CourseLoadingSkeleton />;
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 text-red-500 text-center">
          <p className="text-lg font-semibold">Error</p>
          <p>{state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection
        course={state.course as Course}
      />
      <ContentSection
        courseId={courseId}
        courseTags={state.course?.tags || []}
        videosData={state.videosData}
        videosSequence={state.course?.videoSequence || []}
        course_hours={state.course?.total_hours || 0}
        course_lectures={state.course?.total_hours || 0}

      />
      <ReviewsSection courseId={courseId} />
    </>
  );
};

export default CourseContent;

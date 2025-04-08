import React, { useEffect } from "react";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { CustomNextArrow, CustomPrevArrow } from "./Reviews";
import { style } from "./CoursesHub";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import fetchCoursesOfTutor from "@/firebase/tutor/courses/readers/fetchCoursesOfTutor";
import { Course } from "@/types";
import fetchCourseReviews from "@/firebase/tutor/courses/readers/fetchCourseReviews";

interface CourseWithReviews extends Course {
  reviews?: any[];
  averageRating?: number;
  reviewCount?: number;
}

const CourseHubMobile = ({ uid }: { uid: string }) => {
  const [courses, setCourses] = useState<CourseWithReviews[]>([]);
  useEffect(() => {
    const getCourses = async () => {
      const response = await fetchCoursesOfTutor({ tutorId: uid });
      if (response.type === "success") {
        if (response.courses && response.courses.length > 0) {
          const coursesWithReviews = await Promise.all(
            response.courses.map(async (course) => {
              const reviewsResponse = await fetchCourseReviews({
                courseId: course.courseId,
              });
              const reviews =
                reviewsResponse.type === "success"
                  ? reviewsResponse.reviews
                  : [];
              const averageRating =
                reviews && reviews.length > 0
                  ? reviews.reduce(
                      (acc, rev) => acc + (rev.number_of_stars || 0),
                      0
                    ) / reviews.length
                  : 0;

              return {
                ...course,
                reviews,
                averageRating,
                reviewCount: reviews?.length || 0,
              };
            })
          );
          setCourses(
            coursesWithReviews.map((course) => ({
              ...course,
              reviews: course.reviews || [],
            }))
          );
        } else {
          setCourses([]);
        }
      }
    };

    getCourses();
  }, [uid]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? courses.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === courses.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div className="p-4">
      <h1 className="font-semibold text-xl text-center text-[#4A148C] my-5">
        My Course Hub
      </h1>
      <h1 className="font-semibold text-xl  text-[#727272] my-5">
        Courses from this mentor
      </h1>
      <div
        id="controls-carousel"
        className="relative w-full sm:hidden"
        data-carousel="slide"
      >
        <div className="relative h-[100%] overflow-hidden rounded-lg">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`px-4 text-left duration-700 ease-in-out ${
                index === activeIndex ? "block" : "hidden"
              }`}
              data-carousel-item
            >
              <div className="bg-white max-w-sm mx-auto text-left rounded-lg custom-shadow p-4 flex flex-col items-center gap-5 justify-between">
                <div className="mb-4">
                  <Image
                    src={course.title_img_url}
                    alt="Course Image"
                    width={300}
                    height={200}
                    className="rounded-lg h-48 w-52"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{course.title}</h2>
                    <span className="text-lg font-bold text-purple-600">
                      {course.price}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{course.description}</p>
                  <div className="flex items-center mb-4">
                    {Array.from(
                      { length: Math.floor(course.averageRating || 0) },
                      (_, i) => (
                        <span key={i}>
                          <FaStar style={style} />
                        </span>
                      )
                    )}
                    <span className="text-gray-500 text-sm ml-2">
                      {course.reviewCount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.total_hours} hours · {course.total_lectures || 0}{" "}
                    lectures ·{course.levels || "All Levels"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full pr-4 cursor-pointer group focus:outline-none text-lg text-[#4A148C]"
          onClick={handlePrev}
          data-carousel-prev
        >
          &#10094;
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full pl-4 cursor-pointer group focus:outline-none text-lg text-[#4A148C]"
          onClick={handleNext}
          data-carousel-next
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default CourseHubMobile;

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import fetchCoursesOfTutor from "@/firebase/tutor/courses/readers/fetchCoursesOfTutor";
import { Course } from "@/types";
import fetchCourseReviews from "@/firebase/tutor/courses/readers/fetchCourseReviews";

export const style = {
  color: "yellow",
};
interface CourseWithReviews extends Course {
  reviews?: any[];
  averageRating?: number;
  reviewCount?: number;
}

const CoursesHub = ({ uid }: { uid: string }) => {
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

  return courses.length > 0 ? (
    <div className="p-4">
      <h1 className="font-bold text-2xl mb-[6%] text-center text-[#4A148C] my-5">
        My Course Hub
      </h1>
      <h1 className="font-semibold text-xl text-[#727272] my-5">
        My Added Courses
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-lg custom-shadow p-6 flex flex-row items-start gap-8 justify-between min-h-[250px]"
          >
            <div className="flex-1 max-w-[60%]">
              <div className="flex flex-col mb-4">
                <h2 className="text-2xl font-semibold text-[#4A148C] mb-2">
                  {course.title}
                </h2>
                <span className="text-lg font-bold text-purple-600 mb-3">
                  {"$" + course.price}
                </span>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {course.description}
                </p>
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
                    ({course.reviewCount} reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {course.total_hours || 0} hours · {course.total_lectures || 0}{" "}
                  lectures · {course.levels || "All Levels"}
                </div>
              </div>
            </div>
            <div className="w-[300px] h-[200px] relative">
              <Image
                src={course.title_img_url}
                alt="Course Image"
                height={3000}
                width={3000}
                className="rounded-lg h-full w-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="custom-shadow px-8 py-10 rounded-xl my-3 bg-white">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#4A148C] mb-3">
          Course Hub
        </h2>
        <p className="text-gray-600">
          No courses available from this mentor yet
        </p>
      </div>
    </div>
  );
};

export default CoursesHub;

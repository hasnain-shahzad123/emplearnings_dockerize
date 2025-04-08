"use client";
import React, { useState } from "react";
import Image from "next/image";
import { five_stars, play_icon } from "@/assets/index";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import EditCourse from "@/components/tutorPages/courses_info/myCourses/editVideoModal/EditCourse";
import { usePathname } from "next/navigation";
import { Course } from "@/types";

const Courses = ({
  courses,
  refreshCourses,
}: {
  courses: Course[];
  refreshCourses: () => void;
}) => {
  // Ensure courses are unique
  const uniqueCourses = Array.from(
    new Map(courses.map((course) => [course.courseId, course])).values()
  );

  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditBtnClicked, setIsEditBtn] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(0);

  const handleEditBtnClick = (idx: number) => {
    setEditIndex(idx);
    if (isEditBtnClicked) document.body.style.overflow = "auto";
    else document.body.style.overflow = "hidden";
    setIsEditBtn(!isEditBtnClicked);
  };

  const filteredCourses = uniqueCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const finishEditingCourse = () => {
    setIsEditBtn(false);
    document.body.style.overflow = "auto";
    refreshCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Add Course Button */}
      <div className="flex justify-center md:justify-end py-6">
        <Link
          href={
            pathname.includes("/my-courses")
              ? pathname.replace("/my-courses", "/course")
              : "/add-course"
          }
        >
          <CustomButton
            text="Add New Course"
            className="bg-empoweredFlag px-4 py-2 text-sm sm:px-6 sm:py-3 rounded-full text-white"
          />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6">
        <div className="w-full md:w-[60%] relative">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-empoweredFlag text-lg" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search for your courses"
            className="border border-gray-300 rounded-full w-full pl-10 py-2 sm:py-3 text-sm sm:text-base"
          />
        </div>
        <h2 className="font-semibold text-xl sm:text-2xl text-empoweredFlag">
          {filteredCourses.length} Courses total
        </h2>
      </div>

      {/* Render Courses */}
      {filteredCourses.map((course, index) => (
        <div
          key={course.courseId}
          className="flex flex-col md:flex-row items-start gap-6 p-6 border-b"
        >
          {/* Course Details */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg sm:text-2xl font-semibold">
                {course.title} - ${course.price}
              </h1>
              <div className="hover:bg-[#c2a8e3] p-2 rounded-full">
                <FiEdit
                  onClick={() => handleEditBtnClick(index)}
                  className="text-[#4A148C] cursor-pointer h-8 w-8"
                />
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-600">
              {course.description}
            </p>

            <div className="flex items-center gap-2">
              <Image
                src={five_stars}
                alt="five_stars"
                height={20}
                width={100}
                className="h-5 w-20"
              />
              <p className="text-sm font-semibold">
                {course.rating | 0} course rating
              </p>
            </div>

            <p className="text-sm sm:text-base font-semibold text-gray-700">
              <span className="text-empoweredFlag">
                {course.total_lectures || 0}
              </span>{" "}
              Lectures
            </p>

            <p className="font-semibold text-sm sm:text-base">
              level: {course.levels}
            </p>

            <div className="text-empoweredFlag font-semibold text-sm">
              {course.tags.map((tag, i) => `#${tag} `)}
            </div>

            <div className="mt-4">
              <Link
                href={`${pathname.replace("my-courses", "course")}/${
                  course.courseId
                }/course-content/`}
                className="bg-empoweredFlag px-6 py-2 transition-all duration-300 ease-in-out rounded-full border-[1px] border-black text-white hover:bg-white hover:border-[2px] hover:text-black text-md"
              >
                View Course
              </Link>
            </div>
          </div>

          {/* Course Image & Video */}
          <div className="relative w-full md:w-1/3 group overflow-hidden">
            <Image
              src={course.title_img_url}
              alt="Course Image"
              height={2250}
              width={2400}
              className="w-full h-[250px] object-cover rounded-lg"
            />

            {/* Play Icon */}
            <div className="absolute inset-0 flex justify-center items-center group-hover:opacity-0 transition-opacity duration-300">
              <Image
                src={play_icon.src}
                alt="Play Icon"
                height={50}
                width={50}
                className="h-12 w-12 sm:h-16 sm:w-16 cursor-pointer"
              />
            </div>

            {/* Video */}
            <video
              controls
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              autoPlay
              muted
              loop
              key={course.intro_video_url}
            >
              <source src={course.intro_video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ))}

      {/* Edit Course Modal */}
      {isEditBtnClicked && (
        <div className="fixed inset-0 left-0 w-full h-full bg-black bg-opacity-50 flex">
          <EditCourse
            toggleModal={handleEditBtnClick}
            courseData={uniqueCourses[editIndex]}
            finishEditingCourse={finishEditingCourse}
          />
        </div>
      )}
    </div>
  );
};

export default Courses;

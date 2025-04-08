import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  HeroSection_image,
  blue_calender,
  white_calender,
  red_calender,
  giveReview,
  giveReview_white,
  newSchedule,
  sendNote,
  green_calender,
  sendNote_white,
  viewSchedule_white,
} from "@/assets";
import { TutorStudentDocumentData } from "@/types";
import ViewSchedule from "./ViewSchedule";
import GiveReviewSection from "./GiveReviewSection";
import category from "@/app/(tutor)/mentor-dashboard/[uid]/category/page";
import Spinner from "@/components/shared/spinner/Spinner";
const formatDate = (timestamp: any) => {
  if (!timestamp) return "Not scheduled";

  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);

  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const CardsSection = ({
  cardKey,
  student,
}: {
  cardKey: number;
  student: TutorStudentDocumentData;
}) => {
  const [isHovered, setIsHovered] = useState<number>(0);
  const [viewScheduleClicked, setViewScheduleClicked] =
    useState<boolean>(false);
    const [isReviewBtnClicked, setIsReviewBtnClicked] = useState<boolean>(false);

  const handleScheduleModal = () => {
    setViewScheduleClicked(!viewScheduleClicked);
    if (viewScheduleClicked) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  const handleToggleReviewModal = () => {
    setIsReviewBtnClicked(!isReviewBtnClicked);
    if (isReviewBtnClicked) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }

  return (
    <>
    
      <div className="px-4 pt-4 bg-white rounded-xl shadow-lg border-[#D9D9D9]  border-b-[2px] pb-10">
        <div
          className={`flex flex-col lg:flex-row  items-center justify-center lg:justify-evenly
          
          p-4 w-full max-w-6xl rounded-lg mx-auto gap-8 transition-colors duration-300`}
        >
          {/* Image Section */}
          <div className="flex-shrink-0 flex items-center flex-col">
            <Image
              src={student.profilePhotoURL || HeroSection_image.src}
              alt="hero section image"
              width={300}
              height={300}
              className="h-40 w-40 sm:h-55 sm:w-55   border-[2px] border-empoweredFlag rounded-full object-cover"
            />
            <div className="mt-5 text-white xs:text-base text-xs bg-gradient-to-r from-red-500 to-blue-500 px-9 py-2 rounded-full">
              {/* here commment for the tutoe will come dynamically */}
              {student.student_status}
            </div>
          </div>

          {/* Details Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold">
              {student.name}
            </h1>
            {student.categories.map((category, index) => {
              return (
                <div key={index}>
                  <h2
                    className="text-sm  sm:text-lg lg:text-2xl text-[#4A148C] font-semibold my-2"
                    key={index}
                  >
                    {category.sup_category}
                  </h2>
                  <h2 className="text-sm sm:text-lg text-[#666666] lg:text-xl my-2">
                    {category.category_name}
                  </h2>
                  <h2 className="text-sm sm:text-lg text-[#666666] lg:text-xl my-2">
                    {category.sub_category}
                  </h2>
                </div>
              );
            })}

            <div className="flex items-center gap-3 text-xs xs:text-lg">
              <h2>
                Completed Lessons:{" "}
                <span className="ml-2 font-semibold text-empoweredFlag">
                  {student.completed_lessons}
                </span>
              </h2>
              <h2 className="">
                Pending Lessons:{" "}
                <span className="ml-2 font-semibold text-empoweredFlag">
                  {student.pending_lessons.toString()}
                </span>
              </h2>
            </div>

            <div className="mt-3 flex text-xs xs:text-base flex-col space-y-4">
              <div className="flex items-center gap-3">
                <h3>Enrolled On:</h3>
                <Image
                  src={red_calender.src}
                  alt="calendar"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <h1>{formatDate(student.enrolled_on)}</h1>
              </div>

              <div className="flex items-center gap-3">
                <h3>Last Session:</h3>
                {"  "}
                <Image
                  src={green_calender.src}
                  alt="calendar"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <h1>{formatDate(student.previous_lesson)}</h1>
              </div>

              <div className="flex items-center gap-3">
                <h3>Next Session:</h3>
                <Image
                  src={blue_calender.src}
                  alt="calendar"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <h1>{formatDate(student.next_lesson)}</h1>
              </div>
            </div>
          </div>
          {/* Action & Session Info Section */}
          <div>
            <div className="flex flex-col text-xs xs:text-base  lg:justify-start">
              <button
                onClick={handleScheduleModal}
                className="border-[2px] border-empoweredFlag flex items-center gap-3 bg-empoweredFlag  hover:bg-white hover:text-black text-white font-semibold px-8 lg:px-[45px] py-3 rounded-full"
                onMouseEnter={() => setIsHovered(3)}
                onMouseLeave={() => setIsHovered(0)}
              >
                <Image
                  src={
                    isHovered === 3 ? viewSchedule_white.src : newSchedule.src
                  }
                  alt="give review"
                  height={30}
                  width={30}
                  className="h-6 w-6"
                />
                View Lessons
              </button>
            </div>
          </div>
        </div>

        {viewScheduleClicked && (
          <div className="inset-0 fixed bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white h-[90vh] custom-scrollbar pb-8 overflow-auto w-[100%] mx-auto rounded-lg">
              <ViewSchedule
                onCloseModal={handleScheduleModal}
                student={student}
              />
            </div>
          </div>
        )}
        {isReviewBtnClicked && (
          <div className="inset-0 fixed bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white min-h-[500px] w-[80%] mx-auto rounded-lg">
              <GiveReviewSection onCloseModal={handleToggleReviewModal} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CardsSection;

import { video_cover } from "@/assets";
import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { TutorDocumentDataType } from "@/types";
const cardDta = {
  video: video_cover,
  tutorRating: 4.8,
  totalLessons: 2001,
  price: 50,
  activeStudents: 20,
  reviewCount: 2001,
};

const style = {
  color: "yellow",
};

const StaticCard = ({ tutor }: { tutor: TutorDocumentDataType }) => {
  return (
    <div>
      <div className="rounded-xl">
        <Image src={video_cover} alt="Video Cover" height={230} width={370} />
      </div>
      <div className="flex flex-row justify-between gap-1 xl:gap-3 items-start my-3">
        <div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div>
              <FaStar style={style} />
            </div>
            <div className="text-[12px] xl:text-lg font-semibold">
              {tutor.rating}
            </div>
          </div>
          <div>
            <p className="text-[#666666] text-[13px]">
              {tutor.total_reviews} Reviews
            </p>
          </div>
        </div>
        <div>
          <div className="text-[12px] xl:text-lg font-semibold">
            <h1>{tutor.completed_lessons}</h1>
          </div>
          <div>
            <p className="text-[#666666] text-[13px]">lessons</p>
          </div>
        </div>
        <div>
          <div className="text-[12px] xl:text-lg font-semibold">
            <h1> US ${tutor.per_lesson_rate}</h1>
          </div>
          <div>
            <p className="text-[#666666] text-[13px]">50-min lessons</p>
          </div>
        </div>
        <div>
          <div className="text-[12px] xl:text-lg font-semibold">
            <h1>{tutor.active_students}</h1>
          </div>
          <div>
            <p className="text-[#666666] text-[13px]">active-students</p>
          </div>
        </div>
      </div>
      <div className="">
        <CustomButton
          className="text-white w-full xl:px-10 px-5 py-3 text-[14px] xl:text-[16px] bg-[#4A148C] rounded-xl text-center"
          text="Book 50 - min lesson"
        />
      </div>
      <div className="">
        <CustomButton
          className="text-white my-2 w-full xl:px-10 px-5 py-3 text-[14px] xl:text-[16px] bg-[#4A148C] rounded-xl text-center"
          text="Book 25 - min free trial lesson"
        />
      </div>
      <div className="">
        <CustomButton
          className="text-white w-full xl:px-10 px-5 py-3 text-[14px] xl:text-[16px] bg-[#4A148C] rounded-xl text-center"
          text="Bookmark this Tutor"
        />
      </div>
      <div className="">
        <CustomButton
          className="text-white my-2 w-full xl:px-10 px-5 py-3 text-[14px] xl:text-[16px] bg-[#4A148C] rounded-xl text-center"
          text="My Courses"
        />
      </div>
      <h1 className="font-semibold text-[16px] text-[#4A148C]">
        Popular Tutor
      </h1>
      <p className="text-sm text-[#666666]">
        Tutor is having many lessons bookings
      </p>
    </div>
  );
};

export default StaticCard;

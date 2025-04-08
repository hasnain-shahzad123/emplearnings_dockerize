import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  bio,
  education,
  services,
  pricing,
  class_scheduling,
  bio_white,
  education_white,
  category_white,
  class_scheduling_white,
  pricing_white,
} from "@/assets";
import { AppWrapper } from "./context/LayoutContext";
import { backBtn } from "@/assets";
import BackBtn from "@/components/tutorPages/personel_info/Commonlayout/BackBtn";
import BottomSection from "@/components/tutorPages/personel_info/Commonlayout/BottomSection";
import TutorName from "@/components/tutorPages/personel_info/Commonlayout/TutorName";
import ActiveLink from "@/components/tutorPages/personel_info/Commonlayout/ActiveLink";

interface TutorPersonalInfoLayoutProps {
  children: React.ReactNode;
  params: { uid: string };
}

export default function TutorPersonalInfoLayout({
  children,
  params,
}: TutorPersonalInfoLayoutProps) {
  const handleSetActivePath = (path: string) => {
    console.log(path);
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-3">
      <TutorName />
      <div className="custom-shadow rounded-xl px-5 py-3 pb-10">
        <div className="flex pl-5 flex-row items-center justify-start gap-7">
          <BackBtn />
          <div>
            <h1 className="font-semibold text-xl md:text-3xl text-[#4A148C] my-3">
              Build your Profile
            </h1>
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex flex-col md:flex-row justify-center w-[90%] mx-auto md:w-auto md:items-start gap-5">
          <div className="flex md:flex-col items-center justify-center gap-3 sm:gap-7 custom-shadow px-3 pt-3 pb-5 rounded-xl">
            <ActiveLink
              href={`/mentor-dashboard/${params.uid}/bio`}
              src={bio}
              src2={bio_white}
              alt="Bio"
            />
            <ActiveLink
              href={`/mentor-dashboard/${params.uid}/education`}
              src={education}
              src2={education_white}
              alt="Education"
            />
            <ActiveLink
              href={`/mentor-dashboard/${params.uid}/categories`}
             
              src={services}
              src2={category_white}
              alt="Services"
            />
            <ActiveLink
              href={`/mentor-dashboard/${params.uid}/pricing`}
             
              src={pricing}
              src2={pricing_white}
              alt="Pricing"
            />
            <ActiveLink
              href={`/mentor-dashboard/${params.uid}/lesson-schedule`}
             
              src={class_scheduling}
              src2={class_scheduling_white}
              alt="Class Scheduling"
            />
          </div>
          <AppWrapper>{children}</AppWrapper>
        </div>
      </div>
      <BottomSection 
      
      />
    </div>
  );
}

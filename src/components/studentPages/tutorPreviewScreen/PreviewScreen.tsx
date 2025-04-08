"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import AboutMe from "./AboutMe";
import StaticCard from "./StaticCard";
import { TutorDocumentDataType } from "@/types";
import { useTutor } from "@/contexts/TutorContext";
import BackBtn from "@/components/tutorPages/personel_info/Commonlayout/BackBtn";

const PreviewScreen = () => {
  const { tutor } = useTutor();
  return (
    <div className="max-w-screen-2xl mx-auto relative px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-5">
        <div className="w-full lg:max-w-5xl flex flex-col gap-4">
          <ProfileCard tutor={tutor as TutorDocumentDataType} />
          <AboutMe tutor={tutor as TutorDocumentDataType} />
        </div>
        {/* <div className="w-full lg:max-w-4xl hidden lg:block custom-shadow rounded-xl px-4 xl:px-7 py-6">
          <StaticCard tutor={tutor as TutorDocumentDataType} />
        </div> */}
      </div>
    </div>
  );
};

export default PreviewScreen;

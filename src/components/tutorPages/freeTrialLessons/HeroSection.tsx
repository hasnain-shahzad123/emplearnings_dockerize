"use client";
import { useState, useEffect } from "react";
import MainSection from "./MainSection";
import Link from "next/link";
import { desclaimer, back } from "@/assets/index";
import Image from "next/image";
import BackBtn from "../personel_info/Commonlayout/BackBtn";
import changeTrialLessonOfferingStatus from "@/firebase/tutor/trial-lessons/addTutorTrialLessonScheduleToDB";
import fetchTrialLessonsService from "@/services/googleCalendar/fetchTrialLessonsService";

const HeroSection = ({ tutorId }: { tutorId: string }) => {
  const [isToggled, setIsToggled] = useState(true);
  const [trialLessons, setTrialLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrialLessons = async () => {
      setIsLoading(true);
      const response = await fetchTrialLessonsService({ uid: tutorId });
      if (response.type === "success") {
        setTrialLessons(response.events);
        console.log("The free trial events are : ",response.events);
      } else {
        console.error("Failed to fetch trial lessons");
      }
      setIsLoading(false);
    };

    if (isToggled) {
      fetchTrialLessons();
    }
  }, [tutorId, isToggled]);

  const handleToggle = async () => {
    setIsToggled((prev) => !prev);
    // const response = await changeTrialLessonOfferingStatus({
    //   freeTrialStatus: isToggled,
    //   tutorId,
    // });
    // console.log(response);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-[#F1F1FF] shadow-sm">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex justify-between items-center px-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Offer Free Trial Lessons
            </h1>

            <div className="flex items-center gap-5">
              <h1 className="text-[#7A7A7A]">Disable</h1>
              <div>
                <label
                  htmlFor="toggleB"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative" onClick={handleToggle}>
                    <input
                      type="checkbox"
                      id="toggleB"
                      className="sr-only"
                      checked={isToggled}
                      onChange={handleToggle}
                    />
                    <div
                      className={`block ${
                        isToggled ? "bg-empoweredFlag" : "bg-white"
                      } border-2 border-black w-14 h-8 rounded-full`}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-empoweredFlag w-6 h-6 rounded-full transition-transform ${
                        !isToggled ? "translate-x-0" : "translate-x-6"
                      } ${isToggled ? "bg-white" : "bg-empoweredFlag"}`}
                    ></div>
                  </div>
                </label>
              </div>
              <h1 className="text-[#7A7A7A]">Enable</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-start px-8 sticky top-0 pt-3">
       <BackBtn />  
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isToggled ? (
          <MainSection
            tutorId={tutorId}
            trialLessons={trialLessons}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-6 mt-8">
            <div className="bg-[#EAEAF9] rounded-lg border-2 border-[#4A148C] p-4 max-w-2xl mx-auto">
              <div className="flex gap-3 items-start">
                <Image
                  src={desclaimer.src}
                  alt="disclaimer"
                  width={20}
                  height={20}
                  className="flex-shrink-0 mt-1"
                />
                <p className="text-sm text-gray-600 leading-relaxed">
                  By enabling this option, you will be able to offer Free Trial
                  lessons to your potential students. Free trial lessons can be
                  a great attraction and encourages students to start their
                  learning journey with you.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-empoweredFlag text-center">
              Free trial lesson not available
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;

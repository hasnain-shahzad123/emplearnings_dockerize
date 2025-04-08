"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Reviews from "./Reviews";
import {
  ExternalReviewsProp,
  ReviewsProp,
  TutorDocumentDataType,
  TutorExternalReviewsDataType,
  TutorStrengthDataType,
} from "@/types";
import { user_profile } from "@/assets";
import ExternalReviews from "./ExternalReviewsModel";
import MySchedule from "./MySchedule";
import PersonalInformation from "./PersonalInformation";
import KeyStrengths from "./KeyStrengths";
import CoursesHub from "./CoursesHub";
import CourseRecommendations from "./CourseRecommendations";
import PersonalInfoMobile from "./PersonalInfoMobile";
import CourseHubMobile from "./CourseHubMobile";
import CourseRecommendationsMobile from "./CourseRecommendationsMobile";
import getTutorStrengthsFromDB from "@/firebase/tutor/dashboard/strenghts/getTutorStrengthsFromDB";
import { Alert } from "@/components/shared/customAlert/Alert";
import { useAlert } from "@/contexts/AlertContext";
import getTutorExternalReviewsFromDB from "@/firebase/tutor/dashboard/externel_reviews/getExternalReviewsFromDB";
import ExternalReviewsModel from "./ExternalReviewsModel";

const reviewsList: ReviewsProp[] = [
  {
    reviewerProfile: user_profile,
    reviewerName: "John Doe",
    reviewerRating: 4,
    reviewDate: "March 15 2025",
    review:
      "A very knowledgeable tutor who explains concepts clearly and effectively.",
  },
  {
    reviewerProfile: user_profile,
    reviewerName: "Jane Smith",
    reviewerRating: 5,
    reviewDate: "March 10 2025",
    review:
      "An exceptional tutor who goes above and beyond to help her students succeed.",
  },
  {
    reviewerProfile: user_profile,
    reviewerName: "Emily Johnson",
    reviewerRating: 4,
    reviewDate: "February 28 2025",
    review:
      "A great teaching style and is very patient with her students.",
  },
  {
    reviewerProfile: user_profile,
    reviewerName: "Michael Brown",
    reviewerRating: 5,
    reviewDate: "February 20 2025",
    review:
      "An outstanding tutor with a deep understanding of the subject matter.",
  },
  {
    reviewerProfile: user_profile,
    reviewerName: "Sarah Wilson",
    reviewerRating: 4,
    reviewDate: "February 15 2025",
    review:
      "A dedicated tutor who ensures her students grasp the material thoroughly.",
  },
  {
    reviewerProfile: user_profile,
    reviewerName: "David Lee",
    reviewerRating: 5,
    reviewDate: "February 10 2025",
    review:
      "An excellent tutor who makes learning enjoyable and engaging.",
  },
];

const AboutMe = ({ tutor }: { tutor: TutorDocumentDataType }) => {
  const [strengthDesctiption, setStrengthDescription] = useState<String>("");
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();
  const [isReviews, setIsReviews] = useState<boolean>(true);
  const [ExternalReviews, setExternalReviews] = useState<
    TutorExternalReviewsDataType[]
  >([]);
  useEffect(() => {
    const getExternalReviews = async () => {
      const response = await getTutorExternalReviewsFromDB({
        uid: tutor.uid,
      });
      if (response.type === "success") {
        setExternalReviews(
          response.ExternalReviewsData as TutorExternalReviewsDataType[]
        );
      }
    };
    getExternalReviews();
  }, [tutor.uid]);

  useEffect(() => {
    const getStrengthsOfTutor = async (uid: string) => {
      try {
        setIsLoading(true);
        const response = await getTutorStrengthsFromDB({ uid: uid });
        if (response.type === "success") {
          setStrengthDescription(response.strengths?.description || "");
        } else {
          // showAlert(response.message, "ERROR");
          setStrengthDescription("No strengths have been added");
        }
      } catch (error) {
        console.error("Error fetching strengths:", error);
        showAlert("Failed to fetch tutor strengths", "ERROR");
      } finally {
        setIsLoading(false);
      }
    };

    if (tutor?.uid) {
      getStrengthsOfTutor(tutor.uid);
    }
  }, [tutor?.uid, showAlert]);

  return (
    <div className="custom-shadow px-3 sm:px-8 py-6 rounded-xl">
      <h1 className="font-semibold text-xl my-3 text-[#4A148C]">About Me</h1>
      <p className="text-[15px]">{tutor.about || "No description added yet"}</p>
      <h1 className="font-semibold text-xl my-3 text-[#4A148C]">I Speak</h1>
      <p className="mb-3 text-[15px] font-semibold sm:block hidden">
        {tutor.languages.length > 0
          ? tutor.languages?.map((lang, index) => (
              <span key={index} className="ml-1 text-sm text-[#666666]">
                {lang.language_name}-{lang.proficiency_level}
              </span>
            ))
          : "No Languages added yet"}
      </p>
      <div className="sm:hidden block">
        {tutor.languages?.map((lang, index) => (
          <p key={index} className="ml-1 text-sm text-[#666666]">
            {lang.language_name}-{lang.proficiency_level}
          </p>
        ))}
      </div>
      <KeyStrengths
        strengthDescription={strengthDesctiption}
        isLoading={isLoading}
      />
      <div className="flex flex-row items-center justify-center gap-7 font-semibold text-xl text-[#4A148C]">
        <div>
          <button
            onClick={() => setIsReviews(true)}
            className={`transition-all duration-300 ${
              isReviews ? "border-b-4 border-[#4A148C]" : "border-none"
            }`}
          >
            Reviews
          </button>
        </div>
        <div>
          <button
            onClick={() => setIsReviews(false)}
            className={`transition-all duration-300 ${
              isReviews ? "border-none" : "border-b-4 border-[#4A148C]"
            }`}
          >
            External Reviews
          </button>
        </div>
      </div>
      {isReviews ? (
        <Reviews reviews={reviewsList} />
      ) : (
        <ExternalReviewsModel reviews={ExternalReviews} />
      )}
      <MySchedule tutorId={tutor.uid} />
      <div className="sm:hidden block">
        <PersonalInfoMobile uid={tutor.uid} />
      </div>
      <div className="sm:block hidden">
        <PersonalInformation uid={tutor.uid} />
      </div>
      <div className="sm:hidden block">
        <CourseHubMobile uid={tutor.uid} />
      </div>
      <div className="sm:block hidden">
        <CoursesHub uid={tutor.uid} />
      </div>
      {/* <div className="sm:hidden block">
        <CourseRecommendationsMobile />
      </div>
      <div className="sm:block hidden">
        <CourseRecommendations />
      </div> */}
    </div>
  );
};

export default AboutMe;

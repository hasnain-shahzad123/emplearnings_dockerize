import React from "react";
import Image from "next/image";
import mentor_preview_fallback from "@/assets/images/tutorPreviewScreen/mentor_preview_fallback.svg";
import verification_tick from "@/assets/images/tutorPreviewScreen/verification_tick.svg";
import { TutorDocumentDataType } from "@/types";
import BackBtn from "@/components/tutorPages/personel_info/Commonlayout/BackBtn";

const ProfileCard = ({ tutor }: { tutor: TutorDocumentDataType }) => {
  return (
    <>
      <div className="flex justify-start my-5">
        <BackBtn />
      </div>
      <div className="custom-shadow rounded-xl px-4 py-6 bg-gradient-to-r bg-empoweredFlag text-white sm:px-8">
        <div className="flex flex-col sm:flex-row items-start justify-evenly gap-5 mb-4">
          <div className="overflow-hidden  mt-1 flex-shrink-0 rounded-full border-4 border-white">
            <Image
              src={tutor.profilePhotoURL || mentor_preview_fallback}
              alt="User Profile Photo"
              height={2400}
              width={2400}
              className="w-24 h-24 bg-white sm:w-28 sm:h-28 md:h-[200px] md:w-[200px] object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            <div className="font-bold flex items-center gap-2 text-xl sm:text-2xl">
              <h1>{tutor.username}</h1>
              <div>
                <Image
                  src={verification_tick}
                  alt="Verified"
                  width={24}
                  height={24}
                  className="hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
            <p className="text-base sm:text-lg font-semibold my-2">
              {tutor.experience_years + " years of teaching experience" ||
                "Experience not added yet"}
            </p>
            <p className="font-bold text-lg sm:text-xl mb-2">
              {tutor.tagline || "Tagline not added yet"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tutor.categories.length > 0
                ? tutor.categories.map((teach, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-white text-black p-3 rounded-lg shadow-md"
                      >
                        <h1 className="font-bold text-base sm:text-lg">
                          {teach.sup_category || "No Super Category"}
                        </h1>
                        <h1 className="text-indigo-600 font-semibold text-base sm:text-lg">
                          {teach.category_name || "No Category"}{" "}
                          <span className="text-gray-600 ml-2 text-base sm:text-lg">
                            {teach.sub_category_name || "No Sub Category"}
                          </span>
                        </h1>
                      </div>
                    );
                  })
                : "No Categories Added Yet"}
            </div>
            <p className="text-base sm:text-lg mt-2">
              {tutor.about || "About not added yet"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;

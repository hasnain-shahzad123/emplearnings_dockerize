import getTutorEducationDetailsFromDB from "@/firebase/tutor/dashboard/education_and_expertise/getTutorEducationDetailsFromDB";
import { TutorEducationDataType } from "@/types";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

const style = {
  color: "#08A935",
};
const Education = ({ uid }: { uid: string }) => {
  const [educationData, setEducationData] = useState<TutorEducationDataType>();

  useEffect(() => {
    const getEducation = async () => {
      const response = await getTutorEducationDetailsFromDB({ uid: uid });
      if (response.type === "success" && response.educationData) {
        console.log(response.educationData);

        setEducationData(response.educationData as TutorEducationDataType);
      }
    };
    getEducation();
  }, [uid]);

  return (
    <div className="mt-10">
      {educationData ? (
        <div className="custom-shadow px-8  py-6 rounded-xl my-3 bg-white">
          <h2 className="text-xl font-semibold text-[#4A148C] mb-6">Education</h2>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <p className="text-gray-600 font-semibold text-lg mb-1">Institution</p>
              <h3 className="text-[16px] text-gray-800">
                {educationData?.institution_name || "Not Added Yet"}
              </h3>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 font-semibold text-lg mb-1">Degree</p>
              <h3 className="text-[16px] text-gray-800">
                {educationData?.highest_degree || "Not Added Yet"}  
              </h3>
              <p className="text-gray-700 mt-1">{educationData.field_of_study}</p>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 font-semibold text-lg mb-1">Graduation Year</p>
              <h3 className="text-[16px] text-gray-800">
                {educationData?.graduation_year || "Not Added Yet"}
              </h3>
            </div>
          </div>
          {educationData.is_verified && (
            <div className="mt-6 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg w-fit">
              <FaCheck className="text-[#08A935]" />
              <span className="font-medium text-[#08A935]">Verified Degree</span>
            </div>
          )}
        </div>
      ) : (
        <div className="custom-shadow px-8 py-10 rounded-xl my-3 bg-white">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#4A148C] mb-3">Education</h2>
            <p className="text-gray-600">
              No education information added by this mentor yet
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;

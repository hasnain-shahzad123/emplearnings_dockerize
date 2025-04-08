import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import getTutorExperienceYears from "@/firebase/tutor/dashboard/experience/getTutorExperienceYears";
import Image from "next/image";
import Frame from "@/assets/images/tutorPreviewScreen/Frame.svg";

const ProfessionalExperience = ({ uid }: { uid: string }) => {
  const [experienceYears, setExperienceYears] = useState(0);

  useEffect(() => {
    const fetchExperience = async () => {
      const response = await getTutorExperienceYears({ uid });
      if (response.type === "success" && response.data) {
        setExperienceYears(response.data.experience_years);
      }
    };
    fetchExperience();
  }, [uid]);

  return (
    <div className="custom-shadow px-8 py-6 mt-10 rounded-xl my-3">
      <div className="flex flex-col gap-4">
        <div className="flex-col items-center justify-around gap-3">
          <div className="flex flex-row items-center justify-between gap-5">
            <h1 className="text-lg">
              <span className="font-normal">Total mentoring experience{" "}:{" "} </span>
              <span className="font-semibold">
                {experienceYears > 0
                  ? `${experienceYears}+ Years`
                  : "No experience added yet"}
              </span>
            </h1>
            {experienceYears >= 5 && (
              <div className="flex items-center gap-2 text-[#4A148C]">
                <Image
                  src={Frame}
                  alt="Experience Badge"
                  width={24}
                  height={24}
                />
                <span className="text-sm italic">
                   Mentor is highly experienced
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-5">
            <FaCheck className="text-[#08A935]" size={16} />
            <span className="font-medium text-[#08A935]">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalExperience;

import React, { useState } from "react";
import ProfessionalExperience from "./ProfessionalExperience";
import Education from "./Education";
import Certifications from "./Certifications";

const PersonalInfoMobile = ({uid}:{uid:string}) => {
  const [divNumber, setDivNumber] = useState<number>(0);
  const handleForwardClick = () => {
    setDivNumber((prev) => (prev + 1) % 3);
  };

  const handleBackwardClick = () => {
    if (divNumber <= 0) {
      setDivNumber(2);
    } else {
      setDivNumber((prev) => prev - 1);
    }
  };

  return (
    <div className="my-[8%]">
      <div className="flex flex-row items-center justify-center gap-7 text-[#4A148C] text-lg font-semibold">
        <div onClick={handleBackwardClick} className="hover:cursor-pointer">
          &#10094;
        </div>
        <div>
          <h1>
            {" "}
            {divNumber == 0
              ? "Professional experience"
              : divNumber == 1
              ? "Education"
              : "Certifications"}
          </h1>
        </div>
        <div onClick={handleForwardClick} className="hover:cursor-pointer">
          &#10095;
        </div>
      </div>
      {divNumber === 0 ? (
        <ProfessionalExperience uid={uid} />
      ) : divNumber === 1 ? (
        <Education uid={uid} />
      ) : (
        <Certifications uid={uid}/>
      )}
    </div>
  );
};

export default PersonalInfoMobile;

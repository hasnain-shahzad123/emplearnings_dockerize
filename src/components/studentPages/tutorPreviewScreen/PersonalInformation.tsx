import React, { useState } from "react";
import ProfessionalExperience from "./ProfessionalExperience";
import Education from "./Education";
import Certifications from "./Certifications";

const PersonalInformation = ({ uid }: { uid: string }) => {
  const [divNumber, setDivNumber] = useState<number>(1);

  return (
    <div className="my-[10%]">
      <div className="flex flex-row items-center justify-center gap-7 text-[#4A148C] text-lg font-semibold">
        <div>
          <button
            onClick={() => {
              setDivNumber(1);
            }}
            className={`${
              divNumber === 1 ? "border-b-4 border-[#4A148C]" : "border-none"
            }`}
          >
            Professional experience
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setDivNumber(2);
            }}
            className={`${
              divNumber === 2 ? "border-b-4 border-[#4A148C]" : "border-none"
            }`}
          >
            Education
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setDivNumber(3);
            }}
            className={`${
              divNumber === 3 ? "border-b-4 border-[#4A148C]" : "border-none"
            }`}
          >
            Certifications
          </button>
        </div>
      </div>
      <div
        className={`transition-opacity duration-500 ${
          divNumber === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        {divNumber === 1 && <ProfessionalExperience uid={uid}/>}
      </div>
      <div
        className={`transition-opacity duration-500 ${
          divNumber === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        {divNumber === 2 && <Education uid={uid} />}
      </div>
      <div
        className={`transition-opacity duration-500 ${
          divNumber === 3 ? "opacity-100" : "opacity-0"
        }`}
      >
        {divNumber === 3 && <Certifications uid={uid} />}
      </div>
    </div>
  );
};

export default PersonalInformation;

"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { useEffect } from "react";
import Spinner from "@/components/shared/spinner/Spinner";
import { useTutor } from "@/contexts/TutorContext";
import addTutorYearsOfExperienceToDB from "@/firebase/tutor/dashboard/education_and_expertise/addTutorYearsOfExperienceToDB";
import { useAlert } from "@/contexts/AlertContext";

const ProfessionalExperience = () => {
  const {showAlert} = useAlert();
  const yearsExp = [
    "Select Years of Experience",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "20+",
  ];


  const [isTutorExperienceEmpty, setIsTutorExperienceEmpty] = useState(false);
  //here we will set the total experience of the tutor from db or from the user input
  const [tutorExperience, setTutorExperience] = useState<string>("0");
  const [isEditing, setIsEditing] = useState(false);
  const [isExperienceLoading, setIsExperienceLoading] = useState(true);
  const { tutor } = useTutor();

  useEffect(() => {
    setTutorExperience(tutor?.experience_years || "0");
    setIsExperienceLoading(false);
  }, [tutor]);

  const handleSave = async () => {
    if (isEditing && tutorExperience === "0") {
      setIsTutorExperienceEmpty(true);
      return;
    }
    setIsEditing(!isEditing);
    const response = await addTutorYearsOfExperienceToDB(
      { uid: tutor?.uid || "", experience: Number(tutorExperience) }
    )

    if (response.type === "error") {
      console.error("Error saving tutor experience to DB:", response.message);
    } else {
     // alert("Years of experience added successfully.");
     showAlert("Years of experience added successfully.", "SUCCESS");
    }
  }

  return (
    <div className="max-w-5xl custom-shadow rounded-xl px-5 py-3 pb-7">
      <h1 className="md:text-xl font-semibold mb-7">Professional Experience</h1>
      <h1 className="mb-5 font-semibold text-sm xs:text-base">
        What is your total number of years of tutoring experience?
      </h1>
      <div className="inline-flex xs:flex-row flex-col-reverse  gap-5 items-center ">
        {isExperienceLoading && <Spinner className="mx-10" size="sm" />}
        <div
          className={`${
            isExperienceLoading ? "hidden" : "block"
          }  flex-1 w-full md:w-[70%] relative`}
        >
          <label className="absolute p-1 -top-3 bg-white left-2 text-[8px] xss:text-xs z-10">
            Total Years of Experience
          </label>

          <div className={`relative`}>
            <select
              value={tutorExperience.toString()}
              // disabled={!isEditing}
              onClick={() => setIsEditing(true)}
              onChange={(e) => {
                setTutorExperience(e.target.value.toString());
                setIsTutorExperienceEmpty(false);
              }}
              className={`w-full md:text-base  text-xs p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800 bg-white appearance-none pr-10`}
            >
              {yearsExp.map((year, index) => (
                <option key={index} value={index}>
                  {year} years
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
              <FaChevronDown className="w-4 h-4 text-empoweredFlag" />
            </div>
          </div>
        </div>
        {isEditing ? (
          <>
            <div
              onClick={handleSave}
              className="flex cursor-pointer items-center px-3 py-1 hover:bg-white hover:border-[2px] border-empoweredFlag hover:text-black rounded-full bg-empoweredFlag text-white"
            >
              <button>Save</button>
              <TiTick className="h-[30px] w-[30px] " />
            </div>
            <div
              onClick={() => {
                setIsEditing(false);
                setTutorExperience(tutor?.experience_years || "0");
              }}
              className="flex cursor-pointer items-center px-4 py-2 hover:bg-white hover:border-[2px] border-empoweredFlag hover:text-black rounded-full bg-empoweredFlag text-white"
            >
              <button>Cancel</button>
              
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      {isTutorExperienceEmpty && (
        <div className="text-red-500 p-2 text-md">
          Please select your total years of experience
        </div>
      )}
    </div>
  );
};

export default ProfessionalExperience;

"use client";
import { useState, useRef, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import ConfirmDeletion from "../Modaal/ConfirmDeletion";
import { set } from "zod";
import Spinner from "@/components/shared/spinner/Spinner";
import Image from "next/image";
import { desclaimer } from "@/assets/index";
import type { TutorStrengthDataType } from "@/types";
import getTutorStrengthsFromDB from "@/firebase/tutor/dashboard/strenghts/getTutorStrengthsFromDB";
import addTutorStrengthsToDB from "@/firebase/tutor/dashboard/strenghts/addTutorStrengthsToDB";
import deleteTutorStrengthsFromDB from "@/firebase/tutor/dashboard/strenghts/deleteTutorStrengthFromDB";
import updateTutorStrengthsToDB from "@/firebase/tutor/dashboard/strenghts/updateTutorStrengthsToDB";

type params = {
  uid: string;
};
const Strengths = ({ uid }: params) => {
  const [strengthDescription, setStrengthDescription] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await addTutorStrengthsToDB({
        uid: uid,
        strength: {
          description: strengthDescription,
        },
      });

      if (response.type === "error") {
        throw new Error(response.message);
      }

      setIsButtonVisible(false);
      setInitialDescription(strengthDescription); // Update initial description after saving
    } catch (error) {
      console.error("Error saving strength:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchStrengths = async () => {
      try {
        setIsLoading(true);
        const response = await getTutorStrengthsFromDB({ uid: uid });

        if (response.type === "success" && response.strengths) {
          console.log("strengths are : ", response.strengths);
          setStrengthDescription(response.strengths.description.toString());
          setInitialDescription(response.strengths.description.toString()); // Set initial description
        }
      } catch (error) {
        console.error("Error fetching strengths:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) {
      fetchStrengths();
    }
  }, [uid]);

  return (
    <>
      <div className="max-w-5xl custom-shadow rounded-xl sm:px-5 py-3 pb-7">
        <h1 className="md:text-xl font-semibold mb-7 px-5">Key strengths</h1>
        <div className="bg-[#EAEAF9] flex-1 mx-10 md:w-[50%] md:mx-auto items-start flex gap-3 px-4 py-2 rounded-xl border-[#4A148C] border-[2px]">
          <Image
            src={desclaimer.src || "/placeholder.svg"}
            alt="disclaimer"
            width={15}
            height={15}
          />
          <h1 className="text-xs">
            Please highlight your key strengths in teaching and tutoring. What
            makes you unique
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 my-10">
          <div className="w-[60%] mx-auto relative">
            <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
              Description
            </label>
            <textarea
              onClick={() => {
                setIsButtonVisible(true);
              }}
              rows={7}
              value={strengthDescription}
              onChange={(e) => {
                setStrengthDescription(e.target.value);
              }}
              className="w-full resize-none p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
              placeholder="Mention skills, experience, or techniques that set you apart. Example: “I make math easier by breaking down complex problems,” or “I use project-based learning for hands-on coding."
            ></textarea>
          </div>
        </div>
        <div
          className={`${
            isButtonVisible ? "block" : "hidden"
          } flex md:flex-row flex-col md:justify-end`}
        >
          <CustomButton
            text={"Cancel"}
            onclickEvent={() => {
              setStrengthDescription(initialDescription); // Reset to initial description
              setIsButtonVisible(false);
            }}
            className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
          />
          <CustomButton
            text={isLoading ? "Saving..." : "Save"}
            onclickEvent={handleSave}
            disabled={isLoading}
            className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl disabled:opacity-50"
          />
        </div>
      </div>
    </>
  );
};

export default Strengths;

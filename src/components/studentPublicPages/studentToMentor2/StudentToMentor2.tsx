"use client";
import React from "react";
import CustomCard from "./CustomCard";
import { academic_tutoring, skill_development, life_coaching } from "@/assets";
import { StudentFormProvider } from "@/contexts/studentFormContext";
const customCardsData = [
  {
    Title: "Academic Tutoring",
    Icon: academic_tutoring,
    Description:
      "From core subjects like Reading, Writing, and Math to advanced topics like Algebra, Geometry, and standardized test preps, our experts guide every learner to success",
  },
  {
    Title: "Life Coaching",
    Icon: skill_development,
    Description:
      "Gain clarity, build soft skills, boost confidence, and set actionable goals with our life coaches, specialized in guiding you through personal challenges to success",
  },
  {
    Title: "Skill Development",
    Icon: life_coaching,
    Description:
      "Master essential skills with guidance from our expert mentors to excel on your path to success",
  },
];

const StudentToMentor2 = () => {
  return (
    <div className="max-w-7xl mx-auto text-center px-3">
      <h1 className="text-3xl md:text-5xl font-semibold mt-10">
        How Can We Assist{" "}
      </h1>
      <h1 className="text-3xl md:text-5xl font-semibold">You Today?</h1>
      <h1 className="text-[#4A148C] text-lg md:text-2xl my-7">
        Please select the type of help you are seeking
      </h1>
      <div className="bg-[#6E43A3] px-10 pt-7 pb-10 rounded-3xl flex flex-col lg:flex-row justify-between gap-10 items-center">
        {customCardsData.map((card, index) => {
          return (
            <StudentFormProvider key={index}>
              <CustomCard
                key={index}
                Title={card.Title}
                Description={card.Description}
                Icon={card.Icon}
              />
            </StudentFormProvider>
          );
        })}
      </div>
    </div>
  );
};

export default StudentToMentor2;

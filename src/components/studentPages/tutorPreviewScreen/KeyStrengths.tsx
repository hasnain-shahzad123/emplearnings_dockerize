import { TutorStrengthDataType } from "@/types";
import React from "react";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Spinner from "@/components/shared/spinner/Spinner";

const KeyStrengths = ({
  strengthDescription,
  isLoading,
}: {
  strengthDescription: String;
  isLoading: boolean;
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#4A148C]">Key Strengths</h2>
      {isLoading ? (
        <div className="flex justify-start mt-3">
          <Spinner size="sm" />
        </div>
      ) : (
        <div>
          <p className="pt-3 pb-5 text-[15px]">
            {strengthDescription == "" && !isLoading
              ? "No Strength Added"
              : strengthDescription}
          </p>
        </div>
      )}
    </>
  );
};

export default KeyStrengths;

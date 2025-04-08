"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { desclaimer } from '@/assets';
import CustomButton from '@/components/shared/CustomButton/CustomButton';
import addUpdateTutorLessonRateToDB from '@/firebase/tutor/dashboard/pricing/addUpdateTutorLessonRateToDB';
import { useTutor } from '@/contexts/TutorContext';
import Spinner from '@/components/shared/spinner/Spinner';
import { useAlert } from '@/contexts/AlertContext';
interface SetPricingProps {
  uid: string;
}

const SetPricing = ({ uid }: SetPricingProps) => {
  const { showAlert } = useAlert();
  const [isPriceLoading,setIsPriceLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<number>(7);
  const [isEditable, setIsEditable] = useState<boolean>(inputValue === 0);
  const [buttonText, setButtonText] = useState<string>(inputValue === 0 ? 'Add lesson rate' : 'Update lesson rate');
  const { tutor } = useTutor();

  const handleSaveClick = () => {
      handleSave();
      setIsEditable(false);
  };

  const handleSave = async () => {
    const response = await addUpdateTutorLessonRateToDB({ tutor_uid: uid, lesson_rate: inputValue });
    if (response.type === 'error') {
      console.log("Error while saving the price: ",response.message);
      showAlert("ohh, we faced an unexpected error while saving the lesson rate, please try again after few mins.", 'ERROR');
      return;
    }
    showAlert("Successfully saved the lesson rate.", 'SUCCESS');


    setIsEditable(false);
    setButtonText('Update lesson rate');
  };

  useEffect(() => {
    if (tutor) {
      setInputValue(tutor.per_lesson_rate);
    }
    setIsPriceLoading(false);

  }, [tutor])

  return (
    <div className="max-w-5xl rounded-xl px-7 py-5 custom-shadow">
      <h1 className="text-xl font-semibold">Set your 50-min lesson rate</h1>
      <div className="flex flex-col lg:flex-row mt-5 justify-between gap-5 lg:gap-10 items-center">
        {isPriceLoading && <Spinner className="mx-10" size="sm" />}
        <div
          className={` ${
            isPriceLoading ? "hidden" : "block"
          } relative w-full flex-1 my-2`}
        >
          {isEditable && (
            <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
              50-min lesson rate<span className="text-[#4A148C]">($)*</span>
            </label>
          )}
          <input
            type="number"
            value={inputValue}
            min={0}
            onChange={(e) => setInputValue(parseInt(e.target.value))}
            readOnly={!isEditable}
            onClick={() => setIsEditable(true)}
            placeholder={!isEditable ? "" : "50-min lesson rate($)*"}
            className={`text-lg w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 ${
              isEditable ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>
        <div className="bg-[#EAEAF9] w-full flex-1 items-center flex gap-3 px-5 py-3 my-3 text-[12px] lg:text-[14px] rounded-xl border-[#4A148C] border-[2px]">
          <Image
            src={desclaimer.src}
            alt="desclaimer"
            width={35}
            height={35}
            className="h-7 w-7"
          />
          <h1>Hourly Rate Can be Changed Anytime</h1>
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse md:justify-end gap-5">
        {isEditable && (
          <>
            <CustomButton
              text="Cancel"
              onclickEvent={() => {
              if(tutor){
                setInputValue(tutor?.per_lesson_rate);
              }
                setIsEditable(false);
              }}
              className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
            />
            <CustomButton
              text="Save"
              onclickEvent={handleSaveClick}
              className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SetPricing;

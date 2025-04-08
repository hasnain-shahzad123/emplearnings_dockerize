"use client";
import { use, useEffect, useState } from "react";
import { desclaimer, upload } from "@/assets";
import { useAlert } from "@/contexts/AlertContext";
import Spinner from "@/components/shared/spinner/Spinner";
import Image from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import addTutorTaglineAndAboutToDB from "@/firebase/tutor/bio/add/addTutorTaglineAndAboutToDB";
import { useTutor } from "@/contexts/TutorContext";
import { set } from "zod";
// import { saveSelfIntroduction } from "@/services/personalInfo/savePersonalInfoService";

const SelfIntroduction = ({ tutorId }: { tutorId: string }) => {
  const { showAlert } = useAlert();
  const { tutor } = useTutor();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [tagline, setTagline] = useState<string>("");
  const [taglineEmptyError, setTaglineEmptyError] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [about, setAbout] = useState<string>("");
  const [isSpinnerLoading, setIsSpinnerLoading] = useState<boolean>(true);

    const [videoName, setVideoName] = useState("");

    const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setVideoName(file.name); // Update state with the selected file name
      } else {
        setVideoName(""); // Reset state if no file is selected
      }
    };
  const SubmitSelfIntroduction = async () => {
    if (tagline !== "") {
      setTaglineEmptyError(false);
      const response = await addTutorTaglineAndAboutToDB({ tutorId, tagline, about });
      if (response.type === "success") {
        showAlert("Information saved successfully", "SUCCESS");
         setIsInputDisabled(false);
      } else {
        showAlert("There was a problem while saving your information", "ERROR");
        console.log(response.message);
      }
    } else {
      setTaglineEmptyError(true);
    }
   
  };

  useEffect(() => {
    setTagline(tutor?.tagline || "");
    setAbout(tutor?.about || "");
    setIsSpinnerLoading(false);
  }, [tutor])

  return (
    <div className="max-w-5xl custom-shadow rounded-xl px-5 py-3 pb-7">
      <h1 className="text-xl font-semibold mb-7">Self Introduction</h1>
      {isSpinnerLoading && <Spinner size="lg" />}
      <div
        className={`${
          isSpinnerLoading ? "hidden" : "block"
        } flex flex-col md:flex-row justify-between items-center gap-10`}
      >
        <div className="flex-1 w-full relative">
          <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
            Profile Tagline*
          </label>
          <input
            type="text"
            readOnly={!isInputDisabled}
            value={tagline}
            onClick={() => setIsInputDisabled(true)}
            onChange={(e) => {
              setTaglineEmptyError(false);
              setTagline(e.target.value);
            }}
            placeholder="A Short headline about yourself"
            className={`w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 ${
              isInputDisabled ? "" : "bg-gray-100"
            }`}
          />
          {taglineEmptyError && (
            <p className="text-red-500 p-1 text-md">
              {" "}
              Profile Tagline can&apos;t be empty
            </p>
          )}
        </div>
        <div className="bg-[#EAEAF9] flex-1 items-start flex gap-3 px-4 py-2 rounded-xl border-[#4A148C] border-[2px]">
          <Image src={desclaimer.src} alt="desclaimer" width={15} height={15} />
          <h1 className="text-sm">
            This will appear at the top of your profile when students search for
            fields related to your expertise.
          </h1>
        </div>
      </div>
      <div
        className={`${
          isSpinnerLoading ? "hidden" : "block"
        } flex flex-col md:flex-row justify-between items-center gap-10 mt-10`}
      >
        <div className="flex-1 w-full relative">
          <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
            A paragraph about Yourself*
          </label>
          <textarea
            readOnly={!isInputDisabled}
            value={about}
            onClick={() => setIsInputDisabled(true)}
            onChange={(e) => setAbout(e.target.value)}
            rows={7}
            className={`w-full p-3 resize-none border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 ${
              isInputDisabled ? "" : "bg-gray-100"
            }`}
            placeholder="A paragraph about Yourself"
          ></textarea>
        </div>
        {isPremium && (
          <div
            className={`flex ${
              isInputDisabled ? "" : "hidden"
            } flex-1 gap-5 flex-col md:flex-row justify-between items-start`}
          >
            <div className="relative w-[90%] mx-auto md:w-auto">
              <label className="absolute p-1 -top-2 bg-white left-2 text-xs">
                Add an introductory Video{" "}
              </label>
              <div className="mt-1 text-center flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md">
                <div className="text-center">
                  <label
                    htmlFor="video-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <div className="flex flex-col gap-5 px-5 py-3 items-center justify-center">
                      <div>
                        <Image
                          src={upload}
                          alt="Upload Video"
                          height={50}
                          width={50}
                        />
                      </div>
                      <div>
                        <p className="pl-1 text-[9px] text-[#4A148C]">
                          A self introductory video
                        </p>
                      </div>
                      <input
                        id="video-upload"
                        name="video-upload"
                        type="file"
                        className="sr-only hidden"
                        accept=".mp4"
                        onChange={handleVideoChange} // Handle file selection
                      />
                    </div>
                  </label>
                </div>
              </div>
              {videoName && (
                <p className="text-xs text-center mt-2 text-gray-600">
                  Selected: {videoName}
                </p>
              )}
              <p className="text-xs text-center mt-3 ml-3">
                Maximum size of 100MB
              </p>
            </div>

            <div className="bg-[#EAEAF9] w-full md:w-[40%] items-center justify-center flex gap-3 px-4 py-2 rounded-xl border-[#4A148C] border-[2px]">
              <Image
                src={desclaimer.src}
                alt="Disclaimer"
                width={15}
                height={15}
              />
              <h1 className="text-xs text-center">
                This feature is only for our premium Tutors
              </h1>
            </div>
          </div>
        )}
      </div>
      <div className="flex md:flex-row flex-col-reverse mx-5 md:justify-end">
        {isInputDisabled ? (
          <>
            <CustomButton
              onclickEvent={() => {
                setTagline(tutor?.tagline || "");
                setAbout(tutor?.about || "");
                setIsInputDisabled(false);
              }}
              text="Cancel"
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
            <CustomButton
              onclickEvent={() => {
                SubmitSelfIntroduction();
              }}
              text="Save"
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
          </>
        ) : null}
        {/* {toggleSubmit ? (
          <CustomButton
            onclickEvent={() => {
              SubmitSelfIntroduction();
            }}
            text="Save"
            className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
          />
        ) : (
          <CustomButton
            onclickEvent={() => {
              setToggleSubmit(!toggleSubmit);
            }}
            text="Update Introduction"
            className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
          />
        )} */}
      </div>
    </div>
  );
};

export default SelfIntroduction;

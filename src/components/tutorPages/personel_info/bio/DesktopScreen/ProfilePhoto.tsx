"use client";

import { upload, desclaimer } from "@/assets";
import { useState, ChangeEvent, useEffect } from "react";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import Image from "next/image";
import { useAlert } from "@/contexts/AlertContext";
import Spinner from "@/components/shared/spinner/Spinner";
import addProfilePhoto from "@/firebase/tutor/bio/add/addTutorProfilePhotoToDB";
import { useTutor } from "@/contexts/TutorContext";
import { set } from "zod";

const ProfilePhoto = ({ tutorId }: { tutorId: string }) => {
  const { showAlert } = useAlert();
  const { tutor, refreshTutor } = useTutor();
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [updateSelectedFile, setUpdateSelectedFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageLoaded, setLoadedImage] = useState<boolean>(false);
  const [IsinputFileChanged, setIsinputFileChanged] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (tutor && tutor.profilePhotoURL) {
      setPreviewSrc(tutor.profilePhotoURL);
    }
    // alert(tutor?.profilePhotoURL);
    console.log("Tutor in profile: ", tutor);
  }, [tutor]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewSrc(reader.result);
          setSelectedFile(file);
        }
      };
      reader.readAsDataURL(file);
      setIsinputFileChanged(true);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      showAlert("Please upload a profile photo.", "WARNING");
      return;
    }

    setIsSaving(true);

    const result = await addProfilePhoto({
      tutorId,
      profilePhoto: selectedFile,
    });

    if (result.type === "success") {
      showAlert("Profile photo updated successfully!", "SUCCESS");
    } else {
      console.log(`Error: ${result.message}`);
      showAlert(
        "ohh, we faced some issue while saving your profile picture, please try again after few mins.",
        "ERROR"
      );
    }

    setIsSaving(false);
    setIsinputFileChanged(false);
  };

  return (
    <div className="max-w-5xl rounded-xl px-5 py-5 custom-shadow">
      <h1 className="text-xl font-semibold">Profile Photo</h1>
      <div className="flex flex-row gap-2 md:gap-5 items-center lg:items-start justify-between md:p-4">
        <div
          className={`mb-4 w-[40%] flex-1 relative"
            }`}
        >
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md">
            <div className="text-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <div className="flex flex-col md:flex-row gap-5 px-5 py-3 items-center justify-center">
                  <div>
                    <Image
                      src={upload}
                      alt="Upload Picture"
                      height={400}
                      width={400}
                      className="h-13 w-12"
                    />
                  </div>
                  <div className="text-left">
                    <h1 className="text-[#7A7A7A] text-center md:text-left md:text-xl">
                      {previewSrc !== "" ? "Update photo" : "Upload a Photo"}
                    </h1>
                    <p className="pl-1 md:block hidden text-xs">
                      Only{" "}
                      <span className="text-[#4A148C]">png, jpg, jpeg</span>{" "}
                      formats are allowed
                    </p>
                  </div>
                </div>
                <input
                  id="file-upload"
                  // disabled={!updateSelectedFile}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
          <p className="text-[10px] sm:text-sm text-[#4A148C] mt-3 ml-3">
            Minimum Resolution 200 x 200 Pixels
          </p>
        </div>

        <div className="flex-1 flex flex-row justify-between items-center gap-5">
          {previewSrc ? (
            <div className="border-2 flex-1 border-dashed border-gray-300 rounded-md p-2 overflow-hidden">
              {!imageLoaded && <Spinner size="sm" />}
              <Image
                src={previewSrc}
                alt="Profile Preview"
                onLoad={() => {
                  setLoadedImage(true);
                }}
                loading={"eager"}
                className={`mx-auto ${
                  !imageLoaded ? "hidden" : "block"
                } max-h-40 max-w-full h-auto w-auto object-contain`}
                width={1560}
                height={1560}
              />
            </div>
          ) : (
            <div
              className={`flex-1 ${
                updateSelectedFile ? "md:-mt-4" : "md:mt-4"
              }`}
            >
              <h1 className="text-xs mb-3 -mt-5">Profile Preview</h1>
              <div className="border-2 py-12 border-gray-300 rounded-md text-center">
                <h1 className="text-[10px] md:text-xs mx-auto px-2 max-w-28">
                  Upload a photo to see it here.
                </h1>
              </div>
            </div>
          )}
          <div className="bg-[#EAEAF9] flex-1 hidden items-start md:flex gap-3 p-5 text-[14px] rounded-xl border-[#4A148C] border-[2px]">
            <Image
              src={desclaimer.src}
              alt="desclaimer"
              width={20}
              height={20}
            />
            <h1 className="text-xs lg:text-sm">
              Tutors with profile photo receive three times more business than
              tutors without one. You can upload photo later or can change any
              time.
            </h1>
          </div>
        </div>
      </div>
      <div className="bg-[#EAEAF9] flex-1 md:mt-0 mt-5 flex items-start md:hidden gap-3 p-5 text-[14px] rounded-xl border-[#4A148C] border-[2px]">
        <Image src={desclaimer.src} alt="desclaimer" width={20} height={20} />
        <h1 className="text-xs">
          Tutors with profile photo receive three times more business than
          tutors without one. You can upload photo later or can change any time.
        </h1>
      </div>
      <div className="flex flex-col-reverse  md:flex-row md:justify-end">
        {IsinputFileChanged ? (
          <>
            <CustomButton
              onclickEvent={() => {
                setIsinputFileChanged(false);
                setSelectedFile(null);
                if (tutor && tutor.profilePhotoURL) {
                  setPreviewSrc(tutor.profilePhotoURL);
                }
              }}
              text={"Cencel"}
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
            <CustomButton
              onclickEvent={() => {
                handleSave();
              }}
              text={isSaving ? "Saving..." : "Save"}
              className={`bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSaving}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ProfilePhoto;

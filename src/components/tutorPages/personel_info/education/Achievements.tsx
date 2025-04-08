"use client";
import { useState, useRef, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { desclaimer, upload } from "@/assets";
import Spinner from "@/components/shared/spinner/Spinner";
import Image from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import ConfirmDeletion from "../Modaal/ConfirmDeletion";
import type { TutorCertificationsDataType } from "@/types";
import { cross_icon } from "@/assets/index";
import { useAlert } from "@/contexts/AlertContext";
import getTutorCertificationsFromDB from "@/firebase/tutor/dashboard/certifications/getTutorCertificationsFromDB";
import deleteTutorCertificationsFromDB from "@/firebase/tutor/dashboard/certifications/deleteTutorCertificationsFromDB";
import addTutorCertificationsToDB from "@/firebase/tutor/dashboard/certifications/addTutorCertificationToDB";
import updateTutorCertificationsFromDB from "@/firebase/tutor/dashboard/certifications/updateTutorCertificationFromDB";

type params = {
  uid: string;
};
const Achievements = ({ uid }: params) => {
  const { showAlert } = useAlert();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isAchievementEmpty, setIsAchievementEmpty] = useState({
    heading: false,
    image: false,
  });
  const [showInput, setShowInput] = useState<boolean>(false);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const [certifications, setCertifications] = useState<
    TutorCertificationsDataType[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  //doing for modaal image loading
  const [isImageLoaded,setIsImageLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleAddCertification = () => {
    setShowInput(true);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
    setShowSaveButton(true);
    setEditingIndex(null);
    setInputValue("");
    setImagePreview(null);
  };

  const handleEditCertification = (index: number) => {
    const certToEdit = certifications[index];
    setInputValue(certToEdit.certification_heading);
    setImagePreview(certToEdit.image_url);
    setShowInput(true);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
    setShowSaveButton(true);
    setEditingIndex(index);
  };

  const handleSaveCertification = async () => {
    const isAchievementEmptyCopy = {
      heading: inputValue === "",
      image: imagePreview === null,
    };
    if (Object.values(isAchievementEmptyCopy).includes(true)) {
      setIsAchievementEmpty(isAchievementEmptyCopy);
      return;
    }
    const newCertification: TutorCertificationsDataType = {
      uid: crypto.randomUUID(),
      certification_heading: inputValue,
      is_verified: false,
      image_url: imagePreview || "",
    };

    if (editingIndex !== null) {
      const updatedCertifications = [...certifications];
      updatedCertifications[editingIndex] = newCertification;
      setCertifications(updatedCertifications);
      const response = await updateTutorCertificationsFromDB({
        uid,
        updateIndex: editingIndex,
        newCertification,
        certifications,
        image_file: uploadedImage,
      });
      if (response.type === "error") {
        console.error(response.message);
        return;
      } else {
        setCertifications(
          response.certifications as TutorCertificationsDataType[]
        );
      }
    } else {
      const response = await addTutorCertificationsToDB({
        uid,
        certification: newCertification,
        image_file: uploadedImage as File,
        array_size: certifications.length,
      });
      if (response.type === "error") {
        console.error(response.message);
        return;
      }
      setCertifications([...certifications, newCertification]);
    }

    setInputValue("");
    setShowInput(false);
    setShowSaveButton(false);
    setUploadedImage(null);
    setImagePreview(null);
    setEditingIndex(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      setIsAchievementEmpty({ ...isAchievementEmpty, image: false });
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerDelete = (index: number) => {
    setDeleteIndex(index);
    setShowConfirmModal(true);
  };

  const handleDeleteCertification = async () => {
    if (deleteIndex !== null) {
      const response = await deleteTutorCertificationsFromDB({
        uid: uid,
        deleteIndex,
        certifications,
      });
      if (response.type === "error") {
        console.error(response.message);
        return;
      } else {
        setCertifications(
          response.certifications as TutorCertificationsDataType[]
        );
        setDeleteIndex(null);
      }
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    const fetchCertifications = async () => {
      const response = await getTutorCertificationsFromDB({ uid });
      if (response.type === "success") {
        setCertifications(
          response.certifications as TutorCertificationsDataType[]
        );
        setIsLoading(false);
      }
      else {
        showAlert("An error occurred while fetching certifications", "ERROR");
        setIsLoading(false);
      }
    };
    fetchCertifications();
  }, [uid]);

  return (
    <div className="max-w-5xl custom-shadow rounded-xl px-5 py-3 pb-7">
      <h1 className="text-xs sm:text-lg md:text-xl font-semibold mb-7">
        Certifications/Achievements
      </h1>
      {isLoading && <Spinner />}
      {!isLoading &&
        certifications?.map((cert, index) => (
          <div
            key={index}
            className="border-[1px] p-5 flex flex-col my-10 border-[#4A148C] rounded-xl"
          >
            <div className="flex flex-wrap justify-between gap-5">
              <h1 className="font-semibold text-lg md:text-xl">
                {cert.certification_heading}
              </h1>
              <div className="flex gap-3 md:gap-5">
                <button
                  className="p-2 sm:p-1 rounded-full hover:bg-purple-100"
                  onClick={() => handleEditCertification(index)}
                >
                  <FiEdit className="text-[#4A148C] h-6 w-6 md:h-7 md:w-7" />
                </button>
                <button
                  className="p-2 sm:p-1 rounded-full hover:bg-purple-100"
                  onClick={() => handleTriggerDelete(index)}
                >
                  <MdDelete className="text-[#4A148C] h-6 w-6 md:h-7 md:w-7" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex justify-center md:justify-start">
              <button
                className="bg-[#4A148C] text-xs md:text-base hover:bg-white hover:text-empoweredFlag hover:border-[1px] border-black text-white px-5 py-2 md:px-7 md:py-3 rounded-full flex items-center"
                onClick={() => {
                  document.body.style.overflow = "hidden";
                  setSelectedImage(cert.image_url);
                }}
              >
                View Certificate
                <FaRegEye className="h-6 w-6 ml-2  inline" />
              </button>
            </div>
          </div>
        ))}

      {!isLoading && certifications?.length === 0 && (
        <div className="flex mx-5 justify-center items-center">
          <h1 className="text-base md:text-lg text-center font-semibold text-empoweredFlag">
            No Certifications/Achievements added yet
          </h1>
        </div>
      )}

      <div className="flex justify-end">
        <CustomButton
          text={
            certifications && certifications.length === 0
              ? "Add Certification"
              : "Add another Certification"
          }
          className="bg-[#4A148C] text-white px-3 sm:px-5 text-xs md:text-base my-7 md:mr-10 mt-5 py-3 rounded-3xl"
          onclickEvent={handleAddCertification}
        />
      </div>

      {showInput && (
        <>
          <div className="flex justify-end">
            <div className="bg-[#EAEAF9]  items-start flex gap-3 mx-10 px-4 py-2 rounded-xl border-[#4A148C] border-[2px]">
              <Image
                src={desclaimer.src || "/placeholder.svg"}
                alt="disclaimer"
                width={15}
                height={15}
              />
              <h1 className="text-xs">
                This image is visible only to the Admin for verification
                purposes.
              </h1>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mt-10">
            <div className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                Certification Heading
              </label>
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsAchievementEmpty({
                    ...isAchievementEmpty,
                    heading: false,
                  });
                }}
                placeholder="Java Programming Certification"
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
              />
              {isAchievementEmpty.heading && (
                <p className="text-red-500 text-md p-1">
                  Please enter the Certification Heading
                </p>
              )}
            </div>
            <div className="flex flex-1 gap-5 flex-col md:flex-row justify-between items-start">
              <div className="mb-4 md:w-[40%] mx-auto md:mx-0 flex-1 relative">
                <label className="block absolute -top-2 left-3 text-[10px] sm:text-sm font-medium text-gray-700 bg-white p-1">
                  Certification Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 rounded-md">
                  <div className="text-center">
                    <label
                      htmlFor="Achievement_file"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <div className="flex flex-col md:flex-row gap-5 px-5 py-3 items-center justify-center">
                        <div>
                          <Image
                            src={upload || "/placeholder.svg"}
                            alt="Upload Picture"
                          />
                        </div>
                        <div className="text-left">
                          <h1 className="text-[#7A7A7A] text-center md:text-left md:text-xl">
                            Upload a File
                          </h1>
                          <p className="text-[#7A7A7A] text-xs mt-1">
                            {uploadedImage ? uploadedImage.name : "JPG, PNG"}
                          </p>
                        </div>
                      </div>
                    </label>
                    <input
                      id="Achievement_file"
                      name="Achievement_file"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="sr-only"
                    />
                    {isAchievementEmpty.image && (
                      <p className="text-red-500 text-md p-1">
                        Please upload the Certification Image
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {imagePreview && (
        <div className="flex justify-center mt-5" ref={inputRef}>
          <div className="relative max-w-xs rounded-md overflow-hidden">
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt="Certification Preview"
              className="object-contain w-[250px] h-[250px]"
              width={500}
              height={500}
            />
          </div>
        </div>
      )}

      {showSaveButton && (
        <div className="flex md:flex-row flex-col gap-8 mx-8 mt-5 md:justify-end">
          <CustomButton
            text="Cancel"
            className="bg-[#4A148C] text-white px-10 py-3 rounded-full"
            onclickEvent={() => {
              setShowInput(false);
              setShowSaveButton(false);
              setInputValue("");
              setImagePreview(null);
              setUploadedImage(null);
              setEditingIndex(null);
            }}
          />
          <CustomButton
            text="Save"
            className="bg-[#4A148C] text-white px-10 py-3 rounded-full"
            onclickEvent={handleSaveCertification}
          />
        </div>
      )}

      {showConfirmModal && (
        <ConfirmDeletion
          text="Certification"
          handleDelete={handleDeleteCertification}
          setShowModal={() => setShowConfirmModal(false)}
        />
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          {/* Close Button */}

          {/* Modal Content */}
          <div className="relative max-w-4xl w-[90%] h-[90%] bg-white p-4 md:p-5 rounded-xl overflow-hidden shadow-lg">
            <div className="flex justify-end p-2 rounded-full bg-white">
              <Image
                src={cross_icon || "/placeholder.svg"}
                alt="Close"
                onClick={() => {
                  document.body.style.overflow = "auto";
                  setSelectedImage(null);
                  setIsImageLoaded(false);
                }}
                height={24}
                width={24}
                className="h-6 cursor-pointer w-6 md:h-8 md:w-8"
              />
            </div>
            {!isImageLoaded && (
              <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Certificate"
              width={2400}
              height={2400}
              onLoad={() => setIsImageLoaded(true)}
              loading={"eager"} 
              className="rounded-md  object-contain h-[90%] w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;

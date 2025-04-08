"use client";
import { useState, useRef, useEffect } from "react";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useAlert } from '@/contexts/AlertContext';
import ConfirmDeletion from "../../Modaal/ConfirmDeletion";
import addTutorLanguageProficiencyToDB from "@/firebase/tutor/bio/add/addTutorLanguageToDB";
import { useTutor } from "@/contexts/TutorContext";
import Spinner from "@/components/shared/spinner/Spinner";
import { LanguageType } from "@/types";
import { fontSize } from "fluid-tailwind";
import updateTutorLanguageProficiencyToDB from "@/firebase/tutor/bio/update/updateTutorLanguageProefficienyToDB";


const style = {
  color: "#4A148C",
  fontSize: "30px",
};

const Language = ({ tutorId }: { tutorId: string }) => {
  const { showAlert } = useAlert();
  const [isNewLanguage, setIsNewLanguage] = useState<boolean>(false);
  const [isEditLanguage, setIsEditLanguage] = useState<boolean>(false);
  const [editedLanguage, setEditedLanguage] = useState<string>("");
  const [editedProficiencyLevel, setEditedProficiencyLevel] =
    useState<string>("");
  const { tutor } = useTutor();
  const [alreadyAddedLanguages, setAlreadyAddedLanguages] = useState<LanguageType[]>([]);
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [newEfficiency, setNewEfficiency] = useState<string>("");
  const [deletedLanguage, setDeletedLanguage] = useState<string>("");
  const [LoadingLanguages, setLoadingLanguages] = useState<boolean>(true);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    "Select Language",
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian (Eastern)",
    "Armenian (Western)",
    "Azerbaijani (Azeri)",
    "Bassa",
    "Belarusian",
    "Bengali",
    "Bosnian",
    "Braille",
    "Bulgarian",
    "Burmese",
    "Cambodian (Khmer)",
    "Cape Verde Creole",
    "Cebuano",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Chuukese",
    "Croatian",
    "Czech",
    "Danish",
    "Dari",
    "Dutch",
    "English",
    "Estonian",
    "Farsi (Persian)",
    "Finnish",
    "Flemmish",
    "French (Canada)",
    "French (France)",
    "Fulani",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Haitian Creole",
    "Hakha Chin",
    "Hakka (Chinese)",
    "Hebrew",
    "Hindi",
    "Hmong",
    "Hungarian",
    "Icelandic",
    "Igbo/Ibo",
    "Ilocano",
    "Ilonggo (Hiligaynon)",
    "Indonesian",
    "Italian",
    "Japanese",
    "Javanese",
    "Kannada",
    "Karen",
    "Kazakh",
    "Kinyarwanda",
    "Kirundi",
    "Korean",
    "Kurdish (Kurmanji dialect)",
    "Kurdish (Sorani dialect)",
    "Kyrgyz/Kirgiz",
    "Lao (Laotian)",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay (Malaysian)",
    "Mandinka",
    "Marathi",
    "Marshallese",
    "Mien",
    "Mongolian",
    "Montenegrin",
    "Navajo",
    "Nepali",
    "Norwegian",
    "Oromo",
    "Pashto",
    "Polish",
    "Portuguese (Brazil)",
    "Portuguese (Portugal)",
    "Punjabi",
    "Rohingya",
    "Romanian (Moldavan)",
    "Russian",
    "Serbian",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish (Castilian)",
    "Spanish (Latin American)",
    "Spanish (other varieties)",
    "Swahili",
    "Swedish",
    "Tagalog",
    "Tamil",
    "Telugu",
    "Thai",
    "Tibetan",
    "Tigrinya",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Wolof",
    "Yoruba"
  ]);
  const proficiencyLevel = ["Select Level", "Native", "Beginner", "Intermediate", "Fluent"];

  const targetDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize already added languages from tutor context
    if (tutor?.languages) {
      setAlreadyAddedLanguages(tutor.languages);
      const addedLanguages = tutor.languages.map((lang) => lang.language_name);
      setAvailableLanguages((prev) =>
        prev.filter((lang) => !addedLanguages.includes(lang))
      );
      setLoadingLanguages(false);
    }
  }, [tutor]);

  const handleAddNewLanguageClick = () => {
    setIsEditLanguage(false);
    setIsNewLanguage(true);
    setTimeout(() => {
      targetDivRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const saveLanguage = async () => {
    if (isEditLanguage) {
      // Update existing language
      const updatedLanguages = alreadyAddedLanguages.map((lang) => {
        if (lang.language_name === editedLanguage) {
          return { ...lang, proficiency_level: editedProficiencyLevel };
        }
        return lang;
      });
      const dbResponse = await updateTutorLanguageProficiencyToDB({
        tutorId,
        updatedLanguagesArray: updatedLanguages,
      })
      if (dbResponse.type === "success") {
        showAlert("Language proficiency updated successfully", "SUCCESS");
        setAlreadyAddedLanguages(updatedLanguages);

      } else {
        showAlert("An error occurred while updating language proficiency.", "ERROR");
      }
      setIsEditLanguage(false);
    } else {
      if (newLanguage === "" || newEfficiency === "") {
        showAlert("Please select both language and proficiency level.", "ERROR");
        return;
      }
      const newLangObj = {
        language_name: newLanguage,
        proficiency_level: newEfficiency,
      };

      setAvailableLanguages((prev) => prev.filter((l) => l !== newLanguage));
      setIsNewLanguage(false);
      setNewLanguage("");
      setNewEfficiency("");

      const dbResponse = await addTutorLanguageProficiencyToDB({
        tutorId,
        newLanguageObject: newLangObj,
      });

      if (dbResponse.type === "success") {
        setAlreadyAddedLanguages((prev) => [...prev, newLangObj]);
        showAlert("Language proficiency added successfully", "SUCCESS");
      } else {
        showAlert("An error occurred while adding language proficiency.", "ERROR");
      }
    }
  };

  const handleDeleteLanguage = (lang: string) => {
    setDeletedLanguage(lang);
    setIsDeleteClicked(true);
  };

  const modalDeleteFunction = async () => {
    const updatedLanguagesArray = alreadyAddedLanguages.filter((l) => l.language_name !== deletedLanguage);
    const dbResponse = await updateTutorLanguageProficiencyToDB({
      tutorId,
      updatedLanguagesArray,
    })
    if (dbResponse.type === "success") {
      showAlert("Language proficiency deleted successfully", "SUCCESS");
      setAlreadyAddedLanguages(
        updatedLanguagesArray
      );
      setAvailableLanguages((prev) => [...prev, deletedLanguage]);
    } else {
      showAlert("An error occurred while deleting language proficiency.", "ERROR");
    }

    setIsDeleteClicked(false);
  };

  const handleEditLanguage = async (lang: LanguageType) => {
    setIsNewLanguage(false);
    setIsEditLanguage(true);
    setEditedLanguage(lang.language_name);
    setEditedProficiencyLevel(lang.proficiency_level);
    setTimeout(() => {
      targetDivRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  return (
    <div className="max-w-5xl custom-shadow rounded-xl px-5 py-3 pb-7">
      <h1 className="text-xl font-semibold mb-10">Language Proficiency</h1>
      {LoadingLanguages && <Spinner size="lg" />}
      {!LoadingLanguages && alreadyAddedLanguages.length > 0
        ? alreadyAddedLanguages.map((lang, index) => (
          <div
            key={index}
            className="px-5 my-2 md:text-lg w-full sm:w-[50%] border-2 border-[#7A7A7A] rounded-xl py-3 flex flex-row justify-between items-center"
          >
            <div>
              {lang.language_name} - {lang.proficiency_level}
            </div>
            <div className="flex flex-row items-center gap-2">
              <div
                onClick={() => handleDeleteLanguage(lang.language_name)}
                className="hover:cursor-pointer"
              >
                <MdDelete style={style} />
              </div>
              <div className="hover:cursor-pointer">
                <FiEdit
                  onClick={() => handleEditLanguage(lang)}
                  style={style}
                />
              </div>
            </div>
          </div>
        ))
        : !LoadingLanguages && (
          <div className="text-[#7A7A7A]">
            No languages added, please add some to showcase on your profile.
          </div>
        )}

      <div className="flex justify-end">
        <CustomButton
          onclickEvent={handleAddNewLanguageClick}
          text={
            alreadyAddedLanguages && alreadyAddedLanguages.length === 0
              ? "Add Language"
              : "Add Another Language"
          }
          className="bg-[#4A148C] text-white px-5 text-sm my-7 md:mr-10 mt-5 py-3 rounded-3xl"
        />
      </div>
      {(isNewLanguage || isEditLanguage) && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div ref={targetDivRef} className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                Languages Spoken*
              </label>
              <select
                onChange={(e) =>
                  isNewLanguage
                    ? setNewLanguage(e.target.value)
                    : setEditedLanguage(e.target.value)
                }
                value={isNewLanguage ? newLanguage : editedLanguage}
                disabled={!isNewLanguage}
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
              >
                {isNewLanguage
                  ? availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))
                  : [editedLanguage].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                Proficiency Level*
              </label>
              <select
                onChange={(e) =>
                  isNewLanguage
                    ? setNewEfficiency(e.target.value)
                    : setEditedProficiencyLevel(e.target.value)
                }
                value={isNewLanguage ? newEfficiency : editedProficiencyLevel}
                className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
              >
                {proficiencyLevel.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col-reverse  md:flex-row md:justify-end">
            <CustomButton
              text="Cencel"
              onclickEvent={() => {
                setIsNewLanguage(false);
                setIsEditLanguage(false);
              }}
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
            <CustomButton
              text="Save"
              onclickEvent={saveLanguage}
              className="bg-[#4A148C] text-white px-[45px] md:mr-10 mt-5 py-3 rounded-3xl"
            />
          </div>
        </>
      )}
      {isDeleteClicked && (
        <ConfirmDeletion
          text="Are you sure you want to delete the Language?"
          handleDelete={modalDeleteFunction}
          setShowModal={setIsDeleteClicked}
        />
      )}
    </div>
  );
};

export default Language;

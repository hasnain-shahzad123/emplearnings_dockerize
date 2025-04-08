"use client";
import { useState, useEffect, useRef } from "react";
import { desclaimer } from "@/assets/index";
import Image from "next/image";
import { CustomInputProps, TutorStoredCategoriesItemDataType } from "@/types";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import category from "@/app/(tutor)/mentor-dashboard/[uid]/category/page";

const MyCategoryChild = ({
  onSaveButtonClicked,
  onEditButtonClicked,
  suggestionData,
  currentPage,
  editObject,
  isCustomInput,
  setCustomInput,
}: CustomInputProps) => {
  // for the first input field
  const [inputValue, setInputValue] = useState<string>(
    editObject?.category_name
  );
  const [suggestions, setSuggestions] = useState<
    TutorStoredCategoriesItemDataType[]
  >([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const suggestionItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // For the second input field
  const [inputValue2, setInputValue2] = useState<string>(
    editObject?.sub_category_name
  );
  const [suggestions2, setSuggestions2] = useState<string[]>([]);
  const [isFocused2, setIsFocused2] = useState(false);
  const [selectedIndex2, setSelectedIndex2] = useState<number>(-1);
  const suggestionItemRefs2 = useRef<(HTMLLIElement | null)[]>([]);
  const [subCategoryData, setSubCategoryData] = useState<string[]>([]);

  useEffect(() => {
    // setSuggestions(suggestionData)
    if (currentPage === 1) {
      setSuggestions(suggestionData.academic_tutoring);
      setSuggestions2([]);
      setSubCategoryData([]);
      // setInputValue2("")
    } else if (currentPage === 2) {
      setSuggestions(suggestionData.life_coaching);
      setSuggestions2([]);
      setSubCategoryData([]);
      // setInputValue2("")
    } else if (currentPage === 3) {
      setSuggestions(suggestionData.skill_development);
      setSuggestions2([]);
      setSubCategoryData([]);
      // setInputValue2("")
    }
    if (suggestions.length !== 0) {
      const subCatArray: string[] | undefined = suggestions.find(
        (item) => item.category_name === inputValue
      )?.sub_categories;
      if (subCatArray) {
        setSuggestions2(subCatArray);
        setSubCategoryData(subCatArray);
      }
    }
  }, [currentPage, suggestionData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setInputValue2("");
    setSelectedIndex2(-1);
    setCustomInput(false); // Reset custom input state

    if (value) {
      const filteredSuggestions = suggestions.filter((item) =>
        item.category_name.toLowerCase().includes(value.toLowerCase())
      );
      console.log("Filtered Suggestions: ", filteredSuggestions);
      setSuggestions(filteredSuggestions);
      if (filteredSuggestions?.length === 0) {
        setCustomInput(true);
      }
      const subCatArray: string[] | undefined = suggestions.find(
        (item) => item.category_name.toLowerCase() === value.toLowerCase()
      )?.sub_categories;
      if (subCatArray) {
        setSuggestions2(subCatArray);
        setSubCategoryData(subCatArray);
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (inputValue === "") {
      if (currentPage === 1) {
        setSuggestions(suggestionData.academic_tutoring);
      } else if (currentPage === 2) {
        setSuggestions(suggestionData.life_coaching);
      } else if (currentPage === 3) {
        setSuggestions(suggestionData.skill_development);
      }
    }
  }, [inputValue, inputValue2]);

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue2(value);
    setCustomInput(false); // Reset custom input state

    if (value) {
      const filteredSuggestions = subCategoryData.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions2(filteredSuggestions);
      if (filteredSuggestions?.length === 0) {
        setCustomInput(true);
      }
    } else {
      setSuggestions2([]);
    }
  };

  const onFirstInputSuggestionClicked = (suggestion: string) => {
    setSuggestions([]);
    setInputValue(suggestion);
    setIsFocused(false);
    const subCatArray: string[] | undefined = suggestions.find(
      (item) => item.category_name === suggestion
    )?.sub_categories;
    if (subCatArray) {
      setSuggestions2(subCatArray);
      setSubCategoryData(subCatArray);
    }
  };

  const handleFirstInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions?.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions?.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      setInputValue(suggestions[selectedIndex].category_name);
      onFirstInputSuggestionClicked(suggestions[selectedIndex].category_name);
      setSuggestions([]);
    }
  };

  const onSecondInputSuggestionClicked = (suggestion: string) => {
    setInputValue2(suggestion);
    setSuggestions2([]);
  };

  const handleSecondInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex2((prevIndex) =>
        prevIndex < suggestions2?.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex2((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions2?.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex2 >= 0) {
      setInputValue2(suggestions2[selectedIndex2]);
      onSecondInputSuggestionClicked(suggestions2[selectedIndex2]);
      setSuggestions2([]);
    }
  };

  useEffect(() => {
    // Scroll the selected suggestion into view
    if (selectedIndex >= 0 && suggestionItemRefs.current[selectedIndex]) {
      suggestionItemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    // Scroll the selected suggestion into view
    if (selectedIndex2 >= 0 && suggestionItemRefs2.current[selectedIndex2]) {
      suggestionItemRefs2.current[selectedIndex2]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex2]);

  useEffect(() => {
    setInputValue(editObject?.category_name);
    setInputValue2(editObject?.sub_category_name);
    setIsFocused(false);
    setIsFocused2(false);
    setCustomInput(false);
  }, [
    currentPage,
    editObject?.category_name,
    editObject?.sub_category_name,
    setCustomInput,
  ]);

  useEffect(() => {
    console.log(
      "Input value 1 is: ",
      inputValue,
      "Input value 2 is: ",
      inputValue2,
      "Edit Object is: ",
      editObject
    );
  }, [inputValue, inputValue2, editObject]);

  const handleSave = () => {
    onSaveButtonClicked(inputValue, inputValue2);
  };

  const handleEdit = () => {
    onEditButtonClicked(inputValue, inputValue2);
  };

  return (
    <div className="custom-shadow px-7 py-5 font-poppins rounded-lg">
      <div>
        <h1 className="font-semibold text-lg sm:text-xl md:text-2xl my-4">
          Choose Your Category
        </h1>
      </div>
      <div className="flex flex-col sm:min-h-60 lg:flex-row justify-between gap-10 lg:gap-3 items-center lg:items-start my-7">
        <div className="relative w-full my-2 max-w-md">
          {/* Placeholder as legend */}
          {isFocused && (
            <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
              Select a Category
            </label>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleFirstInputKeyDown}
            onFocus={() => setIsFocused(true)}
            placeholder={!isFocused ? "Select a Category" : ""}
            className="text-sm sm:text-lg w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
          />
          {suggestions?.length > 0 && isFocused && !isCustomInput ? (
            <ul className="relative suggestions-list bg-white border border-gray-300 mt-2 rounded-md custom-shadow max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  ref={(el) => {
                    suggestionItemRefs.current[index] = el;
                  }}
                  key={index}
                  onClick={() =>
                    onFirstInputSuggestionClicked(suggestion.category_name)
                  }
                  className={`text-sm sm:text-lg px-4 py-3 cursor-pointer text-[#7A7A7A] hover:bg-[#F1F1FF] hover:text-black ${
                    index === selectedIndex ? "bg-[#F1F1FF] text-black" : ""
                  }`}
                >
                  {suggestion.category_name}
                </li>
              ))}
            </ul>
          ) : (
            <></>
          )}
        </div>
        <div className="relative w-full max-w-md my-2">
          {isFocused2 && (
            <label className="absolute p-1 bg-white -top-3 left-2 text-xs">
              Select a Sub Category *
            </label>
          )}
          <input
            disabled={inputValue?.length <= 0}
            type="text"
            value={inputValue2}
            onChange={handleChange2}
            onKeyDown={handleSecondInputKeyDown}
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(inputValue2?.length > 0)}
            placeholder={!isFocused2 ? "Select a Sub Category" : ""}
            className="text-sm sm:text-lg w-full text-[#4A148C] p-3 border border-gray-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
          />
          {suggestions2?.length > 0 && !isCustomInput ? (
            <ul className="relative suggestions-list bg-white border border-gray-300 mt-2 rounded-md max-h-48 overflow-y-auto custom-shadow">
              {suggestions2.map((suggestion, index) => (
                <li
                  ref={(el) => {
                    suggestionItemRefs2.current[index] = el;
                  }}
                  key={index}
                  onClick={() => onSecondInputSuggestionClicked(suggestion)}
                  className={`text-sm sm:text-lg px-4 py-3 cursor-pointer text-[#7A7A7A] hover:bg-[#F1F1FF] hover:text-black ${
                    index === selectedIndex2 ? "bg-[#F1F1FF] text-black" : ""
                  }`}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* Model for Custom Input */}
      {isCustomInput && (
        <div className="bg-[#EAEAF9] items-center w-[100%] sm:w-[70%]  mx-auto lg:mx-0 flex gap-3 p-5 my-3 text-[14px] rounded-xl border-[#4A148C] border-[2px]">
          <Image src={desclaimer.src} alt="desclaimer" width={30} height={30} />
          <h1>
            You can add new a Category and Sub - Category if it does not exists
            before on the platform. When you will submit, they will be submitted
            to our team for approval. Once approved, they will be displayed at
            your profile.
          </h1>
        </div>
      )}
      <div className="flex justify-end items-end mt-5 mb-10 sm:mt-5 sm:mb-5">
        <div>
          <CustomButton
            className="bg-[#4A148C] text-sm sm:text-lg px-3 py-2 rounded-2xl sm:px-7 sm:py-3 font-poppins text-white sm:rounded-3xl"
            text={editObject?.sub_category_name == "" ? "Save" : "Edit"}
            onclickEvent={
              editObject?.sub_category_name == "" ? handleSave : handleEdit
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MyCategoryChild;

"use client"
import { useState, useRef, useEffect } from "react"
import { desclaimer } from "@/assets/index"
import Image from "next/image"
import { useAlert } from "@/contexts/AlertContext"
import type { TutorStoredCategoriesDataType, TutorStoredCategoriesItemDataType } from "@/types"

interface CategoryChildProps {
  suggestionData: TutorStoredCategoriesDataType
  currentPage: number
}

const CategoryChild = ({ suggestionData, currentPage }: CategoryChildProps) => {
  const [selectedCategory, setSelectedCategory] = useState<"academic_tutoring" | "skill_development" | "life_coaching">(
    "academic_tutoring",
  )
  const {showAlert} = useAlert();
  const [inputValue, setInputValue] = useState<string>("")
  const [suggestions, setSuggestions] = useState<TutorStoredCategoriesItemDataType[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const suggestionItemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [isCustomInput, setCustomInput] = useState<boolean>(false)

  const [inputValue2, setInputValue2] = useState<string>("")
  const [suggestions2, setSuggestions2] = useState<string[]>([])
  const [isFocused2, setIsFocused2] = useState(false)
  const [selectedIndex2, setSelectedIndex2] = useState<number>(-1)
  const suggestionItemRefs2 = useRef<(HTMLLIElement | null)[]>([])
  const [subCategoryData, setSubCategoryData] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    const value = e.target.value
    setInputValue(value)
    setInputValue2("")
    setSelectedIndex2(-1)

    if (value) {
      const filteredSuggestions = suggestionData[selectedCategory].filter((subject) =>
        subject.category_name.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions)
      setCustomInput(filteredSuggestions.length === 0)
    } else {
      setSuggestions([])
    }
  }

  const onFirstInputSuggestionClicked = (suggestion: string) => {
    debugger;
    setInputValue(suggestion)
    const subCatArray = suggestionData[selectedCategory].find(
      (item) => item.category_name === suggestion,
    )?.sub_categories
    if (subCatArray) {
      setSuggestions2(subCatArray)
      setSubCategoryData(subCatArray)
    }
  }

  const handleFirstInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    debugger;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0))
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      setInputValue(suggestions[selectedIndex].category_name)
      onFirstInputSuggestionClicked(suggestions[selectedIndex].category_name)
    }
  }

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger;

    const value = e.target.value
    setInputValue2(value)

    if (value) {
      const filteredSuggestions = subCategoryData.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions2(filteredSuggestions)
      setCustomInput(filteredSuggestions.length === 0)
    } else {
      setSuggestions2([])
    }
  }

  const onSecondInputSuggestionClicked = (suggestion: string) => {
    debugger;

    setInputValue2(suggestion)
    setSuggestions2([])
  }

  const handleSecondInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    debugger;

    if (e.key === "ArrowDown") {
      setSelectedIndex2((prevIndex) => (prevIndex < suggestions2.length - 1 ? prevIndex + 1 : 0))
    } else if (e.key === "ArrowUp") {
      setSelectedIndex2((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestions2.length - 1))
    } else if (e.key === "Enter" && selectedIndex2 >= 0) {
      setInputValue2(suggestions2[selectedIndex2])
      onSecondInputSuggestionClicked(suggestions2[selectedIndex2])
      setSuggestions2([])
    }
  }

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionItemRefs.current[selectedIndex]) {
      suggestionItemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [selectedIndex])

  useEffect(() => {
    if (selectedIndex2 >= 0 && suggestionItemRefs2.current[selectedIndex2]) {
      suggestionItemRefs2.current[selectedIndex2]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [selectedIndex2])

  useEffect(() => {
    setInputValue("")
    setInputValue2("")
    setIsFocused(false)
    setIsFocused2(false)
    setCustomInput(false)
  }, [selectedCategory]) //Removed unnecessary dependency

  useEffect(() => {
    console.log("THIS IS SUGGESTION DATA : ");
    console.log(suggestionData)
    setSuggestions(suggestionData[selectedCategory])
  }, [suggestionData, selectedCategory])

  useEffect(() => {
    console.log("suggestionData", suggestionData)
   // alert("suggestionData")
   showAlert("suggestionData", "INFO");
  }, [suggestionData, selectedCategory])

  return (
    <div className="custom-shadow px-7 py-5 font-poppins rounded-lg">
      <div>
        <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl my-4">Choose Your Category</h1>
      </div>
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-3 items-center lg:items-start my-7">
        <div className="relative w-full my-2 max-w-md">
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as "academic_tutoring" | "skill_development" | "life_coaching")
            }
            className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800 mb-4"
          >
            <option value="academic_tutoring">Academic Tutoring</option>
            <option value="skill_development">Skill Development</option>
            <option value="life_coaching">Life Coaching</option>
          </select>
          {isFocused && <label className="absolute p-1 -top-3 bg-white left-2 text-xs">Select a Category</label>}
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleFirstInputKeyDown}
            onFocus={() => setIsFocused(true)}
            placeholder={!isFocused ? "Select a Category" : ""}
            className="w-full p-3 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
          />
          {suggestions.length > 0 && isFocused && !isCustomInput && (
            <ul className="relative suggestions-list bg-white border border-gray-300 mt-2 rounded-md custom-shadow max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  ref={(el) => {
                    suggestionItemRefs.current[index] = el
                  }}
                  key={index}
                  onClick={() => onFirstInputSuggestionClicked(suggestion.category_name)}
                  className={`px-4 py-3 cursor-pointer text-[#7A7A7A] hover:bg-[#F1F1FF] hover:text-black ${index === selectedIndex ? "bg-[#F1F1FF] text-black" : ""
                    }`}
                >
                  {/* {suggestion.category_name} */}
                  {"Hello"}
                </li>
              ))}
            </ul>
          )}

        </div>
        <div className="relative w-full max-w-md my-2">
          {isFocused2 && <label className="absolute p-1 bg-white -top-3 left-2 text-xs">Select a Sub Category *</label>}
          <input
            disabled={inputValue.length <= 0}
            type="text"
            value={inputValue2}
            onChange={handleChange2}
            onKeyDown={handleSecondInputKeyDown}
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(inputValue2.length > 0)}
            placeholder={!isFocused2 ? "Select a Sub Category" : ""}
            className="w-full text-[#4A148C] p-3 border border-gray-300 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
          />
          {suggestions2.length > 0 && !isCustomInput && (
            <ul className="relative suggestions-list bg-white border border-gray-300 mt-2 rounded-md max-h-48 overflow-y-auto custom-shadow">
              {suggestions2.map((suggestion, index) => (
                <li
                  ref={(el) => {
                    suggestionItemRefs2.current[index] = el
                  }}
                  key={index}
                  onClick={() => onSecondInputSuggestionClicked(suggestion)}
                  className={`px-4 py-3 cursor-pointer text-[#7A7A7A] hover:bg-[#F1F1FF] hover:text-black ${index === selectedIndex2 ? "bg-[#F1F1FF] text-black" : ""
                    }`}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {isCustomInput && (
        <div className="bg-[#EAEAF9] items-center w-[100%] sm:w-[70%]  mx-auto lg:mx-0 flex gap-3 p-5 my-3 text-[14px] rounded-xl border-[#4A148C] border-[2px]">
          <Image src={desclaimer.src || "/placeholder.svg"} alt="desclaimer" width={30} height={30} />
          <h1>
            You can add new a Category and Sub - Category if it does not exists before on the platform. When you will
            submit, they will be submitted to our team for approval. Once approved, they will be displayed at your
            profile.
          </h1>
        </div>
      )}
    </div>
  )
}

export default CategoryChild


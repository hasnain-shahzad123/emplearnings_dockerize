"use client"
import React, { useEffect } from "react"
import TutorCard from "./TutorCard"
import type { TutorCardType } from "@/types"
import { useState } from "react"
import TutorMobileCard from "./TutorMobileCard"
import { VscSearch } from "react-icons/vsc"
import { IoFilter } from "react-icons/io5"

const initialTutors: TutorCardType[] = [
  {
    name: "Hsni",
    tagline:
      "Myself Anwar and my specialties are teaching accurate Software Engineering, IT Project Management, different methodologies in Development Life Cycle.",
    categories: [
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
    ],
    rating: 3,
    completed_lessons: 150,
    active_students: 20,
    about:
      "Hsni is an exceptional tutor with over 25 years of industry experience in software engineering. He simplifies complex concepts, offers valuable real-world insights, and shows genuine care for his students' success. His approachable and patient teaching style has greatly boosted my confidence in programming. I highly recommend him for anyone looking to improve their computer science skills.",
    number_of_reviews: 15,
    experience_years: 10,
    plan_type: "Pro",
    per_lesson_rate: 30,
    country: "Pakistan",
    languages: [
      {
        language_name: "Arabic",
        proficiency_level: "Beginner",
      },
      {
        language_name: "Hindi",
        proficiency_level: "Native",
      },
      {
        language_name: "Urdu",
        proficiency_level: "Fluent",
      },
    ],
  },
  {
    name: "Ali",
    tagline:
      "Myself Anwar and my specialties are teaching accurate Software Engineering, IT Project Management, different methodologies in Development Life Cycle.",
    categories: [
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
    ],
    rating: 4,
    completed_lessons: 150,
    active_students: 20,
    about:
      "Muhammad  is an exceptional tutor with over 25 years of industry experience in software engineering. He simplifies complex concepts, offers valuable real-world insights, and shows genuine care for his students' success. His approachable and patient teaching style has greatly boosted my confidence in programming. I highly recommend him for anyone looking to improve their computer science skills.",
    number_of_reviews: 15,
    experience_years: 10,
    plan_type: "Premium",
    per_lesson_rate: 100,
    country: "India",
    languages: [
      {
        language_name: "English",
        proficiency_level: "Beginner",
      },
      {
        language_name: "Hindi",
        proficiency_level: "Native",
      },
      {
        language_name: "Urdu",
        proficiency_level: "Fluent",
      },
    ],
  },
  {
    name: "Muhammad ",
    tagline:
      "Myself Anwar and my specialties are teaching accurate Software Engineering, IT Project Management, different methodologies in Development Life Cycle.",
    categories: [
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
      {
        sup_category: "Academic Tutoring",
        category_name: "Computer Science",
        sub_category: "Theory of Automata",
      },
    ],
    rating: 5,
    completed_lessons: 150,
    active_students: 20,
    about:
      "Muhammad Haseeb is an exceptional tutor with over 25 years of industry experience in software engineering. He simplifies complex concepts, offers valuable real-world insights, and shows genuine care for his students' success. His approachable and patient teaching style has greatly boosted my confidence in programming. I highly recommend him for anyone looking to improve their computer science skills.",
    number_of_reviews: 15,
    experience_years: 10,
    plan_type: "Premium",
    per_lesson_rate: 50,
    country: "Australia",
    languages: [
      {
        language_name: "English",
        proficiency_level: "Beginner",
      },
      {
        language_name: "Hindi",
        proficiency_level: "Native",
      },
      {
        language_name: "Urdu",
        proficiency_level: "Fluent",
      },
    ],
  },
]

const someDbFunction = (filt: string) => {
  return initialTutors
}

const TutorListComponent = () => {
  const [tutorsList, setTutorsList] = useState(initialTutors)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false)
  const [isPriceClicked, setIsPriceClicked] = useState<boolean>(false)
  const [sortOption, setSortOption] = useState<string>("Sort By")
  const [filters, setFilters] = useState({
    mainCategory: "",
    subCategory: "",
    mentorCategory: "",
    country: "",
    minPrice: 0,
    maxPrice: 0,
    language: "",
    search: "",
  })

  const countries = ["Select a Country", "Pakistan", "Australia", "USA", "India", "UK"]

  const languages = [
    "Language",
    "English",
    "Spanish",
    "Mandarin",
    "Hindi",
    "French",
    "Arabic",
    "Bengali",
    "Portuguese",
    "Russian",
    "Japanese",
    "German",
    "Korean",
    "Italian",
    "Turkish",
    "Urdu",
    "Punjabi",
    "Vietnamese",
    "Persian",
    "Swahili",
    "Tamil",
  ]

  const preferredTimeSlot = [
    "Preferred Timeslot",
    "Anytime",
    "8 - 10 am",
    "10 - 11:59 am",
    "12 - 2 pm",
    "2 - 4 pm",
    "4 - 6 pm",
    "6 - 8 pm",
    "8 - 10 pm",
    "10 - 11:59 pm",
  ]

  const mentorCategories = ["Mentor Categories", "Standard", "Pro", "Premium"]

  const sortOptions = [
    "Sort By",
    "Best Rating",
    "Popularity",
    "Low to High Price",
    "High to Low Price",
    "Experience",
    "High Reviews",
  ]

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }))
    // console.log(filters);
    // applyFilters();
  }

  // Move this block up, before any useEffect that uses it
  const applyFilters = React.useCallback(() => {
    const filtered = initialTutors.filter((tutor) => {
      return (
        (filters.mainCategory
          ? tutor.categories.some((category) => category.sup_category === filters.mainCategory)
          : true) &&
        (filters.subCategory
          ? tutor.categories.some((category) => category.sub_category === filters.subCategory)
          : true) &&
        (filters.mentorCategory ? tutor.plan_type == filters.mentorCategory : true) &&
        (filters.country ? tutor.country === filters.country : true) &&
        (filters.minPrice ? tutor.per_lesson_rate >= filters.minPrice : true) &&
        (filters.maxPrice ? tutor.per_lesson_rate <= filters.maxPrice : true) &&
        (filters.language
          ? tutor.languages.some((lang) => lang.language_name.toLowerCase() === filters.language.toLowerCase())
          : true) &&
        (filters.search ? tutor.name.toLowerCase().includes(filters.search.toLowerCase()) : true)
      )
    })
    setTutorsList(filtered)
  }, [filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  useEffect(() => {
    // Define applySorting inside the useEffect
    const applySorting = (option: string) => {
      let sortedTutors = [...tutorsList]
      switch (option) {
        case "Best Rating":
          sortedTutors.sort((a, b) => b.rating - a.rating) // Descending by rating
          break
        case "Popularity":
          sortedTutors.sort((a, b) => b.active_students - a.active_students) // Descending by active students
          break
        case "Low to High Price":
          sortedTutors.sort((a, b) => a.per_lesson_rate - b.per_lesson_rate) // Ascending by price
          break
        case "High to Low Price":
          sortedTutors.sort((a, b) => b.per_lesson_rate - a.per_lesson_rate) // Descending by price
          break
        case "Experience":
          sortedTutors.sort((a, b) => b.experience_years - a.experience_years) // Descending by experience years
          break
        case "High Reviews":
          sortedTutors.sort((a, b) => b.number_of_reviews - a.number_of_reviews) // Descending by number of reviews
          break
        default:
          sortedTutors = initialTutors // Reset to default
          break
      }
      setTutorsList(sortedTutors)
    }

    applySorting(sortOption)
  }, [sortOption, tutorsList])

  // Remove this useEffect as it's redundant with the one we added below
  // useEffect(()=>{applyFilters()}, [filters])

  const handleTimeSlotChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const filterTutorsBasedOnTimeSlot = someDbFunction(event.target.value)
    setTutorsList(filterTutorsBasedOnTimeSlot)
  }
  return (
    <div className="max-w-7xl mx-auto px-3">
      <h1 className="my-5 text-xl font-semibold text-[#4A148C]">Search your Mentors by applying these Filters.</h1>
      <div className="md:block flex flex-row items-start justify-between gap-4  my-5 text-sm custom-shadow px-5 py-7 rounded-xl">
        <div>
          <div className="flex md:flex-row flex-col gap-3 justify-between items-center">
            <div className={`${showSearchBar ? "hidden" : "block"} w-full`}>
              <input
                type="text"
                name="mainCategory"
                className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                placeholder="Main Category"
                onChange={handleFilterChange}
              />
            </div>
            <div className={`${showSearchBar ? "hidden" : "block"} w-full`}>
              <input
                type="text"
                name="subCategory"
                className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                placeholder="Sub Category"
                onChange={handleFilterChange}
              />
            </div>
            <div className={`md:block ${!showFilters || showSearchBar ? "hidden" : ""} w-full`}>
              <select
                defaultValue={countries[0]}
                name="country"
                className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                onChange={handleFilterChange}
              >
                {countries.map((country, index) => (
                  <option disabled={index === 0} key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className={`md:block ${!showFilters || showSearchBar ? "hidden" : ""} w-full`}>
              <select
                defaultValue={preferredTimeSlot[0]}
                name="country"
                className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                onChange={handleTimeSlotChange}
              >
                {preferredTimeSlot.map((prefTime, index) => (
                  <option disabled={index === 0} key={prefTime} value={prefTime}>
                    {prefTime}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-3 my-3 items-center justify-between">
            <div className={`md:block ${!showFilters || showSearchBar ? "hidden" : ""} w-full`}>
              <input
                readOnly={true}
                type="number"
                className="cursor-default w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                name="price"
                placeholder="Price"
                onClick={() => setIsPriceClicked((prev) => !prev)}
              />
              <div className={`${isPriceClicked ? "block" : "hidden"} w-[75%] mt-2 custom-shadow px-5 py-7 rounded-xl`}>
                <div className="my-2">
                  <input
                    min={0}
                    type="number"
                    name="minPrice"
                    placeholder="From"
                    className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                    onChange={handleFilterChange}
                  />
                </div>
                <div>
                  <input
                    min={filters["minPrice"]}
                    type="number"
                    name="maxPrice"
                    placeholder="To"
                    className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
            <div className={`md:block ${!showFilters || showSearchBar ? "hidden" : ""} w-full`}>
              <select
                defaultValue={languages[0]}
                name="language"
                className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                onChange={handleFilterChange}
              >
                {languages.map((lang, index) => (
                  <option disabled={index === 0} key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className={`md:block ${!showFilters || showSearchBar ? "hidden" : ""} w-full`}>
              <select
                defaultValue={mentorCategories[0]}
                name="mentorCategory"
                className="w-full max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                onChange={handleFilterChange}
              >
                {mentorCategories.map((mentCat, index) => (
                  <option disabled={index === 0} key={mentCat} value={mentCat}>
                    {mentCat}
                  </option>
                ))}
              </select>
            </div>
            <div className={`md:block ${!showFilters || showSearchBar ? "hidden" : ""} w-full`}>
              <select
                defaultValue={sortOptions[0]}
                name="sort"
                className="w-full max-h-72 max-w-64 px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                onChange={(e) => setSortOption(e.target.value)}
              >
                {sortOptions.map((sortOpt, index) => (
                  <option disabled={index === 0} key={sortOpt} value={sortOpt}>
                    {sortOpt}
                  </option>
                ))}
              </select>
            </div>
            <div className={`relative md:block ${!showSearchBar || showFilters ? "hidden" : ""} w-full`}>
              <input
                type="text"
                className="w-full max-w-64 pr-3 py-2 pl-7 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
                name="search"
                placeholder="Search Tutor/Coach"
                onChange={handleFilterChange}
              />
              <div className="absolute left-2 top-3">
                <VscSearch />
              </div>
            </div>
          </div>
        </div>
        {/* <div>
          <div className="flex md:flex-row flex-col gap-3 justify-between items-center">
            <div className={`${showSearchBar ? "hidden" : "block"} w-full`}>
              <input
                type="text"
                name="mainCategory"
                className="w-full max-w-md px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                placeholder="Main Category"
                onChange={handleFilterChange}
              />
            </div>
            <div className={`${showSearchBar ? "hidden" : "block"} w-full`}>
              <input
                type="text"
                name="subCategory"
                className="w-full max-w-md px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                placeholder="Sub Category"
                onChange={handleFilterChange}
              />
            </div>
            <div className={`md:block ${!showFilters ? "hidden" : ""} w-full`}>
              <select
                defaultValue={countries[0]}
                name="country"
                className="w-full max-w-md px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                onChange={handleFilterChange}
              >
                {countries.map((country, index) => (
                  <option
                    disabled={index === 0}
                    key={country}
                    value={country}
                  >
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-3 my-3 items-center justify-between">
            <div className={`md:block ${!showFilters ? "hidden" : ""} w-full`}>
              <input
                type="number"
                className="w-full max-w-md px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                name="price"
                placeholder="Price"
                onChange={handleFilterChange}
              />
            </div>
            <div className={`md:block ${!showFilters ? "hidden" : ""} w-full`}>
              <input
                type="text"
                className="w-full max-w-md px-3 py-2 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                name="language"
                placeholder="Language"
                onChange={handleFilterChange}
              />
            </div>
            <div className={`relative md:block ${!showSearchBar || showFilters ? "hidden" : ""} w-full`}>
              <input
                type="text"
                className="w-full max-w-md pr-3 py-2 pl-7 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800"
                name="search"
                placeholder="Search Tutor/Coach"
                onChange={handleFilterChange}
              />
              <div className="absolute left-2 top-3 text-gray-400">
                <VscSearch />
              </div>
            </div>
          </div>
        </div> */}

        <div className="md:hidden flex flex-row items-center justify-center gap-2">
          <div
            onClick={() => {
              setShowFilters((prev) => !prev)
              setShowSearchBar(false)
            }}
            className="custom-shadow p-3 rounded-lg"
          >
            <IoFilter />
          </div>
          <div
            onClick={() => {
              setShowSearchBar((prev) => !prev)
              setShowFilters(false)
            }}
            className="custom-shadow p-3 rounded-lg"
          >
            <VscSearch />
          </div>
        </div>
      </div>
      <h1 className="my-5 text-xl font-semibold text-[#4A148C]">{tutorsList.length} Mentors Found</h1>
      <div className="lg:block hidden">
        {tutorsList.map((tutor, index) => {
          return <TutorCard key={index} tutor={tutor} />
        })}
      </div>
      <div className="block lg:hidden">
        {tutorsList.map((tutor, index) => {
          return <TutorMobileCard key={index} tutor={tutor} />
        })}
      </div>
    </div>
  )
}

export default TutorListComponent


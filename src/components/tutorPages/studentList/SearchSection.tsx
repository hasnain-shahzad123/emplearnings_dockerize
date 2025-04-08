"use client";
import { active_students } from "@/assets/index";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import CardsSection from "./CardsSection";
import { fetchStudentListOfTutor } from "@/firebase/tutor/dashboard/student_list/fetchStudentListOfTutor";
import { TutorStudentDocumentData } from "@/types";
import { Timestamp } from "firebase/firestore";
import BackBtn from "../personel_info/Commonlayout/BackBtn";
import Spinner from "@/components/shared/spinner/Spinner";

const SearchSection = ({ tutor_uid }: { tutor_uid: string }) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    superCategory: "",
    category: "",
    subCategory: "",
    totalLessons: -1,
    pendingLessons: -1,
    enrolledDate: "",
    progressStatus: "",
  });

  const [filteredData, setFilteredData] = useState<TutorStudentDocumentData[]>(
    []
  );
  const [originalData, setOriginalData] = useState<TutorStudentDocumentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //this is the state to monitor which student is selected
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(-1);

  const getActiveStudents = (students: TutorStudentDocumentData[]): number => {
    const activeStudents = students?.filter(
      (student) => student.pending_lessons > (0 as Number)
    );
    return activeStudents?.length;
  };

  

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchStudentListOfTutor({ tutorId: tutor_uid })
      if (response.type === "success" && response.data) {
        setOriginalData(response.data as TutorStudentDocumentData[]);
        setFilteredData(response.data as TutorStudentDocumentData[]);
        setLoading(true);
      }
      else {
        console.log("Error fetching student list");
        setLoading(true);
      }
    };

    fetchData();
  }, [tutor_uid]);

 

  const handleSearchStudents = useCallback(() => {
    
     if (
       !filters.name &&
       !filters.superCategory &&
       !filters.category &&
       !filters.subCategory &&
       filters.totalLessons === -1 &&
       filters.pendingLessons === -1 &&
       !filters.enrolledDate &&
        (!filters.progressStatus || filters.progressStatus === "all")
     ) {
       setFilteredData(originalData); 
      console.log("originalData",originalData);
       return;
     }
    const filtered = originalData?.filter(
      (student) =>
        student.name
          ?.toLowerCase()
          .includes(filters.name.toLowerCase().trim()) &&
        (filters.superCategory !== ""
          ? student.categories.some((cat) =>
              cat.sup_category
                ?.toLowerCase()
                .includes(filters.superCategory.toLowerCase().trim())
            )
          : true) &&
        (filters.category !== ""
          ? student.categories.some((cat) =>
              cat.category_name
                ?.toLowerCase()
                .includes(filters.category.toLowerCase().trim())
            )
          : true) &&
        (filters.subCategory !== ""
          ? student.categories.some((cat) =>
              cat.sub_category
                ?.toLowerCase()
                .includes(filters.subCategory.toLowerCase().trim())
            )
          : true) &&
        (filters.totalLessons !== -1
          ? student.completed_lessons === filters.totalLessons
          : true) &&
        (filters.pendingLessons !== -1
          ? student.pending_lessons === filters.pendingLessons
          : true) &&
        (filters.enrolledDate !== ""
          ? new Date(student.enrolled_on).toLocaleDateString() ===
            new Date(filters.enrolledDate).toLocaleDateString()
          : true) &&
        (filters.progressStatus !== ""
          ? student.student_status?.toLocaleLowerCase() === filters.progressStatus
          : true)

    );

    setFilteredData(filtered || []);
  }, [filters, filteredData]);
  useEffect(() => {
    handleSearchStudents();
  }, [filters,originalData]);

  // useEffect(() => {
  //   console.log("filteredData", filteredData);
  // }, [filteredData]);

  return (
    <>
      <div className=" p-10 ">
        <div className="max-w-7xl mx-auto">
          <div>
            <BackBtn />
          </div>
          <div className="w-full md:w-[100%] mx-auto p-8 pt-2 rounded-lg mb-1">
            <div className="flex flex-wrap relative lg:flex-nowrap items-center justify-evenly">
              <h1 className="font-semibold text-empoweredFlag text-xl md:text-2xl">
                Search your Students by applying these Filters.
              </h1>

              <div className="border-[1px] lg:mt-0 mt-5 w-full  md:w-[40%] bg-white lg:w-[23%] text-empoweredFlag lg:mr-5  flex items-center gap-2 justify-center px-2 rounded-lg border-[#7A7A7A] ">
                <Image
                  src={active_students.src || "/placeholder.svg"}
                  alt="active students"
                  height={20}
                  width={20}
                  className="h-9 w-9 p-1"
                />
                <h3 className="py-3 font-semibold text-[14px]">
                  Total Students
                </h3>
                <h2 className="py-3 font-semibold text-[20px]">
                  {filteredData?.length}
                </h2>
                {/* <h2 className="py-3 font-semibold text-[20px]">{filteredData.tutorStudentDocumentData.length}</h2> */}
              </div>

              <div className="border-[1px] lg:mt-0 mt-5 w-full md:ml-2 lg:ml-0 md:w-[40%] lg:w-[23%] bg-empoweredFlag  gap-2 flex items-center justify-center px-2 rounded-lg border-[#7A7A7A]">
                <Image
                  src={active_students.src || "/placeholder.svg"}
                  alt="active students"
                  height={20}
                  width={20}
                  className="h-9 w-9 p-1"
                />
                <h3 className="py-3 text-white font-semibold text-[14px]">
                  Active Students
                </h3>
                <h2 className="py-3 font-semibold text-[20px] text-white">
                  {getActiveStudents(
                    filteredData as TutorStudentDocumentData[]
                  )?.toString()}
                </h2>
              </div>
            </div>
            <div className="shadow-even-xl rounded-lg mt-10 bg-white min-h-[200px] max-h-auto">
              <div className="flex items-start py-10 gap-10 px-10 justify-center flex-wrap">
                <div className="relative xs:w-[90%] mx-auto md:mx-0 md:w-auto">
                  <h2 className="bg-white  absolute -top-3 px-2 inline left-2">
                    Name
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) =>
                        setFilters({ ...filters, name: e.target.value })
                      }
                      placeholder="John"
                      className="outline-none text-[#7A7A7A] text-[15px]"
                    />
                  </div>
                </div>

                <div className="relative xs:w-[90%] mx-auto md:mx-0 md:w-auto">
                  <h2 className="bg-white  absolute -top-3 px-2 inline left-2">
                    Super Category
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <input
                      type="text"
                      value={filters.superCategory}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          superCategory: e.target.value,
                        })
                      }
                      placeholder="Academic Tutoring"
                      className="outline-none text-[#7A7A7A] text-[15px]"
                    />
                  </div>
                </div>

                <div className="relative xs:w-[90%] mx-auto md:mx-0 md:w-auto">
                  <h2 className="bg-white  absolute -top-3 px-2 inline left-2">
                    Category
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <input
                      type="text"
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      placeholder="Bio Chemistry"
                      className="outline-none text-[#7A7A7A] text-[15px]"
                    />
                  </div>
                </div>

                <div className="relative xs:w-[90%] mx-auto md:mx-0 md:w-auto">
                  <h2 className="bg-white  absolute -top-3 px-2 inline left-2">
                    Sub Category
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <input
                      type="text"
                      value={filters.subCategory}
                      onChange={(e) =>
                        setFilters({ ...filters, subCategory: e.target.value })
                      }
                      placeholder="Pharmacology"
                      className="outline-none text-[#7A7A7A] text-[15px]"
                    />
                  </div>
                </div>

                <div className="relative w-[90%] mx-auto md:mx-0 md:w-[20%]">
                  <h2 className="bg-white  absolute -top-3 px-2 inline left-2">
                    Total Lessons
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <select
                      className="outline-none text-[#7A7A7A] text-[15px] w-full bg-white"
                      value={filters.totalLessons}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          totalLessons: Number(e.target.value),
                        })
                      }
                    >
                      {Array.from({ length: 15 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                      <option value="15+">15+</option>
                    </select>
                  </div>
                </div>

                <div className="relative w-[90%] mx-auto md:mx-0 md:w-[20%]">
                  <h2 className="bg-white  absolute -top-3 px-2 inline left-2">
                    Pending Lesson
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <select
                      className="outline-none text-[#7A7A7A] text-[15px] w-full bg-white"
                      value={filters.pendingLessons}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pendingLessons: Number(e.target.value),
                        })
                      }
                    >
                      {Array.from({ length: 15 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                      <option value="15+">15+</option>
                    </select>
                  </div>
                </div>

                <div className="relative w-[90%] mx-auto md:mx-0 md:w-auto">
                  <h2 className="bg-white  absolute -top-3 px-2 inline left-2">
                    Enrolled Date
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <input
                      type="Date"
                      value={filters.enrolledDate}
                      onChange={(e) =>
                        setFilters({ ...filters, enrolledDate: e.target.value })
                      }
                      className="outline-none text-[#7A7A7A] text-[15px]"
                    />
                  </div>
                </div>

                <div className="relative w-[90%] mx-auto md:mx-0 md:w-auto">
                  <h2 className="bg-white absolute -top-3 px-2 inline left-2">
                    Progress Status
                  </h2>
                  <div className="border-[1px] p-2 rounded-md border-black">
                    <select
                      className="outline-none text-[#7A7A7A] text-[15px] w-full bg-white"
                      defaultValue="all"
                      value={filters.progressStatus}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          progressStatus: e.target.value,
                        })
                      }
                    >
                      <option value="all">All</option>
                      <option value="needs improvement">
                        Needs Improvement
                      </option>
                      <option value="improving">Improving</option>
                      <option value="good">Good</option>
                      <option value="excellent">Excellent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="mx-10 mb-7 font-semibold text-2xl text-empoweredFlag">
            {filteredData?.length} Students Found
          </h1>
          {!loading && <Spinner />}
          {loading && filteredData?.length <= 0 ? (
            <h1 className="text-center text-empoweredFlag text-2xl font-semibold mt-5">
              No Student Found
            </h1>
          ) : (
            filteredData.map((student, key) => (
              <div className="bg-[#F1F1FF]" key={key}>
                <CardsSection cardKey={key} student={student} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
export default SearchSection;

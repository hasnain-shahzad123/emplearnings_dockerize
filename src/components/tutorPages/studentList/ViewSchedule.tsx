"use client";

import {
  cross_icon,
  clock_icon,
  More,
  complete_lesson,
  review_star,
  faded_star,
} from "@/assets/index";
import deleteCalendarEvent from "@/services/googleCalendar/deleteCalendarEventService";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import type { TutorStudentDocumentData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { useTutor } from "@/contexts/TutorContext";
import MeetingRescheduler from "./MeetingRescheduler";
import { firestore } from "@/firebase/firebaseConfig";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

interface ViewScheduleProps {
  onCloseModal: () => void;
  student: TutorStudentDocumentData;
}

const ViewSchedule = ({ onCloseModal, student }: ViewScheduleProps) => {
  const { tutor } = useTutor();
  const [showMore, setShowMore] = useState<boolean>(false)
  const [showMoreIndex, setShowMoreIndex] = useState<number>(-1)
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [eventToBeRescheduled, setEventToBeRescheduled] =
    useState<string>("");
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Not scheduled";

    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);

    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Filter lessons into pending and completed
  const pendingLessons =
    student.lessons?.filter((lesson) => lesson.lesson_status === "pending") ||
    [];
  const completedLessons =
    student.lessons?.filter((lesson) => lesson.lesson_status === "completed") ||
    [];

  const cancelledLessons =
    student.lessons?.filter((lesson) => lesson.lesson_status === "cancelled") ||
    [];

  const reScheduledLessons =
    student.lessons?.filter(
      (lesson) => lesson.lesson_status === "rescheduled"
    ) || [];


  const handleDeleteEvent = async (eventId: string) => {
    // setPopupPosition(null);
    try {
      const response = await deleteCalendarEvent({
        uid: tutor?.uid || "",
        eventId,
      });

      const ref = doc(firestore, "TUTORS/" + tutor?.uid + "/TUTOR_STUDENTS/" + student.student_uid + "/LESSONS/" + eventId);
      await updateDoc(ref, { lesson_status: "cancelled" });


      // console.log("Delete res: ", response);
      if (response.type === "success") {
        // await refreshEvents();
      } else {
        alert("an error occurred while deleting event");
      }
    } catch (e) {
      alert("an error occurred while deleting event");
      console.error(e);
    }
  };
  const handleRescheduleEvent = async (eventId: string) => {
    setIsRescheduling(true);
    setEventToBeRescheduled(eventId);
  };

  return (
    <>
      <div className="flex border-b-[1px] items-center justify-between px-5 py-3">
        <div>
          <h1 className="text-xl text-empoweredFlag py-3 font-semibold">
            Your lessons with {student.name}
          </h1>
        </div>
        <button onClick={onCloseModal}>
          <Image
            src={cross_icon.src || "/placeholder.svg"}
            alt="cross"
            width={30}
            height={30}
            className="w-8 h-8 hover:scale-110 transition-all duration-300"
          />
        </button>
      </div>

      {/* Pending lessons section */}
      {pendingLessons.length > 0 && (
        <div>
          <h1 className="px-5 py-5 text-xl font-semibold text-empoweredFlag">
            Pending lessons
          </h1>

          <div className="flex flex-col px-5">
            <div className="grid grid-cols-8 text-[14px] font-semibold text-[#7A7A7A] rounded-md py-3 border-b-[1px] border-[#D9D9D9]">
              <div>Category</div>
              <div>Sub Category</div>
              <div>Date</div>
              <div>Start Time</div>
              <div>End Time</div>
              <div>Join Lesson</div>
              <div>Reschedule</div>
              <div>Cancel Lesson</div>
            </div>
            {pendingLessons.map((lesson, index) => (
              <div
                key={`pending-${index}`}
                className="grid grid-cols-8 my-1 text-[13px] bg-[#F1F1FF] items-center rounded-md px-2 py-3 border-[1px] border-[#D9D9D9]"
              >
                <div>
                  <h1 className="font-semibold">
                    {lesson.category.sup_category}
                  </h1>
                  <h1>{lesson.category.category_name}</h1>
                </div>

                <div className="font-semibold">
                  {lesson.category.sub_category}
                </div>
                <div>
                  <p className="font-semibold">{formatDate(lesson.time)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Image
                    src={clock_icon.src || "/placeholder.svg"}
                    alt="clock"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />

                  <p className="font-semibold">
                    {lesson.time.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Image
                    src={clock_icon.src || "/placeholder.svg"}
                    alt="clock"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />

                  <p className="font-semibold">
                    {new Date(
                      lesson.time.toDate().getTime() + lesson.duration * 60000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <a
                  href={lesson.meeting_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:font-semibold truncate max-w-[200px] text-blue-600"
                >
                  {lesson.meeting_link
                    ? "Join lesson"
                    : "No meeting link available"}
                </a>
                <button
                  onClick={() => handleRescheduleEvent(lesson.uid)}
                  rel="noopener noreferrer"
                  className="text-sm hover:font-semibold truncate max-w-[200px] text-blue-600"
                >
                  {lesson.meeting_link
                    ? "reschedule lesson"
                    : "No meeting link available"}
                </button>
                <button
                  onClick={() => handleDeleteEvent(lesson.uid)}
                  rel="noopener noreferrer"
                  className="text-sm hover:font-semibold transition-all ease-in-out duration-600 truncate max-w-[200px] text-blue-600"
                >
                  Cancel Lesson
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed lessons section */}
      {completedLessons.length > 0 && (
        <div>
          <h1 className="px-5 py-5  text-xl font-semibold text-empoweredFlag">
            Completed lessons
          </h1>
          <div className="flex flex-col gap-3 px-5">
            <div className="grid grid-cols-7 px-3 text-[14px] font-semibold text-[#7A7A7A] rounded-md py-3 border-b-[1px] border-[#D9D9D9]">
              <div>Category</div>
              <div>Sub Category</div>
              <div>Date</div>
              <div>Start Time</div>
              <div>End Time</div>
              <div>More</div>
            </div>
            {completedLessons.map((lesson, index) => (
              <div className="bg-[#F1F1FF] py-3 border-[1px] border-[#D9D9D9]" key={index}>
                <div
                  key={`completed-${index}`}
                  className="grid text-[14px]  grid-cols-7  rounded-md  items-center px-3 "
                >
                  <div>
                    <h1 className="font-semibold">
                      {lesson.category.sup_category}
                    </h1>
                    <h1>{lesson.category.category_name}</h1>
                  </div>
                  <div>
                    <h1 className="font-semibold">
                      {lesson.category.sub_category}
                    </h1>
                  </div>
                  <div>
                    <p className="font-semibold">{formatDate(lesson.time)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src={clock_icon.src || "/placeholder.svg"}
                      alt="clock"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <p className="text-sm">
                      {lesson.time.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src={clock_icon.src || "/placeholder.svg"}
                      alt="clock"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <p className="text-sm">
                      {new Date(
                        lesson.time.toDate().getTime() + lesson.duration * 60000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  
                  <div className="inline">
                    <button
                      onClick={() => {
                        setShowMore(!showMore);
                        setShowMoreIndex(index);
                      }}
                    >
                      <Image
                        src={More.src || "/placeholder.svg"}
                        alt="more"
                        width={20}
                        height={20}
                        className={`w-5 h-5 ${showMore && showMoreIndex === index
                          ? "rotate-90 transition-all duration-300 "
                          : "transition-all duration-300"
                          }`}
                      />
                    </button>
                  </div>
                </div>
                <div
                  className={`${showMore && index === showMoreIndex
                    ? "opacity-100 max-h-[500px] transition-all duration-300 "
                    : "opacity-0 max-h-0 overflow-hidden transition-all duration-300"
                    } `}
                >
                  {/* here your review will came  */}
                  <div className="bg-white rounded-lg border-[1px] border-[#DDDDDD] mx-10 my-3">
                    <div className="w-[90%] mx-auto relative">
                      <h1 className="relative bg-white inline px-4 left-[10px] font-semibold top-[30px]">
                        Your Review
                      </h1>
                      {/* Stars positioned inside the textarea */}

                      <div className="flex flex-col gap-1 pointer-events-none  text-lg my-5 border-[2px] border-empoweredFlag p-5 rounded-lg">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            // here 2 will be changed with the rating from db
                            <Image key={i}
                              src={
                                i < 2
                                  ? review_star.src || "/placeholder.svg"
                                  : faded_star.src || "/placeholder.svg"
                              }
                              alt="star"
                              width={20}
                              height={20}
                              className={`w-7 h-7`}
                            />
                          ))}
                        </div>
                        <h1 className="text-[16px] text-[#7A7A7A]">
                          Alex Hales is a brilliant and exceptional student with
                          a passion for academic excellence. Known for his
                          dedication and hard work, Alex consistently achieves
                          remarkable results in his studies. He has a keen
                          interest in Biochemistry and excels in subjects like
                          Pharmacology, showcasing his analytical and
                          problem-solving skills.
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border-[1px] border-[#DDDDDD] mx-10 my-3">
                    <div className="w-[90%] mx-auto relative">
                      <h1 className="relative bg-white inline px-4 left-[10px] font-semibold top-[30px]">
                        Lesson Note
                      </h1>
                      {/* Stars positioned inside the textarea */}

                      <div className="flex flex-col gap-1 pointer-events-none  text-lg my-5 border-[2px] border-empoweredFlag p-5 rounded-lg">
                        <h1 className="text-[16px] text-[#7A7A7A]">
                          Alex Hales is a brilliant and exceptional student with
                          a passion for academic excellence. Known for his
                          dedication and hard work, Alex consistently achieves
                          remarkable results in his studies. He has a keen
                          interest in Biochemistry and excels in subjects like
                          Pharmacology, showcasing his analytical and
                          problem-solving skills.
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed lessons section */}
      {cancelledLessons.length > 0 && (
        <div>
          <h1 className="px-5 py-5  text-xl font-semibold text-empoweredFlag">
            Cancelled lessons
          </h1>
          <div className="flex flex-col gap-3 px-5">
            <div className="grid grid-cols-7 px-3 text-[14px] font-semibold text-[#7A7A7A] rounded-md py-3 border-b-[1px] border-[#D9D9D9]">
              <div>Category</div>
              <div>Sub Category</div>
              <div>Date</div>
              <div>Start Time</div>
              <div>End Time</div>
              <div>More</div>
            </div>
            {cancelledLessons.map((lesson, index) => (
              <div className="bg-[#F1F1FF] py-3 border-[1px] border-[#D9D9D9]" key={index}>
                <div
                  key={`completed-${index}`}
                  className="grid text-[14px]  grid-cols-7  rounded-md  items-center px-3 "
                >
                  <div>
                    <h1 className="font-semibold">
                      {lesson.category.sup_category}
                    </h1>
                    <h1>{lesson.category.category_name}</h1>
                  </div>
                  <div>
                    <h1 className="font-semibold">
                      {lesson.category.sub_category}
                    </h1>
                  </div>
                  <div>
                    <p className="font-semibold">{formatDate(lesson.time)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src={clock_icon.src || "/placeholder.svg"}
                      alt="clock"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <p className="text-sm">
                      {lesson.time.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src={clock_icon.src || "/placeholder.svg"}
                      alt="clock"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <p className="text-sm">
                      {new Date(
                        lesson.time.toDate().getTime() + lesson.duration * 60000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {/* <div>
                    <Image
                      src={complete_lesson.src || "/placeholder.svg"}
                      alt="completed"
                      width={20}
                      height={20}
                      className="w-5 h-5 mx-4"
                    />
                  </div> */}
                  <div className="inline">
                    <button
                      onClick={() => {
                        setShowMore(!showMore);
                        setShowMoreIndex(index);
                      }}
                    >
                      <Image
                        src={More.src || "/placeholder.svg"}
                        alt="more"
                        width={20}
                        height={20}
                        className={`w-5 h-5 ${showMore && showMoreIndex === index
                          ? "rotate-90 transition-all duration-300 "
                          : "transition-all duration-300"
                          }`}
                      />
                    </button>
                  </div>
                </div>
                <div
                  className={`${showMore && index === showMoreIndex
                    ? "opacity-100 max-h-[500px] transition-all duration-300 "
                    : "opacity-0 max-h-0 overflow-hidden transition-all duration-300"
                    } `}
                >
                  {/* here your review will came  */}
                  <div className="bg-white rounded-lg border-[1px] border-[#DDDDDD] mx-10 my-3">
                    <div className="w-[90%] mx-auto relative">
                      <h1 className="relative bg-white inline px-4 left-[10px] font-semibold top-[30px]">
                        Your Review
                      </h1>
                      {/* Stars positioned inside the textarea */}

                      <div className="flex flex-col gap-1 pointer-events-none  text-lg my-5 border-[2px] border-empoweredFlag p-5 rounded-lg">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            // here 2 will be changed with the rating from db
                            <Image key={i}
                              src={
                                i < 2
                                  ? review_star.src || "/placeholder.svg"
                                  : faded_star.src || "/placeholder.svg"
                              }
                              alt="star"
                              width={20}
                              height={20}
                              className={`w-7 h-7`}
                            />
                          ))}
                        </div>
                        <h1 className="text-[16px] text-[#7A7A7A]">
                          Alex Hales is a brilliant and exceptional student with
                          a passion for academic excellence. Known for his
                          dedication and hard work, Alex consistently achieves
                          remarkable results in his studies. He has a keen
                          interest in Biochemistry and excels in subjects like
                          Pharmacology, showcasing his analytical and
                          problem-solving skills.
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border-[1px] border-[#DDDDDD] mx-10 my-3">
                    <div className="w-[90%] mx-auto relative">
                      <h1 className="relative bg-white inline px-4 left-[10px] font-semibold top-[30px]">
                        Lesson Note
                      </h1>
                      {/* Stars positioned inside the textarea */}

                      <div className="flex flex-col gap-1 pointer-events-none  text-lg my-5 border-[2px] border-empoweredFlag p-5 rounded-lg">
                        <h1 className="text-[16px] text-[#7A7A7A]">
                          Alex Hales is a brilliant and exceptional student with
                          a passion for academic excellence. Known for his
                          dedication and hard work, Alex consistently achieves
                          remarkable results in his studies. He has a keen
                          interest in Biochemistry and excels in subjects like
                          Pharmacology, showcasing his analytical and
                          problem-solving skills.
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rescheduled lessons section */}
      {reScheduledLessons.length > 0 && (
        <div>
          <h1 className="px-5 py-5 text-xl font-semibold text-empoweredFlag">
            Rescheduled Lessons
          </h1>
          <div className="flex flex-col gap-3 px-5">
            {reScheduledLessons.map((lesson, index) => (
              <>
                <div
                  key={`completed-${index}`}
                  className="flex bg-[#F1F1FF] rounded-md justify-between items-center px-5 py-3 border-[1px] border-[#D9D9D9]"
                >
                  <div>
                    <h1 className="text-sm font-semibold">
                      {lesson.category.sup_category}
                    </h1>
                    <h1 className="text-sm font-semibold">
                      {lesson.category.category_name}
                    </h1>
                  </div>

                  <h1 className="text-sm font-semibold">
                    {lesson.category.sub_category}
                  </h1>
                  <div className="flex items-center gap-3">
                    <Image
                      src={clock_icon.src || "/placeholder.svg"}
                      alt="clock"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />

                    <p className="text-sm">
                      {lesson.time.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm">
                      {new Date(
                        lesson.time.toDate().getTime() + lesson.duration * 60000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <h1 className="text-sm">{lesson.lesson_status}</h1>
                  </div>
                </div>
                <div></div>
              </>
            ))}
          </div>
        </div>
      )}

      {/* Show message if no lessons */}
      {(!student.lessons || student.lessons.length === 0) && (
        <div className="px-5 py-10 text-center">
          <p className="text-gray-500">No lessons scheduled yet.</p>
        </div>
      )}
      {isRescheduling && (
        <div className="inset-0 flex items-center justify-center bg-black bg-opacity-20 z-20">
          <MeetingRescheduler
            uid={tutor?.uid || ""}
            isVisible={isRescheduling}
            setIsVisible={setIsRescheduling}
            eventId={eventToBeRescheduled}
          />
        </div>
      )}
    </>
  );
};

export default ViewSchedule;

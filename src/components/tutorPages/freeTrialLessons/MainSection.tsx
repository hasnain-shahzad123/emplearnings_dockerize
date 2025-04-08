import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { caret_next, caret_prev } from "@/assets/index";
import AddSlotModal from "./AddSlotModal";
import { FaX } from "react-icons/fa6";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import {
  video_meet,
  clock_icon,
  join_meet,
  reschedule_meet,
  cancel_meet,
} from "@/assets/index";
import { useAlert } from "@/contexts/AlertContext";
import { Event, TutorTrialLessonScheduleDataType } from "@/types";
import fetchTutorFreeTrialLessonSlots from "@/firebase/tutor/trial-lessons/getTutorTrialLessonScheduleFromDB";
import updateFreeTrialLessonSlots from "@/firebase/tutor/trial-lessons/updateTutorTrialLessonScheduleToDB";
import getTutorTrialLessonScheduleFromDB from "@/firebase/tutor/trial-lessons/getTutorTrialLessonScheduleFromDB";
import addTutorTrialLessonScheduleToDB from "@/firebase/tutor/trial-lessons/addTutorTrialLessonScheduleToDB";
import deleteTutorTrialLessonScheduleFromDB from "@/firebase/tutor/trial-lessons/deleteTutorTrialLessonScheduleFromDB";
import updateTutorTrialLessonScheduleToDB from "@/firebase/tutor/trial-lessons/updateTutorTrialLessonScheduleToDB";

type Schedule = {
  [key: string]: string[];
};

interface trialTypes {
  number: number;
  day: string;
  badge: number;
}

// Updated day mapping to start from Monday
const dayMapping = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MainSection = ({
  tutorId,
  trialLessons,
  isLoading,
}: {
  tutorId: string;
  trialLessons: Event[];
  isLoading: boolean;
}) => {
  const { showAlert } = useAlert();
  // States for navigation and views
  const [underlineNavigation, setUnderlineNavigation] = useState<number>(1);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [showFirstWeek, setShowFirstWeek] = useState(true);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [showSecondWeek, setShowSecondWeek] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [editDay, setEditDay] =
    useState<keyof TutorTrialLessonScheduleDataType["week_one"]>("Mon");
  const [editTimeIdx, setEditTimeIdx] = useState<number>();
  const [schedule, setSchedule] = useState<TutorTrialLessonScheduleDataType>({
    week_one: {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    },
  });

  // Modify getWeekDates to start from Monday
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    // Adjust to previous Monday
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const prepareTimeSlots = useCallback(() => {
    // Ensure order from Monday to Sunday
    return {
      Mon: schedule.week_one["Mon"] || [],
      Tue: schedule.week_one["Tue"] || [],
      Wed: schedule.week_one["Wed"] || [],
      Thu: schedule.week_one["Thu"] || [],
      Fri: schedule.week_one["Fri"] || [],
      Sat: schedule.week_one["Sat"] || [],
      Sun: schedule.week_one["Sun"] || [],
    };
  }, [schedule]);

  const [firstWeekDates, setFirstWeekDates] = useState(
    getWeekDates(currentWeekStart)
  );
  const [secondWeekDates, setSecondWeekDates] = useState(() => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    return getWeekDates(nextWeekStart);
  });

  // Update trials to match Monday-Sunday order
  const [trials, setTrials] = useState<trialTypes[]>([
    { number: 1, day: "Monday", badge: 0 },
    { number: 2, day: "Tuesday", badge: 0 },
    { number: 3, day: "Wednesday", badge: 0 },
    { number: 4, day: "Thursday", badge: 0 },
    { number: 5, day: "Friday", badge: 0 },
    { number: 6, day: "Saturday", badge: 0 },
    { number: 7, day: "Sunday", badge: 0 },
  ]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const result = await getTutorTrialLessonScheduleFromDB({ uid: tutorId });
      if (result.type === "success" && result.TrialLessonScheduleData) {
        console.log("Result", result.TrialLessonScheduleData);
        setSchedule(result.TrialLessonScheduleData);
      } else {
        console.log(result.TrialLessonScheduleData);
        alert(result.message);
      }
    };

    fetchTimeSlots();
  }, []);

  // Update badges based on events with new day mapping
  useEffect(() => {
    if (trialLessons?.length) {
      const organized = {
        Mon: [] as Event[],
        Tue: [] as Event[],
        Wed: [] as Event[],
        Thu: [] as Event[],
        Fri: [] as Event[],
        Sat: [] as Event[],
        Sun: [] as Event[],
      };

      trialLessons.forEach((lesson) => {
        const date = new Date(lesson.startTime);
        const day = dayMapping[date.getDay() === 0 ? 6 : date.getDay() - 1];
        organized[day as keyof typeof organized].push(lesson);
      });

      setTrials((prevTrials) =>
        prevTrials.map((trial) => ({
          ...trial,
          badge:
            organized[trial.day.slice(0, 3) as keyof typeof organized]
              ?.length || 0,
        }))
      );
    }
  }, [trialLessons]);

  // Time slot management functions
  type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

  const addSlot = useCallback(
    async (
      day: keyof TutorTrialLessonScheduleDataType["week_one"],
      time: string[]
    ) => {
      // Rest of the function remains the same
      const updatedSchedule = { ...schedule };
      time.forEach((t: string) => {
        if (!updatedSchedule.week_one[day]) {
          updatedSchedule.week_one[day] = [];
        }
        updatedSchedule.week_one[day].push(t);
      });
      console.log("day :", day + "time : ", time);
      console.log("schedule is : ", schedule);
      const response = await addTutorTrialLessonScheduleToDB({
        uid: tutorId,
        lesson_schedule: { day: day, time: time },
        schedule,
      });
      if (response.type === "error") {
        alert(response.message);
        return;
      }

      setSchedule(
        response.TrialLessonScheduleData as TutorTrialLessonScheduleDataType
      );
    },
    [tutorId, schedule]
  );

  const updateSlot = useCallback(
    async (
      day: keyof TutorTrialLessonScheduleDataType["week_one"],
      index: number,
      newTime: string
    ) => {
      const updatedSchedule = { ...schedule };
      updatedSchedule.week_one[day][index] = newTime;
      setSchedule(updatedSchedule);

      try {
        const response = await updateTutorTrialLessonScheduleToDB({
          uid: tutorId,
          lesson_schedule: { day: day, lesson_index: index, time: newTime },
          schedule,
        });
        if (response.type === "error") {
          alert(response.message);
          return;
        }
        setSchedule(
          response.TrialLessonScheduleData as TutorTrialLessonScheduleDataType
        );
      } catch (error) {
        console.error("Error updating slot:", error);
        alert("Failed to update time slot");
      }
    },
    [schedule, tutorId]
  );

  const removeSlot = useCallback(
    async (
      day: keyof TutorTrialLessonScheduleDataType["week_one"],
      index: number
    ) => {
      console.log("The day is:", day);
      console.log("The index is:", index);

      const updatedSchedule = {
        ...schedule,
        week_one: { ...schedule.week_one },
      };

      updatedSchedule.week_one[day] = [...updatedSchedule.week_one[day]];

      updatedSchedule.week_one[day].splice(index, 1);

      try {
        const response = await deleteTutorTrialLessonScheduleFromDB({
          uid: tutorId,
          lesson_schedule: { day, lesson_index: index },
          schedule,
        });

        if (response.type === "error") {
          alert(response.message);
          return;
        }

        setSchedule(
          response.TrialLessonScheduleData as TutorTrialLessonScheduleDataType
        );
      } catch (error) {
        console.error("Error removing slot:", error);
        alert("Failed to remove time slot");
      }
    },
    [schedule, tutorId]
  );
  const handleSetTimeSlot = useCallback(() => {
    if (showTimeSlotModal) {
      document.body.style.overflow = "auto";
      setShowTimeSlotModal(false);
      setEditDay("Sun");
      setEditTimeIdx(undefined);
    } else {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      document.body.style.overflow = "hidden";
      setShowTimeSlotModal(true);
    }
  }, [showTimeSlotModal]);

  const handleEditDayAndTimeIdx = useCallback(
    (day: string, Tindex: number) => {
      setEditDay(day as keyof TutorTrialLessonScheduleDataType["week_one"]);
      setEditTimeIdx(Tindex);
      handleSetTimeSlot();
    },
    [handleSetTimeSlot]
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getEventsForDate = useCallback(
    (date: Date) => {
      if (!trialLessons) return [];
      return trialLessons.filter((event) => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === date.toDateString();
      });
    },
    [trialLessons]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      const events = getEventsForDate(date);
      setSelectedDayEvents(events);
      if (selectedDayEvents.length !== 0) {
        setShowEventsModal(true);
        document.body.style.overflow = "hidden";
      }
    },
    [getEventsForDate, selectedDayEvents]
  );

  return (
    <section>
      <div className="flex justify-evenly mb-8">
        <button onClick={() => setUnderlineNavigation(1)}>
          <h2
            className={`font-semibold text-empoweredFlag text-2xl ${
              underlineNavigation === 1
                ? "underline underline-offset-8 decoration-4"
                : ""
            }`}
          >
            {" "}
            Scheduled Trial Lessons{" "}
          </h2>
        </button>
        <button onClick={() => setUnderlineNavigation(2)}>
          <h2
            className={`font-semibold text-empoweredFlag text-2xl ${
              underlineNavigation === 2
                ? "underline underline-offset-8 decoration-4"
                : ""
            }`}
          >
            {" "}
            Manage Available Time Slots{" "}
          </h2>
        </button>
      </div>
      {underlineNavigation === 1 ? (
        <div className="mt-10 pb-10 shadow-even-xl w-[60%] px-10 mx-auto rounded-2xl">
          <h1 className="font-semibold text-2xl pt-5 text-empoweredFlag">
            {" "}
            Scheduled Trials{" "}
          </h1>
          <div className="flex items-center py-5 justify-between">
            <div className="flex gap-10">
              <h1>
                {formatDate(
                  showFirstWeek ? firstWeekDates[0] : secondWeekDates[0]
                )}
              </h1>
              <div className="border-[3px] mt-1 border-empoweredFlag rotate-90"></div>
              <h1>
                {formatDate(
                  showFirstWeek ? firstWeekDates[6] : secondWeekDates[6]
                )}
              </h1>
            </div>
            {/* <div className="flex gap-5">
              <button  className={showFirstWeek ? "cursor-not-allowed opacity-40" : ""} onClick={() => {
                !showFirstWeek && setShowFirstWeek(true)
              }
              }>
                <Image src={caret_prev.src} alt="caret-prev" height={20} width={20} className="h-8 w-8 md:h-10 md:w-10" />
              </button>
              <button className={!showFirstWeek ? "cursor-not-allowed opacity-40" : ""} onClick={() => showFirstWeek && setShowFirstWeek(false)} >
                <Image src={caret_next.src} alt="caret-next" height={20} width={20} className="h-8 w-8 md:h-10 md:w-10" />
              </button>
            </div> */}
          </div>
          <div className="w-[90%] mx-auto py-5 rounded-xl border-[1px] border-black">
            <div className="flex justify-center flex-wrap gap-10 items-center">
              {(showFirstWeek ? firstWeekDates : secondWeekDates).map(
                (date, index) => {
                  const events = getEventsForDate(date);
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDayClick(date)}
                      className="border-[1px] w-[25%] rounded-lg p-3 flex items-center flex-col border-black"
                    >
                      <h3>{index + 1}</h3>
                      <h2>
                        {date.toLocaleDateString("en-US", { weekday: "long" })}
                      </h2>
                      <h3 className="bg-empoweredFlag text-white mt-2 p-1 px-3 rounded-full">
                        {" "}
                        {events.length}{" "}
                      </h3>
                    </button>
                  );
                }
              )}
            </div>
          </div>
          {showEventsModal && selectedDayEvents.length !== 0 && (
            <div className="fixed inset-0 w-[300px] top-1/2 h-[50px] mx-auto flex justify-center items-center">
              <div className="absolute flex flex-col min-h-[50px] max-h-[400px] overflow-auto">
                <div className="flex justify-end mb-2">
                  <button
                    className={`p-2 bg-black hover:bg-empoweredFlag rounded-full`}
                    onClick={() => {
                      document.body.style.overflow = "auto";
                      setShowEventsModal(false);
                    }}
                  >
                    <FaX className="text-white font-semibold h-5 w-5" />
                  </button>
                </div>
                {selectedDayEvents.map((event, index) => (
                  <div
                    key={index}
                    className="mb-3 bg-white p-2 w-[300px] rounded-lg border-[1px] border-[#D9D9D9]"
                  >
                    <h1 className="text-[12px] font-semibold">
                      {event.summary}
                    </h1>
                    <div className="flex gap-2 mt-2">
                      <Image
                        src={clock_icon.src}
                        alt="clock"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <div>
                        {new Date(event.startTime).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Image
                        src={video_meet.src}
                        alt="video-meet"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        {event.meetingLink}{" "}
                      </a>
                    </div>
                    <div className="flex flex-wrap text-[7px] mt-4 text-white justify-evenly">
                      <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                        <a
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1"
                        >
                          <Image
                            src={join_meet.src}
                            alt="join-meet"
                            width={20}
                            height={20}
                            className="h-3 w-3"
                          />
                          <span>Join Meeting</span>
                        </a>
                      </div>
                      <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                        <button className="flex flex-col items-center gap-1">
                          <Image
                            src={reschedule_meet.src}
                            alt="reschedule-meet"
                            width={20}
                            height={20}
                            className="h-3 w-3"
                          />
                          <span>Reschedule</span>
                        </button>
                      </div>
                      <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                        <button className="flex flex-col items-center gap-1">
                          <Image
                            src={cancel_meet.src}
                            alt="cancel-meet"
                            width={20}
                            height={20}
                            className="h-3 w-3"
                          />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-end pr-10 mt-10">
            <CustomButton
              onclickEvent={handleSetTimeSlot}
              text="Add Time Slot"
              className="bg-empoweredFlag px-5 md:px-8 py-2 rounded-full text-white md:mr-10 mt-5"
            />
          </div>
          <div className="grid grid-cols-7 gap-4 mt-10 md:px-10 text-[15px] md:text-2xl">
            {/* Explicitly map in Monday to Sunday order */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const slots =
                schedule.week_one[day as keyof typeof schedule.week_one];
              return (
                <div key={day} className="flex flex-col items-center">
                  <h1 className="mb-4">{day}</h1>
                  {slots &&
                    slots.map((slot, index) => (
                      <button
                        key={slot}
                        onClick={() => handleEditDayAndTimeIdx(day, index)}
                        className="bg-[#EEEEEE] mt-3 text-[10px] md:text-[15px] border-[#D9D9D9] py-1 px-1 xss:px-2 md:px-4 lg:px-6 rounded-xl border-[1px] hover:bg-[#d9d9d9]"
                      >
                        {slot}
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
          {showTimeSlotModal && (
            <AddSlotModal
              schedule={schedule.week_one}
              handelTimeSlotModal={handleSetTimeSlot}
              addSlot={addSlot}
              updateSlot={updateSlot}
              removeSlot={removeSlot}
              editDay={editDay}
              editTimeIndex={editTimeIdx}
            />
          )}
        </>
      )}
    </section>
  );
};

export default MainSection;

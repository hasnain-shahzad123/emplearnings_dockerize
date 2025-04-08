"use client";
import { useState, useEffect } from "react";
import ScheduleWeek from "./ScheduleWeek";
import getTutorLessonScheduleFromDB from "@/firebase/tutor/dashboard/lesson_schedule/getTutorLessonScheduleFromDB";
import { TutorLessonScheduleDataType } from "@/types";
import Spinner from "@/components/shared/spinner/Spinner";
import getTutorTrialLessonScheduleFromDB from "@/firebase/tutor/trial-lessons/getTutorTrialLessonScheduleFromDB";

type Schedule = {
  [key: string]: string[];
};

interface Props {
  tutorId: string;
}

const MySchedule = ({ tutorId }: Props) => {
  const [week, setWeek] = useState<"week_one" | "week_two">("week_one");
  const [divNumber, setDivNumber] = useState<number>(1);
  const [regularSchedule, setRegularSchedule] = useState<{
    week_one: Schedule;
    week_two: Schedule;
  }>({
    week_one: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] },
    week_two: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] },
  });
  const [trialSchedule, setTrialSchedule] = useState<{
    week_one: Schedule;
  }>({
    week_one: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] },
  });

  const defaultSchedule = {
    week_one: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] },
    week_two: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] },
  };

  const defaultTrialSchedule = {
    week_one: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] },
  };

  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [editDay, setEditDay] = useState<string>("");
  const [editTimeIdx, setEditTimeIdx] = useState<number>();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (initialLoading) setIsLoading(true);
        const regularResponse = await getTutorLessonScheduleFromDB({
          uid: tutorId,
        });
        const trialResponse = await getTutorTrialLessonScheduleFromDB({
          uid: tutorId,
        });

        if (
          regularResponse.type === "success" &&
          regularResponse.LessonScheduleData
        ) {
          setRegularSchedule(regularResponse.LessonScheduleData);
        }

        if (
          trialResponse.type === "success" &&
          trialResponse.TrialLessonScheduleData
        ) {
          setTrialSchedule(trialResponse.TrialLessonScheduleData);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        // Set default schedules on error
        setRegularSchedule(defaultSchedule);
        setTrialSchedule(defaultTrialSchedule);
      } finally {
        setIsLoading(false);
        setInitialLoading(false);
      }
    };

    fetchSchedules();
  }, [tutorId, setRegularSchedule, setTrialSchedule]);

  const handleEditDayAndTimeIdx = (day: string, Tindex: number) => {
    setEditDay(day);
    setEditTimeIdx(Tindex);
    handleSetTimeSlot();
  };

  const handleWeekChange = () => {
    setWeek(week === "week_one" ? "week_two" : "week_one");
  };

  const handleSetTimeSlot = () => {
    if (showTimeSlotModal) {
      document.body.style.overflow = "auto";
      setShowTimeSlotModal(false);
      setEditDay("");
      setEditTimeIdx(undefined);
    } else {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      document.body.style.overflow = "hidden";
      setShowTimeSlotModal(true);
    }
  };

  return (
    <div className="mt-10">
      <h1 className="font-bold text-2xl text-[#4A148C] my-3">My Schedule</h1>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center justify-center gap-[18%] text-black text-xl font-semibold mt-[4%]">
            <div>
              <button
                onClick={() => {
                  setDivNumber(1);
                }}
                className={`transition-all duration-300 ${
                  divNumber === 1
                    ? "border-b-4 border-empoweredFlag text-empoweredFlag"
                    : "border-none text-black"
                }`}
              >
                50-min lesson
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setDivNumber(2);
                }}
                className={`transition-all duration-300 ${
                  divNumber === 2
                    ? "border-b-4 border-empoweredFlag text-empoweredFlag"
                    : "border-none text-black"
                }`}
              >
                Free trial lesson
              </button>
            </div>
          </div>
          {divNumber === 2 &&
          Object.values(trialSchedule[week as "week_one"] || {}).every(
            (day) => day.length === 0
          ) ? (
            <div className="text-center text-gray-500 mt-[6%]">
              The mentor has not set a schedule for free trial lessons yet.
            </div>
          ) : (
            <ScheduleWeek
              weekNumber={week === "week_one" ? 1 : 2}
              divNumber={divNumber}
              handleEditDayAndTimeIdx={handleEditDayAndTimeIdx}
              schedule={
                divNumber === 1
                  ? regularSchedule[week] || defaultSchedule[week]
                  : trialSchedule[week as "week_one"] || defaultTrialSchedule
              }
              handleSetWeekChange={handleWeekChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MySchedule;

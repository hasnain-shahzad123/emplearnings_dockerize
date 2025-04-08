"use client";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import AddSlotModal from "./AddSlotModal";
import { useEffect, useState } from "react";
import ScheduledWeek from "./ScheduledWeek";
import { TutorLessonScheduleDataType } from "@/types";
import getTutorLessonScheduleFromDB from "@/firebase/tutor/dashboard/lesson_schedule/getTutorLessonScheduleFromDB";
import addTutorLessonScheduleToDB from "@/firebase/tutor/dashboard/lesson_schedule/addTutorLessonScheduleToDB";
import deleteTutorLessonScheduleToDB from "@/firebase/tutor/dashboard/lesson_schedule/deleteTutorLessonScheduleFromDB";
import updateTutorLessonScheduleToDB from "@/firebase/tutor/dashboard/lesson_schedule/updateTutorLessonScheduleToDB";
import { set } from "zod";
import { useAlert } from "@/contexts/AlertContext";
type Schedule = {
  [key: string]: string[];
};

type params = {
  uid: string;
};

export const AddTimeSlot = ({ uid }: params) => {
  const [week, setWeek] = useState<"week_one" | "week_two">("week_one");
  const [schedule, setSchedule] = useState<TutorLessonScheduleDataType>();
  const { showAlert } = useAlert();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getTutorLessonScheduleFromDB({ uid });
      if (response.type === "success") {
        setSchedule(response.LessonScheduleData as TutorLessonScheduleDataType)
      } else {
        console.log("Failed to fetch schedule data:", response.message);
        showAlert("Failed to fetch schedule data. Please try again.", "ERROR");
      }
    };
    fetchData();
  }, [uid, showAlert]);

  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [editDay, setEditDay] = useState<
    "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
  >("Sun");
  const [editTimeIdx, setEditTimeIdx] = useState<number>();

  const handleEditDayAndTimeIdx = (
    day: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat",
    index: number
  ) => {
    setEditDay(day);
    setEditTimeIdx(index);
    handleSetTimeSlot();
  };
  const handleWeekChange = () => {
    week === "week_one" ? setWeek("week_two") : setWeek("week_one");
  };

  const handleSetTimeSlot = () => {
    if (showTimeSlotModal) {
      document.body.style.overflow = "auto";
      setShowTimeSlotModal(false);
      setEditTimeIdx(undefined);
    } else {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      document.body.style.overflow = "hidden";
      setShowTimeSlotModal(true);
    }
  };

  const addSlot = async (
    day: keyof TutorLessonScheduleDataType["week_one"],
    time: string[]
  ) => {
    if (!schedule) {
      // alert("Schedule is not loaded.");
      return;
    }
    //here adding the time string to the schedule
    const updatedSchedule = { ...schedule };
    time.forEach((t: string) => {
      updatedSchedule[week][day].push(t);
    });

    setSchedule(updatedSchedule as TutorLessonScheduleDataType);

    const response = await addTutorLessonScheduleToDB({ uid: uid, lesson_schedule: { week: week, day: day, time: time }, schedule: schedule || { week_one: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] }, week_two: { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] } } });
    if (response.type === "error") {
      alert(response.message);
      return;
    }
    setSchedule(response.LessonScheduleData as TutorLessonScheduleDataType);
  };

  const deleteSlot = async (
    day: keyof TutorLessonScheduleDataType["week_one"],
    index: number
  ) => {
    //delete the schedule 
    if (!schedule) {
      alert("Schedule is not loaded.");
      return;
    }


    const response = await deleteTutorLessonScheduleToDB({
      uid: uid,
      lesson_schedule: { week: week, day: day, lesson_index: index },
      schedule: schedule || {
        week_one: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        },
        week_two: {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: [],
        },
      },
    });
    if (response.type === "error") {
      console.log("Error deleting schedule: ", response.message);
      showAlert("Failed to delete the time slot. Please try again.", "ERROR");
      return;
    }
    console.log("Schedule after delete: ", response.LessonScheduleData);
    showAlert("Time slot deleted successfully.", "SUCCESS");
    setSchedule(response.LessonScheduleData as TutorLessonScheduleDataType);
  };

  const updateSlot = async (
    day: keyof TutorLessonScheduleDataType["week_one"],
    index: number,
    newTime: string
  ) => {
    if (!schedule) {
      alert("Schedule is not loaded.");
      return;
    }


    try {
      // Update the database after local validation and schedule change
      const response = await updateTutorLessonScheduleToDB({
        uid,
        lesson_schedule: {
          week,
          day,
          lesson_index: index,
          time: newTime,
        },
        schedule,
      });

      if (response.type === "error") {
        console.error("Failed to update the schedule:", response.message);
        showAlert("Failed to update the schedule. Please try again.", "ERROR");
        return;
      }
      showAlert("Time slot updated successfully.", "SUCCESS");
      setSchedule(response.LessonScheduleData as TutorLessonScheduleDataType);
    } catch (error) {
      console.error("Failed to update the schedule:", error);
      alert("Failed to update the schedule. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-end ">
        <CustomButton
          text="Add Time Slot"
          className="bg-empoweredFlag px-5 md:px-8 py-2 rounded-full text-white md:mr-10 mt-5"
          onclickEvent={handleSetTimeSlot}
        />
      </div>
      .{/* the scheduled week component with props and state */}
      <ScheduledWeek
        week_type={week}
        handleEditDayAndTimeIdx={handleEditDayAndTimeIdx}
        schedule={
          schedule || {
            week_one: {
              Sun: [],
              Mon: [],
              Tue: [],
              Wed: [],
              Thu: [],
              Fri: [],
              Sat: [],
            },
            week_two: {
              Sun: [],
              Mon: [],
              Tue: [],
              Wed: [],
              Thu: [],
              Fri: [],
              Sat: [],
            },
          }
        }
        handleSetWeekChange={handleWeekChange}
      />
      {showTimeSlotModal && (
        <AddSlotModal
          updateSlot={updateSlot}
          editDay={editDay}
          deleteSlot={deleteSlot}
          editTimeIndex={editTimeIdx}
          addSlot={addSlot}
          schedule={
            week == "week_one"
              ? schedule?.week_one
              : schedule?.week_two || {
                Sun: [],
                Mon: [],
                Tue: [],
                Wed: [],
                Thu: [],
                Fri: [],
                Sat: [],
              }
          }
          handelTimeSlotModal={handleSetTimeSlot}
        />
      )}
    </>
  );
};

export default AddTimeSlot;

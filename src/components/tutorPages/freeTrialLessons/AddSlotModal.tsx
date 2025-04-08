import { useState, useEffect } from "react";
import { cross } from "@/assets/index";
import Image from "next/image";
import { useAlert } from "@/contexts/AlertContext";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { TutorTrialLessonScheduleDataType } from "@/types";
interface Props {
  handelTimeSlotModal: () => void;
  addSlot: (
    day: keyof TutorTrialLessonScheduleDataType["week_one"],
    time: string[]
  ) => void;
  updateSlot: (
    day: keyof TutorTrialLessonScheduleDataType["week_one"],
    index: number,
    newTime: string
  ) => void;
  removeSlot: (
    day: keyof TutorTrialLessonScheduleDataType["week_one"],
    index: number
  ) => void;
  schedule: Schedule;
  editDay: keyof TutorTrialLessonScheduleDataType["week_one"];
  editTimeIndex: number | undefined;
}

interface Schedule {
  [day: string]: string[];
}

const AddSlotModal = ({
  handelTimeSlotModal,
  schedule,
  addSlot,
  updateSlot,
  removeSlot,
  editDay,
  editTimeIndex,
}: Props) => {
  const { showAlert } = useAlert();
  const daysOfWeek: (keyof TutorTrialLessonScheduleDataType["week_one"])[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];
  type Slots = {
    [key: string]: string[];
  };

  const generateSlots = (): Slots => {
    const slots: Slots = {};
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const times: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const ampm = hour < 12 ? "AM" : "PM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      times.push(`${formattedHour}:00 ${ampm}`);
      times.push(`${formattedHour}:30 ${ampm}`);
    }

    days.forEach((day) => {
      slots[day] = [...times];
    });

    return slots;
  };

  const [selectedDay, setSelectedDay] =
    useState<keyof TutorTrialLessonScheduleDataType["week_one"]>("Sun");
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");
  useEffect(() => {
    if (editDay && editTimeIndex !== undefined) {
      setSelectedDay(editDay);
      setSelectedStartTime(schedule[editDay]?.[editTimeIndex] || "");
    }
  }, [editDay, editTimeIndex, schedule]);

  const generateHourlySlots = (fromTime: string, toTime: string) => {
    const fromIndex = Allslots[selectedDay].indexOf(fromTime);
    const toIndex = Allslots[selectedDay].indexOf(toTime);
    const slots: string[] = [];

    const scheduleForSelectedDay = schedule?.[selectedDay] || [];

    for (let i = fromIndex; i < toIndex; i++) {
      const slot = Allslots[selectedDay][i];
      if (!scheduleForSelectedDay.includes(slot)) {
        slots.push(slot);
      }
    }
    return slots;
  };

  const handleAddOrUpdateSlot = () => {
    if (!selectedDay || !selectedStartTime) {
      // alert("Please select both a day and a time slot.");
      showAlert("Please select both a day and a time slot.", "ERROR");
      return;
    }

    if (editDay && editTimeIndex !== undefined) {
      updateSlot(editDay, editTimeIndex, selectedStartTime);
    } else {
      if (schedule[selectedDay]?.includes(selectedStartTime)) {
        // alert("This time slot is already scheduled for the selected day.");
        showAlert(
          "This time slot is already scheduled for the selected day.",
          "ERROR"
        );
        return;
      }
      const hourlySlots = generateHourlySlots(
        selectedStartTime,
        selectedEndTime
      );
      addSlot(selectedDay, hourlySlots);
    }

    setSelectedDay("Sun");
    setSelectedStartTime("");
    handelTimeSlotModal(); // Close the modal
  };

  const handleRemoveSlot = () => {
    if (editDay && editTimeIndex !== undefined) {
      removeSlot(editDay, editTimeIndex);
      handelTimeSlotModal();
    }
  };

  const Allslots = generateSlots();
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-[#F5F7FC]"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-white shadow-xl flex flex-col justify-center w-[80%] min-h-[150px] p-6 pt-2 rounded-lg">
        <div className="flex justify-between items-center text-2xl font-semibold text-empoweredFlag mb-4">
          <h1>
            {editDay && editTimeIndex !== undefined
              ? "Edit Time Slot"
              : "Enter the Available Slot For Meeting"}
          </h1>
          <button onClick={handelTimeSlotModal}>
            <Image
              src={cross.src}
              alt="cross"
              width={20}
              height={20}
              className="h-8 w-8"
            />
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-5 mt-2">
          {/* Select Day of Week */}
          <div className="flex-1 w-full relative">
            <label
              className="absolute p-1 -top-3 bg-white left-2 text-xs"
              style={{ zIndex: 1 }}
            >
              Select the Day of the Week
            </label>
            <select
              value={selectedDay}
              onChange={(e) =>
                setSelectedDay(
                  e.target
                    .value as keyof TutorTrialLessonScheduleDataType["week_one"]
                )
              }
              className="w-full p-3 pr-10 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800 appearance-none"
              style={{
                backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%234A148C" viewBox="0 0 24 24"%3E%3Cpath d="M7 10l5 5 5-5H7z"/%3E%3C/svg%3E')`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "2rem",
              }}
              disabled={editTimeIndex !== undefined ? true : false} // Disable day selection in edit mode
            >
              <option value="" disabled>
                Choose a day
              </option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full relative">
            <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
              {editTimeIndex === undefined ? "From" : "Select New Time Slot"}
            </label>
            <select
              value={selectedStartTime}
              onChange={(e) => setSelectedStartTime(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800 appearance-none"
              style={{
                backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%234A148C" viewBox="0 0 24 24"%3E%3Cpath d="M7 10l5 5 5-5H7z"/%3E%3C/svg%3E')`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "2rem",
              }}
            >
              <option value="" disabled>
                Choose a time slot
              </option>
              {Allslots[selectedDay]
                .filter(
                  (slot) =>
                    !schedule[selectedDay]?.includes(slot) ||
                    slot === selectedStartTime // Include the selected time
                )
                .map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
            </select>
          </div>

          {/* Select Time Slot */}
          {editTimeIndex === undefined && (
            <div className="flex-1 w-full relative">
              <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
                To
              </label>
              <select
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800 appearance-none"
                style={{
                  backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%234A148C" viewBox="0 0 24 24"%3E%3Cpath d="M7 10l5 5 5-5H7z"/%3E%3C/svg%3E')`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "2rem",
                }}
              >
                <option value="" disabled>
                  Choose a time slot
                </option>
                {selectedStartTime !== "" &&
                  Allslots[selectedDay]
                    .filter(
                      (slot) =>
                        Allslots[selectedDay].indexOf(slot) >
                          Allslots[selectedDay].indexOf(selectedStartTime) &&
                        (!schedule[selectedDay]?.includes(slot) ||
                          slot === selectedEndTime)
                    )
                    .map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-5">
          {/* Update Slot Button */}
          <CustomButton
            text={
              editDay && editTimeIndex !== undefined
                ? "Update Slot"
                : "Add Slot"
            }
            className="bg-empoweredFlag px-8 py-2 rounded-full text-white"
            onclickEvent={handleAddOrUpdateSlot}
          />

          {/* Remove Slot Button */}
          {editDay && editTimeIndex !== undefined && (
            <CustomButton
              text="Remove Slot"
              className="bg-red-600 px-8 py-2 rounded-full text-white"
              onclickEvent={handleRemoveSlot}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSlotModal;

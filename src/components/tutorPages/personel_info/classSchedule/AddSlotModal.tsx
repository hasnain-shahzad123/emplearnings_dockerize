import { useState, useEffect } from "react";
import { cross } from "@/assets/index";
import Image from "next/image";
import { useAlert } from "@/contexts/AlertContext";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { TutorLessonScheduleDataType } from "@/types";

interface Props {
  handelTimeSlotModal: () => void;
  addSlot: (
    day: keyof TutorLessonScheduleDataType["week_one"],
    time: string[]
  ) => void;
  deleteSlot: (
    day: keyof TutorLessonScheduleDataType["week_one"],
    index: number
  ) => void;
  updateSlot: (
    day: keyof TutorLessonScheduleDataType["week_one"],
    index: number,
    newTime: string
  ) => void;
  schedule: any;
  editDay: keyof TutorLessonScheduleDataType["week_one"];
  editTimeIndex: number | undefined;
}

const AddSlotModal = ({
  handelTimeSlotModal,
  schedule={},
  addSlot,
  deleteSlot,
  updateSlot,
  editDay,
  editTimeIndex,
}: Props) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const { showAlert } = useAlert();

  //generating time slots for 30 minutes
  const generateSlots = () => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const ampm = hour < 12 ? "AM" : "PM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      slots.push(`${formattedHour}:00 ${ampm}`);
    }
    return slots;
  };

  const timeSlots = generateSlots();
  const [selectedDay, setSelectedDay] =
    useState<keyof TutorLessonScheduleDataType["week_one"]>("Sun");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (schedule && editDay && editTimeIndex !== undefined) {
      setSelectedDay(editDay);
      setSelectedTime(schedule[editDay]?.[editTimeIndex] || "");
    }
  }, [editDay, editTimeIndex, schedule]);


  const generateHourlySlots = (fromTime: string, toTime: string) => {
    const fromIndex = timeSlots.indexOf(fromTime);
    const toIndex = timeSlots.indexOf(toTime);
    const slots: string[] = [];

    const scheduleForSelectedDay = schedule?.[selectedDay] || [];

    for (let i = fromIndex; i < toIndex; i++) {
      const slot = timeSlots[i];
      if (!scheduleForSelectedDay.includes(slot)) {
        slots.push(slot);
      }
    }
    return slots;
  };


  const handleAddOrUpdateSlot = () => {
    if (!selectedDay || !selectedTime || !selectedEndTime) {
      if (editDay && editTimeIndex === undefined){
        showAlert("Please select both a day and a time slot.", "INFO");
      return;
      }
    }
    
   const hourlySlots = generateHourlySlots(selectedTime, selectedEndTime);
   console.log("The newly added hourly slot is : ",hourlySlots);
    if (editDay && editTimeIndex !== undefined) {
      if (!selectedTime) {
        showAlert("Please select a time slot.", "INFO");
        return;
      }
      updateSlot(editDay, editTimeIndex, selectedTime);

    } else {
      addSlot(selectedDay, hourlySlots);
      showAlert("Time slot added successfully!", "SUCCESS");
    }
  
    setSelectedDay("Sun");
    setSelectedTime("");
    setSelectedEndTime("");
    handelTimeSlotModal();
  };

  const handleDeleteSlot = () => {
    if (editDay && editTimeIndex !== undefined) {
      deleteSlot(editDay, editTimeIndex);
      handelTimeSlotModal(); // Close the modal
      //here start and end time will also be added from db in edit mode
    }
  };

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
            <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
              Select the Day of the Week
            </label>
            <select
              value={selectedDay}
              onChange={(e) =>
                setSelectedDay(
                  e.target
                    .value as keyof TutorLessonScheduleDataType["week_one"]
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

          {/* Select Time Slot */}
          <div className="flex-1 w-full relative">
            <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
              {editDay && editTimeIndex !== undefined ? "Choose a new time slot" : "From"}
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 text-[#4A148C] rounded-md outline-none focus:ring-2 focus:ring-purple-800 appearance-none"
              style={{
                backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%234A148C" viewBox="0 0 24 24"%3E%3Cpath d="M7 10l5 5 5-5H7z"/%3E%3C/svg%3E')`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "2rem",
              }}
            >
              <option value="" disabled>
                Select the Time Slot
              </option>
              {timeSlots
                .filter(
                  (slot) =>
                    !schedule[selectedDay]?.includes(slot) ||
                    slot === selectedTime // Include the selected time
                )
                .map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
            </select>
          </div>

         {editTimeIndex===undefined && <div className="flex-1 w-full relative">
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
              {selectedTime!="" && timeSlots
                .filter(
                  (slot) =>
                    timeSlots.indexOf(slot) > timeSlots.indexOf(selectedTime) &&
                    (!schedule[selectedDay]?.includes(slot) ||
                      slot === selectedEndTime)
                )
                .map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
            </select>
          </div>}

        </div>

        <div className="flex justify-center gap-8">
          {editDay && editTimeIndex !== undefined && (
            <CustomButton
              text={"Remove Slot"}
              className="bg-empoweredFlag px-8 py-2 rounded-full text-white mt-5"
              onclickEvent={handleDeleteSlot}
            />
          )}
          <CustomButton
            text={
              editDay && editTimeIndex !== undefined
                ? "Update Slot"
                : "Add Slot"
            }
            className="bg-empoweredFlag px-8 py-2 rounded-full text-white mt-5"
            onclickEvent={handleAddOrUpdateSlot}
          />
          
        </div>
      </div>
    </div>
  );
};

export default AddSlotModal;

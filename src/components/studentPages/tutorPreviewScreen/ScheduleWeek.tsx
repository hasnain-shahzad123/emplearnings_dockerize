"use client"
import { desclaimer, caret_prev, caret_next } from "@/assets/index";
import Image from "next/image";
import { useMemo } from "react";


interface Schedule {
  [day: string]: string[]; 
}

interface ScheduleWeekProps {
  schedule: Schedule;
  weekNumber: number;
  divNumber:number;
  handleEditDayAndTimeIdx:(day:string,Tindex:number)=>void;
  handleSetWeekChange:()=>void;
}

const SchedulWeek = ({
  schedule,
  handleEditDayAndTimeIdx,
  divNumber,
  weekNumber,
  handleSetWeekChange
}: ScheduleWeekProps) => {
  const getWeekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay;
    
    // Get start date for the selected week
    const weekStart = new Date(today.setDate(diff + (weekNumber === 1 ? 0 : 7)));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    };

    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}, ${weekStart.getFullYear()}`;
  }, [weekNumber]);

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-center mt-[6%]">
        <div className="flex gap-5 md:gap-10 items-center">
          <div className="text-md xss:text-xl xs:text-2xl text-empoweredFlag font-semibold">
            <h1>{getWeekDates}</h1>
          </div>
          <div className="flex gap-3">
            <button disabled={weekNumber === 1} onClick={handleSetWeekChange}>
              <Image
                src={caret_prev.src}
                alt="caret-prev"
                height={20}
                width={20}
                className={`h-8 w-8 md:h-10  md:w-10
                    ${weekNumber === 1 ? "opacity-50" : "opacity-100"}\
                    ${divNumber == 2 ? "hidden" : "block"}
                    `}
              />
            </button>

            <button disabled={weekNumber === 2} onClick={handleSetWeekChange}>
              <Image
                src={caret_next.src}
                alt="caret-next"
                height={20}
                width={20}
                className={`h-8 w-8 md:h-10 md:w-10
                  ${weekNumber === 2 ? "opacity-50" : "opacity-100"}
                  ${divNumber == 2 ? "hidden" : "block"}
                  `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="grid grid-cols-7 gap-4  md:px-10 text-[15px] md:text-2xl mt-4 custom-shadow px-6 py-6 rounded-xl">
        {Object.values(schedule).every((slots) => slots.length === 0) ? (
          <div className="col-span-7 text-center text-gray-500 text-lg">
            No slots available for this week
          </div>
        ) : (
          Object.entries(schedule).map(([day, slots]) => (
            <div key={day} className="flex flex-col items-center">
              <h1 className="mb-4 border-[#4A148C] border-b-4 font-semibold text-[#4A148C]">
                {day}
              </h1>
              {
                slots.map((slot, index) => (
                  <button
                    key={slot}
                    className="bg-[#EEEEEE] mt-3 text-[10px] md:text-[14px] border-[#D9D9D9] py-1 px-1 xss:px-2 md:px-4 rounded-xl border-[1px] hover:bg-[#d9d9d9]"
                  >
                    {slot}
                  </button>
                ))
              }
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SchedulWeek;

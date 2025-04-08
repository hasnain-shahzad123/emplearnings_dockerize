"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  caret_prev,
  caret_next,
  video_meet,
  clock_icon,
  join_meet,
  reschedule_meet,
  cancel_meet,
} from "@/assets/index";
import Image from "next/image";
import { MappedEvents } from "@/types";
import deleteCalendarEvent from "@/services/googleCalendar/deleteCalendarEventService";

const Calendar = ({
  events,
  refreshEvents,
  uid,
  setIsRescheduling,
  setEventToBeRescheduled,
}: {
  events: MappedEvents;
  refreshEvents: () => Promise<void>;
  setIsRescheduling: (arg: boolean) => void;
  setEventToBeRescheduled: (eventId: string) => void;
  uid: string;
}) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [CDate, setCDate] = useState<number>(0);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const formatEventTime = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) {
      return "Time not available";
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`;
  };

  const getDayEvents = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return events[year]?.[month]?.[day] || [];
  };

  const generateGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (number | null)[] = Array(firstDay).fill(null); // Empty slots for days before the start
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push(i);
    }
    while (grid.length % 7 !== 0) {
      grid.push(null); // Empty slots for days after the end
    }
    return grid;
  };

  const grid = generateGrid();

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
    setSelectedDay(null); // Reset selected day when changing months
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
    setSelectedDay(null); // Reset selected day when changing months
  };

  const handleDayClick = (day: number | null, event: React.MouseEvent) => {
    if (!day) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const calendarRect = calendarRef.current?.getBoundingClientRect();

    setPopupPosition({
      top: rect.top - (calendarRect?.top || 0) + rect.height / 2,
      left: rect.left - (calendarRect?.left || 0) + rect.width / 2,
    });
    setSelectedDay(day);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target as Node) &&
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setPopupPosition(null);
      setSelectedDay(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    const today = new Date();
    setCDate(today.getDate());
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    setPopupPosition(null);
    try {
      const response = await deleteCalendarEvent({
        uid,
        eventId,
      });
      console.log("Delete res: ", response);
      if (response.type === "success") {
        await refreshEvents();
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
    setPopupPosition(null);
    setEventToBeRescheduled(eventId);
  };

  return (
    <>
      <div
        ref={calendarRef}
        className="relative w-full mt-10 max-w-2xl p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow mx-auto"
        style={{ zIndex: 10 }}
      >
        {/* Month Header */}
        <div className="mb-4 flex  justify-between items-center">
          <button onClick={handlePrevMonth}>
            <Image
              src={caret_prev.src}
              alt="Previous"
              width={50}
              height={50}
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </button>
          <h2 className="text-xl font-bold">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h2>

          <button onClick={handleNextMonth}>
            <Image
              src={caret_next.src}
              alt="Next"
              width={50}
              height={50}
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </button>
        </div>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 text-center font-bold text-gray-700 mb-2 text-sm sm:text-base">
          {days.map((day, index) => (
            <div key={index} className="p-1 sm:p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 z-0 custom-scrollbar gap-1 sm:gap-2 w-full">
          {grid.map((day, index) => (
            <div
              key={index}
              onClick={(e) => handleDayClick(day, e)}
              className={`flex flex-col cursor-pointer justify-between items-center aspect-square w-full h-full min-h-[50px] min-w-[48px] rounded-lg border-black border-[1px]
                ${day === selectedDay ? "text-black" : "hover:bg-gray-50"}
                ${!day ? "border-transparent" : "border-[#000000]"}
                ${
                  day === CDate &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                    ? "bg-empoweredFlag hover:bg-blue-500 text-white"
                    : ""
                }
              `}
            >
              {day && (
                <>
                  <div className="text-xs sm:text-md font-bold mt-1 sm:mt-2">
                    {day}
                  </div>
                  <div className="mt-auto mb-1 sm:mb-2">
                    {getDayEvents(day).length > 0 && (
                      <span className="bg-[#4A148C] text-white px-1 py-0.5 sm:p-1 sm:px-2 rounded-full text-[10px] sm:text-xs">
                        {getDayEvents(day).length}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {popupPosition && selectedDay && (
          <div
            ref={popupRef}
            className="absolute bg-[#D9D9D9] w-[70%] max-h-[350px] overflow-y-auto shadow-lg rounded-lg border"
            style={{
              top: "50%",
              left: "50%",
              position: "fixed", // Fixed positioning for centering
              transform: "translate(-50%, -50%)", // Center horizontally and vertically
            }}
          >
            {/* Date Heading */}
            <div className="bg-[#f5f5f5] p-3 text-empoweredFlag text-center text-xl font-bold border-b border-[#ccc] rounded-t-lg">
              {selectedDay}{" "}
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </div>

            {/* Meeting Details */}
            <div className="p-4">
              {getDayEvents(selectedDay).length ? (
                getDayEvents(selectedDay).map((event, index) => (
                  <div
                    key={index}
                    className="mb-3 bg-white p-2 rounded-lg border-[1px] border-[#D9D9D9]"
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
                        {formatEventTime(event.startTime, event.endTime)}
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
                        {event.meetingLink}
                      </a>
                    </div>
                    <div className="flex flex-wrap text-[7px] mt-4 text-white justify-evenly">
                      <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                        <button className="flex flex-col items-center gap-1">
                          <Image
                            src={join_meet.src}
                            alt="join-meet"
                            width={20}
                            height={20}
                            className="h-3 w-3"
                          />
                          <span>Join Meeting</span>
                        </button>
                      </div>
                      <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                        <button
                          className="flex flex-col items-center gap-1"
                          onClick={() => handleRescheduleEvent(event.eventId)}
                        >
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
                        <button
                          className="flex flex-col items-center gap-1"
                          onClick={async () => {
                            await handleDeleteEvent(event.eventId);
                          }}
                        >
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
                ))
              ) : (
                <div className="mt-2 p-5 text-center text-empoweredFlag font-semibold">
                  No meetings scheduled.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;

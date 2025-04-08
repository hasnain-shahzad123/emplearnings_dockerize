"use client";
import updateCalendarEvent from "@/services/googleCalendar/updateCalendarEventService";
import { useState } from "react";
import { FaTimes as CloseIcon } from "react-icons/fa";

export default function MeetingRescheduler({
  isVisible,
  setIsVisible,
  eventId,
  uid,
  refreshEvents,
}: {
  isVisible: boolean;
  setIsVisible: (arg: boolean) => void;
  eventId: string;
  uid: string;
  refreshEvents: () => Promise<void>;
}) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVisible(false);
    if (selectedTime && date) {
      if (eventId) {
        try {
          const startDateTime = new Date(`${date}T${selectedTime}`);
          const endDateTime = new Date(
            startDateTime.getTime() + 50 * 60 * 1000
          );

          if (startDateTime < new Date()) {
            alert("Start time cannot be in the past.");
            return;
          }

          const response = await updateCalendarEvent({
            uid,
            eventId,
            startTime: startDateTime,
            endTime: endDateTime,
          });

          if (response.type === "error") {
            alert(response.message);
          } else {
            await refreshEvents();
          }
        } catch (error) {
          console.error("Error updating the calendar event:", error);
        }
      }
    } else {
      console.error("All fields are required to update the event.");
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 absolute z-50 top-32">
      <div className="relative bg-white rounded-xl shadow-lg p-6">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-purple-900 hover:text-purple-700 focus:outline-none"
          onClick={() => setIsVisible(false)}
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-[#4B0082] mb-6">
          Enter new time for the Lesson
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Date Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {/* Time Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select the Time
              </label>
              <input
                type="time"
                value={selectedTime || ""}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#4B0082] text-white rounded-lg hover:bg-[#3B0062] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { back } from "@/assets/index";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";

interface Schedule {
  [day: string]: string[];
}

const CalenderSection = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id || "1";

  const [schedule, setSchedule] = useState<Schedule>({});
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    slot: string;
  } | null>(null);

  useEffect(() => {
    setSchedule({
      Sun: ["9:00 AM", "11:00 AM", "1:00 PM"],
      Mon: ["10:00 AM", "2:00 PM"],
      Tue: ["9:00 AM", "12:00 PM", "3:00 PM"],
      Wed: ["8:00 AM", "10:00 AM", "4:00 PM"],
      Thu: ["9:00 AM", "12:00 PM"],
      Fri: ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
      Sat: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    });
  }, []);

  const handleSelectedTimeSlot = (day: string, slot: string) => {
      // alert(day + " " + slot);
    setSelectedSlot({ day, slot });
    // router.push(`/tutor_questions/${id}`);
  };

  const getNext7Days = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        day: days[date.getDay()],
        date: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
      };
    });
  };

  const weekDays = getNext7Days();

  return (
    <>
      {/* Time Slots Section */}
      <div className="grid grid-cols-7 px-5 my-10 gap-4 max-w-7xl mx-auto md:px-10 text-[12px] md:text-2xl">
        {weekDays.map(({ day, date }) => (
          <div key={day} className="flex flex-col items-center">
            {/* Date and Day Display */}
            <h1 className="text-empoweredFlag text-center font-semibold mb-5">
              {date}
            </h1>
            <h1 className="mb-4 underline decoration-empoweredFlag decoration-4 underline-offset-8">
              {day}
            </h1>
            {/* Time Slots */}
            {schedule[day]?.length ? (
              schedule[day].map((slot, index) => (
                <button
                  key={`${day}-${index}`}
                  onClick={() => handleSelectedTimeSlot(day, slot)}
                  className={`bg-[#EEEEEE] mt-3 text-[10px] md:text-[15px] border-[#D9D9D9] py-1 px-1 xss:px-2 md:px-4 lg:px-6 rounded-xl border-[1px] hover:bg-[#d9d9d9] ${
                    selectedSlot?.day === day && selectedSlot?.slot === slot
                      ? "bg-empoweredFlag text-white"
                      : ""
                  }`}
                  title={`Schedule slot: ${slot}`}
                  aria-label={`Schedule slot: ${slot}`}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p className="text-gray-500 mt-3">No slots available</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between my-10 mx-10 md:px-10">
        <button className="">
          <Link href="/demo-for-mentors" prefetch={true}>
            <Image
              src={back}
              alt="Back Button"
              height={45}
              width={45}
              className="h-15 w-15"
            />
          </Link>
        </button>

        <div>
          <CustomButton
            onclickEvent={() => router.push(`/tutor_questions/${id}`)}
            className={`bg-[#4A148C] ${
              selectedSlot?.day && selectedSlot?.slot
                ? "block"
                : "hidden"
            } px-8 py-3 font-poppins text-white rounded-3xl`}
            text="Answer Questions"
          />
        </div>
      </div>
    </>
  );
};

export default CalenderSection;

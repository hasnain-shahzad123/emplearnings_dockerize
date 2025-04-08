import Image from "next/image";
import Calendar from "./Calendar";
import {
  active_students,
  booked_lessons,
  pending_lessons,
  total_courses,
  total_lessons,
  total_students,
} from "@/assets/index";
import { MappedEvents } from "@/types";
import Link from "next/link";
import Spinner from "@/components/shared/spinner/Spinner";
import MeetingRescheduler from "./MeetingScheduler";
import { useEffect, useState } from "react";
interface ScheduleSectionProps {
  totalCourses: number;
  totalLessons: number;
  bookedLessons: number;
  authorized: boolean;
  events: MappedEvents;
  consentLink: string;
  isLoading: boolean;
  uid: string;
  refreshEvents: () => Promise<void>;
}
const ScheduleSection = ({
  totalCourses,
  totalLessons,
  bookedLessons,
  events,
  authorized,
  consentLink,
  isLoading,
  uid,
  refreshEvents,
}: ScheduleSectionProps) => {
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [eventToBeRescheduled, setEventToBeRescheduled] = useState<string>("");
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="bg-white grid grid-cols-12 px-7 py-5 rounded-xl gap-7 shadow-xl">
          <div className=" col-span-4 flex flex-col font-semibold xl:text-lg items-center">
            <Image
              src={total_lessons.src}
              alt="Total Students"
              width={50}
              height={50}
              className="h-8 w-8"
            />
            <h1 className="text-sm mt-2">Total Lessons</h1>
            <h2 className="text-2xl mt-2 font-semibold text-[#4A148C]">
              {totalLessons}
            </h2>
          </div>

          <div className="col-span-4 flex flex-col font-semibold xl:text-lg items-center">
            <Image
              src={booked_lessons.src}
              alt="Total lessons"
              width={50}
              height={50}
              className="h-8 w-8"
            />
            <h1 className="text-sm mt-2">Booked Lessons</h1>
            <h2 className="text-2xl mt-2 font-semibold text-[#4A148C]">
              {bookedLessons}
            </h2>
          </div>
          <div className="col-span-4 flex flex-col font-semibold items-center">
            <Image
              src={total_courses.src}
              alt="Pending Lessons"
              width={50}
              height={50}
              className="h-8 w-8"
            />
            <h1 className="text-sm mt-2 text-center">Total Courses</h1>
            <h2 className="text-2xl font-semibold mt-2 text-[#4A148C]">
              {totalCourses}
            </h2>
          </div>
        </div>
      </div>
      {isLoading ? (
        <>
          <h1 className="font-bold text-2xl p-10 pl-4">Up Coming Schedule</h1>
          <Spinner></Spinner>
        </>
      ) : authorized ? (
        <div className="relative">
          {isRescheduling && (
            <div
              className="fixed inset-0 bg-black bg-opacity-20 z-20"
              onClick={() => setIsRescheduling(false)}
            ></div>
          )}
          <h1 className="font-bold text-2xl p-10 pl-4">Upcoming Schedule</h1>
          <Calendar
            uid={uid}
            refreshEvents={refreshEvents}
            setEventToBeRescheduled={setEventToBeRescheduled}
            setIsRescheduling={setIsRescheduling}
            events={events}
          />
          {isRescheduling ? (
            <div className="z-30">
              <MeetingRescheduler
                uid={uid}
                isVisible={isRescheduling}
                setIsVisible={setIsRescheduling}
                eventId={eventToBeRescheduled}
                refreshEvents={refreshEvents}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="w-full h-1/2">
          <div className="h-full w-full flex flex-col  items-center justify-center gap-y-6 pr-4 pl-4">
            <Link href={consentLink}>
              {" "}
              <button className="bg-empoweredFlag rounded-lg h-14 w-64 text-white">
                Authorize
              </button>
            </Link>
            <p className="text-sm text-center">
              Please authorize this app with your Google account to seamlessly
              sync your events and meetings. This ensures you stay updated and
              enjoy the full benefits of your calendar.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleSection;

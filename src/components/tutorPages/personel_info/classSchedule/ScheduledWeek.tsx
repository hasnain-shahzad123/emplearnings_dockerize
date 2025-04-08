"use client"
import { desclaimer, caret_prev, caret_next } from "@/assets/index"
import type { TutorLessonScheduleDataType } from "@/types"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"

interface ScheduleWeekProps {
  schedule: TutorLessonScheduleDataType
  week_type: "week_one" | "week_two"
  handleEditDayAndTimeIdx: (day: keyof TutorLessonScheduleDataType["week_one"], Tindex: number) => void
  handleSetWeekChange: () => void
}

const ScheduledWeek = ({ schedule, handleEditDayAndTimeIdx, week_type, handleSetWeekChange }: ScheduleWeekProps) => {
  const [currentWeekSchedule, setCurrentWeekSchedule] = useState<{
    Sun: string[]
    Mon: string[]
    Tue: string[]
    Wed: string[]
    Thu: string[]
    Fri: string[]
    Sat: string[]
  }>({
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  })

  // Array of days in order for reordering
  const daysOfWeek = useMemo(() => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], [])

  // Calculate ordered days with current day first using useMemo
  const orderedDays = useMemo(() => {
    const currentDayIndex = new Date().getDay()
    return [...daysOfWeek.slice(currentDayIndex), ...daysOfWeek.slice(0, currentDayIndex)]
  }, [daysOfWeek])

  useEffect(() => {
    if (schedule) {
      const weekSchedule = schedule?.[week_type] || { Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [] }
      setCurrentWeekSchedule(weekSchedule)
    }
  }, [schedule, week_type])

  const currentDay = useMemo(() => daysOfWeek[new Date().getDay()], [daysOfWeek])

  return (
    <>
      {/* Header Section */}
      <div className="flex lg:flex-row flex-col justify-between pb-3 items-center px-10 border-b-[1px] border-[#666666]">
        <div className="flex gap-5 md:gap-10 items-center">
          <div className="text-md xss:text-xl xs:text-2xl text-empoweredFlag font-semibold">
            <h1>Week {week_type === "week_one" ? "1" : "2"}</h1>
          </div>
          <div className="flex gap-3">
            <button disabled={week_type === "week_one"} onClick={handleSetWeekChange}>
              <Image
                src={caret_prev.src || "/placeholder.svg"}
                alt="caret-prev"
                height={20}
                width={20}
                className={`h-8 w-8 md:h-10 md:w-10 ${week_type === "week_one" ? "opacity-50" : "opacity-100"}`}
              />
            </button>

            <button disabled={week_type === "week_two"} onClick={handleSetWeekChange}>
              <Image
                src={caret_next.src || "/placeholder.svg"}
                alt="caret-next"
                height={20}
                width={20}
                className={`h-8 w-8 md:h-10 md:w-10 ${week_type === "week_two" ? "opacity-50" : "opacity-100"}`}
              />
            </button>
          </div>
        </div>

        <div className="text-empoweredFlag md:mt-0 mt-2 text-[12px] md:text-base flex gap-3 items-center">
          <Image
            src={desclaimer.src || "/placeholder.svg"}
            alt="desclaimer"
            height={20}
            width={20}
            className="h-5 w-5"
          />
          <p>Tutors have to schedule lessons for 2 weeks.</p>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="grid grid-cols-7 gap-4 md:px-10 text-[15px] md:text-2xl mt-4">
        {orderedDays.map((day) => (
          <div key={day} className="flex flex-col items-center">
            <h1 className={`mb-4 ${day === currentDay ? "font-bold text-empoweredFlag" : ""}`}>{day}</h1>
            {currentWeekSchedule[day as keyof typeof currentWeekSchedule]?.map((slot, index) => (
              <button
                onClick={() => {
                  handleEditDayAndTimeIdx(day as keyof TutorLessonScheduleDataType["week_one"], index)
                }}
                key={`${day}-${slot}-${index}`}
                className="bg-[#EEEEEE] mt-3 text-[10px] md:text-[15px] border-[#D9D9D9] py-1 px-1 xss:px-2 md:px-4 lg:px-6 rounded-xl border-[1px] hover:bg-[#d9d9d9]"
              >
                {slot}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default ScheduledWeek


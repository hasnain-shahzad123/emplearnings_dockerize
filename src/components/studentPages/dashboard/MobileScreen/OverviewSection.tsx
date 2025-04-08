import Image from 'next/image';
import { Mobile_S_Students,Mobile_S_Lessons, total_lessons, Mobile_S_booked_lessons, Mobile_S_total_courses } from '@/assets/index';
interface OverViewSectionProps{
  totalCourses:number,
  lessons:number,
  bookedLessons:number
}
const OverViewSection = ({totalCourses,lessons,bookedLessons}:OverViewSectionProps) => { 
    return (
      <>
        <div className="mt-10 w-[90%] mx-auto">
          <h1 className="font-semibold text-xl md:text-3xl">Overview</h1>

          <div className="bg-white flex gap-3 justify-evenly mt-10 p-5 shadow-xl rounded-xl w-full">
            <div className="flex gap-2 items-center">
              <div className="bg-empoweredFlag p-1 md:p-3 rounded-2xl">
                <Image
                  src={Mobile_S_Lessons.src}
                  alt="Students"
                  width={50}
                  height={50}
                  className="h-7 w-7"
                />
              </div>
              <div className="flex flex-col text-[8px] md:text-base  items-center">
                <p className="font-bold">{lessons}</p>
                <p>Lessons</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#08A935] p-1 md:p-3 rounded-2xl">
                <Image
                  src={Mobile_S_booked_lessons.src}
                  alt="Students"
                  width={50}
                  height={50}
                  className="h-7 w-7"
                />
              </div>
              <div className="flex flex-col text-[8px] md:text-base items-center">
                <p className="font-bold">{bookedLessons}</p>
                <p>Booked</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#DD5D00] p-1 md:p-3 rounded-2xl">
                <Image
                  src={Mobile_S_total_courses.src}
                  alt="Students"
                  width={50}
                  height={50}
                  className="h-7 w-7"
                />
              </div>
              <div className="flex flex-col text-[8px] md:text-base items-center">
                <p className="font-bold">{totalCourses}</p>
                <p>Courses</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
export default OverViewSection;
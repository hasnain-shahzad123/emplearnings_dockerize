import Image from 'next/image';
import { Mobile_S_Students,Mobile_S_Lessons } from '@/assets/index';
interface OverViewSectionProps{
  students:number,
  activeStudents:number,
  lessons:number,
  pendingLessons:number
}
const OverViewSection = ({students,activeStudents,lessons,pendingLessons}:OverViewSectionProps) => { 
    return (
      <>
        <div className="mt-10 w-[90%] mx-auto">
          <h1 className="font-semibold text-xl md:text-3xl">Overview</h1>

          <div className="bg-white flex gap-3 justify-evenly mt-10 p-5 shadow-xl rounded-xl w-full">
            <div className="flex gap-2 items-center">
              <div className="bg-empoweredFlag px-1 sm:p-1 md:p-3 rounded-full sm:rounded-2xl">
                <Image
                  src={Mobile_S_Students.src}
                  alt="Students"
                  width={50}
                  height={50}
                  className="h-7 w-7"
                />
              </div>
              <div className="flex flex-col text-[8px] md:text-base  items-center">
                <p className="font-bold">{students}</p>
                <p>Students</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#08A935] px-1 sm:p-1 md:p-3 rounded-full sm:rounded-2xl">
                <Image
                  src={Mobile_S_Students.src}
                  alt="Students"
                  width={50}
                  height={50}
                  className="h-7 w-7"
                />
              </div>
              <div className="flex flex-col text-[8px] md:text-base items-center">
                <p className="font-bold">{activeStudents}</p>
                <p>Active</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-empoweredFlag px-1 sm:p-1 md:p-3 rounded-full sm:rounded-2xl">
                <Image
                  src={Mobile_S_Lessons.src}
                  alt="Students"
                  width={50}
                  height={50}
                  className="h-7 w-7"
                />
              </div>
              <div className="flex flex-col text-[8px] md:text-base items-center">
                <p className="font-bold">{lessons}</p>
                <p>Lessons</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#DD5D00] px-1 sm:p-1 md:p-3 rounded-full sm:rounded-2xl">
                <Image
                  src={Mobile_S_Lessons.src}
                  alt="Students"
                  width={50}
                  height={50}
                  className="h-7 w-7"
                />
              </div>
              <div className="flex flex-col text-[8px] md:text-base items-center">
                <p className="font-bold">{pendingLessons}</p>
                <p>Pending</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
export default OverViewSection;
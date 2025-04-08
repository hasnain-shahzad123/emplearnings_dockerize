import Image from "next/image";
import {
  clock_icon,
  video_meet,
  join_meet,
  reschedule_meet,
  cancel_meet,
} from "@/assets/index";
const NextClassSection =()=>{
    return (
      <>
        <div className="w-[90%] mx-auto sm:p-3">
          <h1 className="pl-5 pb-2 font-semibold text-lg">Next Class</h1>
          <div className="shadow-xl text-[10px] sm:text-[17px] p-3 bg-white rounded-xl">
            <div className="bg-[#F1F1FF] p-2 rounded-lg  border-[1px] border-[#D9D9D9]">
              <h1 className="text-[12px] font-semibold">
                Your Meeting with Taha Jalal on Motion Graphics
              </h1>
              <div className="flex gap-2 mt-2">
                <Image
                  src={clock_icon.src}
                  alt="clock"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <div>21/09/2024 - 8:30 am to 10:00 am</div>
              </div>
              <div className="flex gap-2 mt-2">
                <Image
                  src={video_meet.src}
                  alt="video-meet"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                <a href="#">google-meet.//https......</a>
              </div>
              <div className="flex flex-row  text-[10px] mt-4 text-white justify-evenly">
                <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col justify-center items-center px-2 sm:px-3 py-1 gap-1 rounded-full">
                  <button className="flex flex-row justify-center items-center gap-1">
                    <Image
                      src={join_meet.src}
                      alt="join-meet"
                      width={20}
                      height={20}
                      className="h-3 w-3"
                    />
                    <span className="text-[7px] sm:text-[12px]">Join Meeting</span>
                  </button>
                </div>
                <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col justify-center items-center px-2 sm:px-3 py-1 gap-1 rounded-full">
                  <button className="flex flex-row justify-center items-center gap-1">
                    <Image
                      src={reschedule_meet.src}
                      alt="join-meet"
                      width={20}
                      height={20}
                      className="h-3 w-3"
                    />
                    <span className="text-[7px] sm:text-[12px]">Reschedule Meeting</span>
                  </button>
                </div>
                <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col justify-center items-center px-2 sm:px-3 py-1 gap-1 rounded-full">
                  <button className="flex flex-row justify-center items-center gap-1">
                    <Image
                      src={cancel_meet.src}
                      alt="join-meet"
                      width={20}
                      height={20}
                      className="h-3 w-3"
                    />
                    <span className="text-[7px] sm:text-[12px]">Cancel meet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
export default NextClassSection;
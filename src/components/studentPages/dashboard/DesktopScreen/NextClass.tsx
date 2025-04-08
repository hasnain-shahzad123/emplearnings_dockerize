import {
  clock_icon, video_meet, join_meet, reschedule_meet, cancel_meet
  , upgrade_star, desclaimer_black
} from "@/assets/index";
import { Event } from "@/types";
//  import CustomButton from "@/components/shared/CustomButton";
import Image from "next/image";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
const NextClass = ({
  event,
}: { event: Event }) => {
  return (
    <>
      <div className="w-full mx-auto flex flex-col items-start gap-y-5">
        <h1 className=" pb-2 font-semibold text-lg">Next Class</h1>
        <div className="shadow-xl text-[12px] p-3 bg-white rounded-xl">
          <div className="bg-[#F1F1FF] p-2 rounded-lg  border-[1px] border-[#D9D9D9]">
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
              <div>{event.startTime} to {event.endTime}</div>
            </div>
            <div className="flex gap-2 mt-2">
              <Image
                src={video_meet.src}
                alt="video-meet"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <a href={event.meetingLink}>{event.meetingLink}</a>
            </div>
            <div className="flex flex-wrap  text-[7px] mt-4 text-white justify-evenly">
              <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                <a href={event.meetingLink} className="flex flex-col items-center gap-1">
                  <Image
                    src={join_meet.src}
                    alt="join-meet"
                    width={20}
                    height={20}
                    className="h-3 w-3"
                  />
                  <span>Join Meeting</span>
                </a>
              </div>
              <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                <button className="flex flex-col items-center gap-1">
                  <Image
                    src={reschedule_meet.src}
                    alt="join-meet"
                    width={20}
                    height={20}
                    className="h-3 w-3"
                  />
                  <a href="">Reschedule Meeting</a>
                </button>
              </div>
              <div className="bg-empoweredFlag mt-2 hover:bg-[#0067dd] flex flex-col items-center px-3 py-1 gap-1 rounded-full">
                <button className="flex flex-col items-center gap-1">
                  <Image
                    src={cancel_meet.src}
                    alt="join-meet"
                    width={20}
                    height={20}
                    className="h-3 w-3"
                  />
                  <a href="">Cancel meeet</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-xl  mx-auto mb-5 mt-7 text-[12px] p-3 bg-white rounded-xl">
        <div className="bg-[#F1F1FF] p-4 rounded-lg  border-[1px] border-[#D9D9D9]">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-empoweredFlag p-2 rounded-full ">
              <Image
                src={upgrade_star.src}
                alt="star"
                width={20}
                height={20}
                className="h-7 w-7"
              />
            </div>  
          </div>
        </div>
      </div>
    </>
  );
};
export default NextClass;
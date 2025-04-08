import Image from "next/image";
import { Figma_course, play_icon } from "@/assets/index";
import { useState,useRef } from "react";
import Spinner from "@/components/shared/spinner/Spinner";
interface VideoModalProps {
  videoSrc: string;
}

const VideoModal = ({ videoSrc }: VideoModalProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  return (
    <>
      <div
        className={`bg-white p-4 rounded-lg shadow-md 
                   w-[90%] max-w-[80vw] h-[50vh] md:h-[90vh] 
                   mx-auto my-8`} // Center and adjust width
      >
        {!isVideoLoaded  && <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>}
        <div
          className={`${!isVideoLoaded ? "hidden":"block"} relative w-full h-full border-[#7A7A7A] border-[1px] group`}
        >
          <video
            
            controls={true}
            className="absolute inset-0 w-full h-full object-contain
                       sm:object-fill transition-opacity duration-300"
            autoPlay
            onLoadedData={() => setIsVideoLoaded(true)}
            muted
            loop
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
         
         

        </div>
      </div>
    </>
  );
};

export default VideoModal;

import Image from "next/image";

import {
  five_stars,
  Figma_course,
  play_icon,
  backBtn,
  total_playHours,
} from "@/assets/index";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { Course } from "@/types";

type params={
  course:Course
}
const HeroSection = ({course}:params) => {
  const router = useRouter();
  return (
    <div className="max-w-7xl box-border mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-start py-6">
        <button onClick={router.back} className="mx-5">
          <Image
            src={backBtn}
            alt="back"
            height={50}
            width={50}
            className="h-10 w-10"
          />
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-10">
        <div className="w-full md:w-[60%] text-center md:text-left mb-10 md:mb-0 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
            {course.title}
          </h1>
          <div className="flex items-center justify-center md:justify-start my-3">
            <Image
              src={five_stars.src}
              alt="5 stars"
              width={100}
              height={40}
              className="w-20 h-7 inline-block"
            />
            <span className="ml-2">{course.rating | 0} course rating</span>
          </div>
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
            {course.description}
          </p>
          {/* <div className="mt-5">
            <CustomButton
              text="Edit Course Info"
              className="bg-empoweredFlag rounded-full px-8 py-2 font-semibold text-white"
            />
          </div> */}
        </div>
        <div className="relative w-full md:w-[35%] min-h-[300px] border-[#7A7A7A] border-[1px] group">
          <div className="relative w-full pt-[56.25%]">
            {course.title_img_url ? (
              <div className="absolute inset-0">
                <Image
                  src={course.title_img_url}
                  alt="Course Title Image"
                  fill
                  className="object-contain group-hover:opacity-0 transition-opacity duration-300"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-200">
                <p>No Title Image Available</p>
              </div>
            )}
            {course.intro_video_url ? (
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                controls
                autoPlay
                muted
                loop
                key={course.intro_video_url}
              >
                <source src={course.intro_video_url} />
              </video>
            ) : (
              <div className="absolute inset-0 flex justify-center items-center">
                <Image
                  src={play_icon.src}
                  alt="Play Icon"
                  height={50}
                  width={50}
                  className="h-12 w-12 sm:h-20 sm:w-20 cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col items-center">
            <div>
              <p className="font-semibold text-lg text-gray-700">
                Total Purchases:{" "}
                <span className="text-empoweredFlag">
                  {course.total_purchases || 0}
                </span>
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {/* <p>{course?.total_hours} hours course</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

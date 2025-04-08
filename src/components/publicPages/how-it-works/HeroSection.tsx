import Link from "next/link";
import {Hero_svg} from "@/assets/index.js";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import Image from "next/image";
const HeroSection = () => {
  return (
    <>
      <div className="max-w-7xl font-poppins mx-auto">
        <div className="flex items-start  justify-center gap-8 mt-10">
          <div className="text-3xl md:text-4xl mt-10 text-center px-5 font-semibold">
            {" "}
            Begin Your Success Journey with <br />
            <span className="text-[#4A148C]">Three Easy Steps!</span>
          </div>
          <div className="relative bottom-5 md:block hidden">
            <Image
              src={Hero_svg.src}
              alt="Hero Section"
              width={100}
              height={100}
              priority={true}
              loading="eager"
            />
          </div>
        </div>

        <div className="flex-grow md:hidden text-center mt-5 md:mt-0">
          <Link href="/student-to-mentor-1">
            <CustomButton
              className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
              text="Find Your Perfect Mentor"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

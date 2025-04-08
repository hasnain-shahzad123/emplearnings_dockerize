import Image from "next/image";
import Link from "next/link";
import { Hero_image, hero_svg2, hero_svg3 } from "@/assets/index";
import CustomButton from "../../shared/CustomButton/CustomButton";
const HeroSection = () => {
  return (
    <>
      {/* defining max width here */}
      <div className="max-w-7xl mx-auto mt-[8%]">
        <div className="flex justify-center md:w-[90%] mx-auto lg:w-full mb-10 flex-wrap gap-8">
          <div className="mt-[70px] w-[80%] mx-auto md:mx-0 md:w-[60%] lg:w-[45%]">
            {/* Responsive heading */}
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-Inter tracking-wide text-center md:text-left font-semibold">
              <span className="text-[#4A148C]">Learn </span>Anything,
              <br className="hidden md:block" /> Succeed Everywhere!
            </h1>

            {/* Responsive paragraph */}
            <p className="mt-5 text-[#928E8E] font-poppins hidden md:block text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed">
              <span className="text-[#4A148C]">EmpowerEd Learnings </span>
              connects you with experts in academic tutoring, skill development,
              and life or career coaching. Whatever your goal, we have a mentor
              to empower you on your path to success!
            </p>

            <div className="flex md:flex-col flex-col-reverse">
              {/* Responsive button */}
              <div className="mt-10 md:mx-0 mx-auto">
                <Link href="/student-to-mentor-1">
                  <CustomButton
                    className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
                    text="Find Your Perfect Mentor"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* div for the image */}
          <div className="relative  rounded-full pt-5">
            <Image
              src={Hero_image.src}
              alt="Hero Section Image"
              height={1700}
              width={1700}
              className="object-cover rounded-full h-[400px] w-[400px]"
            />
            <p className="text-center mt-4 font-poppins"></p>

          </div>
          <div>
            <p className="mt-5 text-[#928E8E] p-5 text-center font-poppins block md:hidden text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed">
              <span className="text-[#4A148C] ">EmpowerEd Learnings </span>
              connects you with experts in academic tutoring, skill development,
              and life or career coaching. Whatever your goal, we have a mentor
              to empower you on your path to success!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

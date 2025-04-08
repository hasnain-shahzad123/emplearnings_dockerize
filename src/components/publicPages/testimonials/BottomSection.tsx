import Image from "next/image";
import { B_section1 } from "@/assets";
import Link from "next/link";
import { B_section2 } from "@/assets";
import { GradientBackground } from "@/assets";
const BottomSection = () => {
  return (
    <div className="grid-background border-2 rounded-2xl ">
      <div className="h-auto max-w-7xl  flex flex-col justify-center w-[95%] md:w-[100%] items-center mx-auto">
        {/* Text Section */}
        <div className="pt-8 px-5 md:px-0 md:pt-10 text-center leading-8 font-semibold font-poppins w-full md:w-[60%]">
          <h1 className="text-white text-md sm:text-lg md:text-2xl lg:text-3xl">
            Discover Your Ideal Mentor for Unmatched Personal Growth and
            Success!
          </h1>
        </div>

        {/* Content Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full">
          {/* Left SVG (shown on mobile) */}
          <div className="mt-5 md:mt-0 flex-shrink-0 relative bottom-[50%]">
            <Image
              src={B_section1.src}
              alt="Bottom Section Image"
              width={300}
              height={250}
              className="w-full md:w-[250px] lg:w-[300px] h-auto object-contain"
            />
          </div>

          {/* Center Button */}
          <div className="flex-grow text-center mt-5 md:mt-0">
            <Link href="/student-to-mentor-1">
              <button className="bg-[#ffffff]  hover:scale-105 transform transition duration-200 px-6 py-3 font-poppins rounded-full text-black text-sm md:text-lg">
                Find Your Perfect Mentor
              </button>
            </Link>
          </div>

          {/* Right SVG (hidden on mobile, shown on desktop) */}
          <div className="hidden md:block flex-shrink-0">
            <div className="mt-5 md:mt-0">
              <Image
                src={B_section2.src}
                alt="Bottom Section Image"
                width={300}
                height={250}
                className="w-full md:w-[250px] lg:w-[300px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSection;

import Image from "next/image";
import Link from "next/link";
import { HIW_bottom_img1 } from "@/assets/index";
import { HIW_bottom_img2 } from "@/assets/index";
import CustomButton from "../../shared/CustomButton/CustomButton";

const BottomSection = () => {
  return (
    <div className="w-full bg-[#F9F9F9] border-[#DBDBDB] border-2 rounded-2xl">
      {/* Inner Container */}
      <div className="h-auto max-w-7xl mx-auto flex flex-col justify-center w-[95%] md:w-[100%] items-center ">
        {/* Text Section */}
        <div className="pt-10  sm:text-md md:text-2xl font-semibold w-full px-5 md:px-0 md:w-[45%] text-center font-poppins">
          See the Impact for Yourself – Take Our Assessment and Start Your
          Journey Today!
        </div>

        {/* Content Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full ">
          {/* Left SVG (shown on mobile) */}
          <div className="mt-5 md:mt-0">
            <Image
              src={HIW_bottom_img1.src}
              alt="How it works"
              className="w-full md:w-[250px] lg:w-[300px] h-auto"
              height={263}
              width={344}
            />
          </div>

          {/* Center Button */}
          <div className="flex-grow text-center mt-5 md:mt-0">
            <Link href="/student-to-mentor-1">
              <CustomButton
                className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
                text="Find Your Perfect Mentor"
              />
            </Link>
          </div>

          {/* Right SVG (hidden on mobile, shown on desktop) */}
          <div className="hidden md:block">
            <Image
              src={HIW_bottom_img2.src}
              alt="How it works"
              className="w-full md:w-[250px] lg:w-[300px] h-auto"
              height={263}
              width={344}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSection;

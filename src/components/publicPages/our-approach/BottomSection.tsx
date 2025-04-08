import Image from "next/image"
import Link from "next/link"
import { cup_person } from "@/assets/index";
import CustomButton from "../../shared/CustomButton/CustomButton";

const BottomSection = () => {
  return (
    <>
      <div className=" max-w-7xl mx-auto mt-24 ">
        <div className="pt-10 bg-[#F9F9F9] pb-[70px] md:pb-[120px] mt-10 relative">
          <div className="flex flex-col justify-center items-center">
            <div className="w-[50%] sm:w-[65%] mr-[165px] md:mr-[180px] lg:mr-[260px] mx-auto">
              <p className="text-center text-[#8228BB] font-poppins">
                EmpowerEd Learnings goes beyond academics, offering tutoring,
                life coaching, and skill development. Our platform helps
                students excel in school and thrive in life.
              </p>
            </div>

            <Image
              src={cup_person}
              alt="Person Holding Cup Image"
              className="absolute h-[179px] w-[179px] -right-0 top-3 sm:-right-0 sm:-top-6 md:h-[259px] md:w-[259px] lg:h-[339px] lg:w-[339px] md:-right-0 md:-top-12"
              priority={false}
              loading={"lazy"}
              height={2850}
              width={2850}
            />

            <div className="mt-10">
              <Link href="/student-to-mentor-2">
                <CustomButton
                  className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
                  text="Find Your Perfect Mentor"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default BottomSection;
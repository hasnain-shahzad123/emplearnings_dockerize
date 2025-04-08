import Image from "next/image";
import { back } from "@/assets/index";
import Link from "next/link";
import BackBtn from "../../personel_info/Commonlayout/BackBtn";
const HeroSection = () => {
    return (
      <>
        {/* Back Button */}
        {/* <Link href={"/"} className="flex justify-start px-5 pt-3">
          <Image
            src={back.src}
            alt="Back"
            height={40}
            width={40}
            className="h-[60px] w-[60px] hover:bg-gray-100 rounded-full p-2 cursor-pointer"
          />
        </Link> */}
        <div className="flex justify-start px-5 pt-3">
          <BackBtn />
        </div>
        {/* Main Content */}
        <div className="flex flex-col max-w-7xl mx-auto px-5 mt-10 items-center">
          <div>
            <h1 className="text-4xl font-semibold text-empoweredFlag">
              My Courses
            </h1>
          </div>
          <div className="mt-10">
            <p className="text-[#727272] text-center text-xl">
              Welcome to your Course Hub. Here you can add, view and Manage your
              Courses.
            </p>
          </div>
        </div>
      </>
    );
};
export default HeroSection;
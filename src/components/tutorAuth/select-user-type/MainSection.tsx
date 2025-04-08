import React from "react";
import Image from "next/image";
import {selectUserType} from "@/assets/index";
import { Logo } from "@/assets/index";
import Link from "next/link";
const MainSection = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full md:w-1/2 flex flex-col mt-[50px]  justify-center items-center bg-white p-10">
        <div className="text-center mb-2">
          <div className="flex justify-center items-center">
            <Image
              src={Logo}
              alt="Logo Image"
              height={40}
              width={40}
              className="h-15 w-15"
            />
            <h1 className="text-lg  font-bold  inline">
              Empower<span className="text-[#4A148C]">Ed</span> Learnings
            </h1>
          </div>

          <h1 className="font-bold text-2xl mt-4">Create an account</h1>
          <p className="text-sm text-[#4A148C] pt-1">
            Empower Your Journey Learn, Teach, Transform.
          </p>
        </div>

        {/*Two Buttons */}
        <div className="w-full border-[1px]  max-w-sm pt-2 p-5 mt-10 rounded-3xl">
          <h1 className="text-center font-bold text-empoweredFlag py-2">
            Choose your Sign in Option
          </h1>
          <Link href={"/login"}
            className="w-full hover:bg-white hover:text-black border font-semibold text-white bg-empoweredFlag flex items-center justify-center border-black rounded-3xl py-2 mt-5"
          >
            Continue as Mentor
          </Link>

          <Link href={"/student-login"} className="w-full hover:bg-white hover:text-black bg-empoweredFlag text-white font-semibold flex items-center justify-center border border-black rounded-3xl py-2 mb-2 mt-3">
            Continue as Student
          </Link>
        </div>
      </div>

      <div className="md:w-1/2  md:flex justify-center items-center hidden absolute top-10 right-10">
        <Image
          src={selectUserType}
          alt="Girl with headphones"
          height={1800}
          width={1800}
          className="w-[500px] h-[500px] ml-2  object-cover"
          priority={true}
        />
      </div>
    </div>
  );
};
export default MainSection;
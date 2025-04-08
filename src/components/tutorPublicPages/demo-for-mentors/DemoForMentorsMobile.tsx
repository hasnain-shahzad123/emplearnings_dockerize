"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Logo, desclaimer, demo_for_mentors, back } from "@/assets";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { useRouter } from "next/navigation";
import { useAlert } from "@/contexts/AlertContext";
import { z } from "zod";
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
const DemoForMentorsMobile = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const handleSubmit = () => {
    try {
      emailSchema.parse({ email: inputValue });
      router.push(`demo-calender/${inputValue}`);
    } catch (e) {
      setEmailError("Please enter a valid email address");
      console.log("email error : ", e);
    //  alert("Please Enter a valid email address");
    showAlert("Please Enter a valid email address", "ERROR");
    }
  };
  return (
    <div className="max-w-7x md:hidden mx-auto px-5 py-7">
      <div className="flex flex-col items-center mt-[20%] justify-center gap-5">
        <div className="flex flex-row items-center gap-3">
          <div>
            <Image
              src={Logo}
              alt="Logo Image"
              className="md:h-[45px] md:w-[45px] h-[35px] w-[35px]"
            />
          </div>
          <div>
            <Link href="/">
              <h2 className="font-semibold">
                Empower<span className="text-[#4A148C]">Ed</span> Learnings
              </h2>
            </Link>
          </div>
        </div>
        <div>
          <h1 className="text-3xl text-[#4A148C] font-semibold">
            Demo For Mentors
          </h1>
        </div>
        
        <div className="bg-[#EAEAF9] items-center flex gap-3 p-5 text-[12px] rounded-xl border-[#4A148C] border-[2px]">
          <Image src={desclaimer.src} alt="desclaimer" width={30} height={30} />
          <h1>
            Mentors/tutors can book demo with the admin team to get their
            queries answered, clear any confusion and understand the platform
            much better.
          </h1>
        </div>
        <div>
          <h1 className="text-[16px] px-3 sm:text-lg text-[#4A148C]">
            If you are interested in booking a demo with our team, just provide
            your email and answer a few basic questions.
          </h1>
        </div>
      </div>
      <div className="relative">
        {/* {isFocused && (
          <label className="absolute p-1 -top-3 bg-white left-2 text-xs">
            Your Email (input email)
          </label>
        )} */}
        <input
          type="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={!isFocused ? "Your Email (input email)" : ""}
          className="w-full my-7 py-3 px-4 border border-gray-300 text-[#4A148C] rounded-xl outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
        />
      </div>
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="hover:cursor-pointer">
          <Link href="/work-with-us" prefetch={true}>
            <Image src={back} alt="Back Button" height={45} width={45} />
          </Link>
        </div>
        <div>
          <CustomButton
            onclickEvent={handleSubmit}
            className="bg-[#4A148C] px-4 sm:px-7 py-2 sm:py-3 font-poppins text-white rounded-3xl sm:rounded-3xl"
            text="Admin Calender"
          />
        </div>
      </div>
    </div>
  );
};

export default DemoForMentorsMobile;

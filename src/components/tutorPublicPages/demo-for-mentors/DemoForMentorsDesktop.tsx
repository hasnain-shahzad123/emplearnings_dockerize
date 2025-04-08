"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/assets";
import { demo_for_mentors, desclaimer, back } from "@/assets";
import { useAlert } from "@/contexts/AlertContext";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { z } from "zod";
import { useRouter } from "next/navigation";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const DemoForMentorsDesktop = () => {
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
      // alert("Please Enter a valid email address");
      showAlert("Please Enter a valid email address", "ERROR");
    }
  };
  return (
    <div className="max-w-7xl md:block hidden mx-auto py-10 px-10 h-screen">
      <div className="flex flex-row items-center justify-between">
        <div className="flex  flex-col w-[60%] mx-auto justify-center gap-10">
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex flex-row items-center gap-3">
              <div>
                <Image
                  src={Logo}
                  alt="Logo Image"
                  className="md:h-[55px] md:w-[55px] h-[35px] w-[35px]"
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
                Book a Demo Call
              </h1>
            </div>
            <div className="bg-[#EAEAF9] items-center flex gap-3 p-5 text-[14px] rounded-xl border-[#4A148C] border-[2px]">
              <Image
                src={desclaimer.src}
                alt="desclaimer"
                width={30}
                height={30}
              />
              <h1>
                Mentors/tutors can book demo with the admin team to get their
                queries answered, clear any confusion and understand the
                platform much better.
              </h1>
            </div>
            <div>
              <h1 className="text-lg text-[#4A148C]">
                To get started, please share your email address so we can
                confirm your booking and send you call details.
              </h1>
            </div>
          </div>
          <div className="relative">
            <label
              className={`absolute p-1 left-2 text-xs bg-white transition-all duration-300 
      ${isFocused ? "-top-3 opacity-100" : "top-3 opacity-0"}`}
            >
              Your Email (input email)
            </label>
            <input
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={!isFocused ? "Your Email (input email)" : ""}
              className="w-[70%] p-3 border border-gray-300 text-[#4A148C] transition-all duration-300 rounded-xl outline-none focus:outline-none focus:ring-2 focus:ring-purple-800"
            />
          </div>

          <div className="flex pb-5 flex-row justify-start gap-4 items-center">
            <div className="hover:cursor-pointer">
              <Link href="/work-with-us" prefetch={true}>
                <Image
                  src={back}
                  alt="Back Button"
                  height={45}
                  width={45}
                  className="h-15 w-15"
                />
              </Link>
            </div>
            <div>
              <CustomButton
                onclickEvent={handleSubmit}
                className="bg-[#4A148C] px-7 py-3 font-poppins text-white rounded-3xl"
                text="Admin Calender"
              />
            </div>
          </div>
        </div>
        {/* <div className="flex-1">
          <Image src={demo_for_mentors} alt="Demo For Mentors" />
        </div> */}
      </div>
    </div>
  );
};

export default DemoForMentorsDesktop;

"use client";
import Accordion from '@/components/shared/accordian/Accordian';
import { email_logo, facebook_logo, footer_logo, instagram_logo, linkedin_logo, twitter_logo } from '@/assets'
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image'
import Link from "next/link";
interface FaqItem{
  Question: string;
  Answer: string;
}

const FooterDesktop = ({
  studentFaq,
  tutorFaq,
}: {
  studentFaq: FaqItem[];
  tutorFaq?: { Question: string; Answer: string }[];
}) => {
  const router = useRouter();
  const routerTutor = useRouter();

  const [isMentorAccOpen, setMentorAccOpen] = useState(false);
  const [isStudentAccOpen, setStudentAccOpen] = useState(false);

  const toggleTutorAccordion = () => {
    if (isMentorAccOpen) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    setMentorAccOpen(!isMentorAccOpen);
  };

  const toggleStudentAccordion = () => {
    if (isStudentAccOpen) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    setStudentAccOpen(!isStudentAccOpen);
  }


  return (
    <div className="bg-[#200048] text-white py-12">
      <div className="max-w-8xl px-5 mx-auto flex py-5 flex-col justify-between gap-16 items-center">
        <div className="flex flex-row justify-between gap-20 items-start">
          <div>
            <div className="flex flex-row items-start gap-5">
              <div>
                <Image
                  src={footer_logo}
                  alt="Footer Logo"
                  width={40}
                  height={40}
                  className="h-20 w-20"
                />
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="text-xl font-semibold mb-3">
                  Empower<span className="text-[#4A148C]">Ed</span> Learnings
                </div>
                <div className="text-[#D2CFCF] text-[15px]">
                  Master Any Skill, Anytime
                  <br /> Empowered Learnings
                  <br /> Has You Covered!
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl font-semibold mb-3">Our Company</div>
            <Link
              href={"/our-approach"}
              className="text-[#D2CFCF] hover:text-white text-[15px]"
            >
              Our Story
            </Link>
            <p
              onClick={toggleStudentAccordion}
              className="text-[#D2CFCF] cursor-pointer hover:text-white text-[15px]"
            >
              FAQs
            </p>
            <Link
              href={"/contact-us"}
              className="text-[#D2CFCF] hover:text-white text-[15px]"
            >
              Contact Us
            </Link>
            <Link
              href={"/agreement"}
              className="text-[#D2CFCF] hover:text-white text-[15px]"
            >
              Terms and Conditions
            </Link>
          </div>
          <div className="flex flex-col">
            <Link href=""></Link>
            <div className="text-xl font-semibold mb-3">Work with Us</div>
            <Link
              href={"/work-with-us"}
              className="text-[#D2CFCF] hover:text-white text-[15px]"
            >
              Become a Mentor
            </Link>
            <p
              onClick={toggleTutorAccordion}
              className="text-[#D2CFCF] cursor-pointer hover:text-white text-[15px]"
            >
              FAQs
            </p>

            <Link
              href={"/contact-us"}
              className="text-[#D2CFCF] hover:text-white text-[15px]"
            >
              Contact us
            </Link>
            <Link
              href={"/tutor-agreement"}
              className="text-[#D2CFCF] hover:text-white text-[15px]"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
        <div className="w-[500px] mx-auto border-t-2 border-b-2 border-[#939393]">
          <div className="flex flex-row items-center justify-around">
            <div className="flex flex-col items-center justify-center py-3 px-5">
              <div className="text-xl font-semibold mb-3">
                Let’s Keep in Touch
              </div>
              <div className="flex flex-row items-center gap-3">
                <a href="#">
                  <Image
                    src={facebook_logo}
                    alt="Social Media Icon"
                    height={20}
                    width={20}
                  />
                </a>
                <a href="#">
                  <Image
                    src={linkedin_logo}
                    alt="Social Media Icon"
                    height={20}
                    width={20}
                  />
                </a>
                <a href="#">
                  <Image
                    src={instagram_logo}
                    alt="Social Media Icon"
                    height={20}
                    width={20}
                  />
                </a>
                <a href="#">
                  <Image
                    src={twitter_logo}
                    alt="Social Media Icon"
                    height={20}
                    width={20}
                  />
                </a>
                <a href="#">
                  <Image
                    src={email_logo}
                    alt="Social Media Icon"
                    height={20}
                    width={20}
                  />
                </a>
              </div>
            </div>
            {/* <div className="border-r-2 border-[#812424] h-24 w-2"></div>
              <div className="flex flex-col items-center justify-center py-3 px-5">
                <Link href={""} className="text-xl font-semibold mb-3">
                  Need More Help?
                </Link>
                <Link
                  href={"/demo-for-mentors"}
                  className="text-[#D2CFCF] hover:text-white text-[15px] "
                >
                  Book a demo Call
                </Link>
              </div> */}
          </div>
        </div>
      </div>
      <div className="mt-10 ml-24 text-[#D2CFCF] text-[14px]">
        © 2024 -2025 Empowered Learnings Inc- All Rights Reserved
      </div>
      {isMentorAccOpen && (
        <div
          className="inset-0 bg-white  overflow-auto fixed "
          style={{ zIndex: 9999 }}
        >
          <Accordion onToggle={toggleTutorAccordion} items={tutorFaq} />
        </div>
      )}
      {isStudentAccOpen && (
        <div
          className="inset-0 bg-white  overflow-auto fixed "
          style={{ zIndex: 9999 }}
        >
          <Accordion onToggle={toggleStudentAccordion} items={studentFaq} />
        </div>
      )}
    </div>
  );
};

export default FooterDesktop

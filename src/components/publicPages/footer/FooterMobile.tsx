'use client'
import { email_logo, facebook_logo, footer_logo, instagram_logo, linkedin_logo, twitter_logo } from '@/assets'
import { useState } from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Accordion from '@/components/shared/accordian/Accordian';
import Image from "next/image"
interface FaqItem{
  Question: string;
  Answer: string;
}
const FooterMobile = ({
  studentFaq,
  tutorFaq,
}: {
  studentFaq: FaqItem[];
  tutorFaq?: { Question: string; Answer: string }[];
}) => {
  const routerTutor = useRouter();
  const router = useRouter();
  const [isCompanyOpen, setCompanyOpen] = useState(false);
  const [isWorkWithUsOpen, setWorkWithUsOpen] = useState(false);
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
 };
  return (
    <div className="max-w-7xl mx-auto py-3 px-5 bg-[#200048] text-white">
      <div className="flex flex-col items-center justify-between gap-5 max-w-[340px] mx-auto">
        <div className="py-3 flex flex-col items-center justify-center gap-3 border-b-[1px] border-[#939393] w-[340px]">
          <div className="flex flex-row items-center justify-center gap-3">
            <div>
              <Image
                src={footer_logo}
                alt="Footer Logo"
                width={30}
                height={30}
              />
            </div>
            <div className="text-lg font-semibold">
              Empower<span className="text-[#4A148C]">Ed</span> Learnings
            </div>
          </div>
          <div className="text-center text-[#D2CFCF] text-[12px]">
            Master Any Skill, Anytime Empowered Learnings Has You Covered!
          </div>
        </div>
        <div className="py-3 border-b-[1px] border-[#939393] w-[340px]">
          <div className="flex flex-col items-center justify-center py-3 px-5">
            <div className="text-lg font-semibold mb-3">
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
        </div>
        <div className="flex flex-col items-center justify-center gap-5 py-3 border-b-[1px] border-[#939393] w-[340px]">
          <div className="flex flex-row items-center justify-center gap-3">
            <div className="text-lg">Our Company</div>
            <div>
              <button onClick={() => setCompanyOpen(!isCompanyOpen)}>
                {isCompanyOpen ? "-" : "+"}
              </button>
            </div>
          </div>
          {isCompanyOpen && (
            <div className="flex flex-col items-center gap-3 justify-center text-[12px] text-[#D2CFCF]">
              <Link href={"/our-approach"}>Our Story</Link>
              <p
                onClick={toggleStudentAccordion}
                className="text-[#D2CFCF] cursor-pointer hover:text-white text-[15px]"
              >
                FAQs
              </p>
              <Link href={"/contact-us"}>Contact Us</Link>
              <Link href={"/agreement"}>Terms and Conditions</Link>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-5 py-3 border-b-[1px] border-[#939393] w-[340px]">
          <div className="flex flex-row items-center justify-center gap-3">
            <div className="text-lg">Work with Us</div>
            <div>
              <button onClick={() => setWorkWithUsOpen(!isWorkWithUsOpen)}>
                {isWorkWithUsOpen ? "-" : "+"}
              </button>
            </div>
          </div>
          {isWorkWithUsOpen && (
            <div className="flex flex-col items-center gap-3 justify-center text-[12px] text-[#D2CFCF]">
              <Link href={"/work-with-us"}>Become a Mentor</Link>
              <p
                onClick={toggleTutorAccordion}
                className="text-[#D2CFCF] cursor-pointer hover:text-white text-[15px]"
              >
                FAQs
              </p>
              <Link href={"/contact-us"}>Contact Us</Link>
              <Link href={"/tutor-agreement"}>Terms and Conditions</Link>
            </div>
          )}
        </div>
        {/* <div className="py-3 border-b-[1px] border-[#939393] w-[340px]">
           <div className="flex flex-col items-center justify-center py-3 px-5">
            <Link href={""} className="text-lg font-semibold mb-3">
              Need More Help?
            </Link>
            <Link
              href={"/demo-for-mentors"}
              className="text-[#D2CFCF] text-[14px] "
            >
              Book a demo Call
            </Link>
          </div> 
        </div> */}
        <div className="py-3 text-center text-[#D2CFCF] text-[12px]">
          © 2024 -2025 Empowered Learnings Inc- All Rights Reserved
        </div>
      </div>
      {isMentorAccOpen && (
        <div
          className="inset-0 bg-black  overflow-auto fixed "
          style={{ zIndex: 9999 }}
        >
          <Accordion onToggle={toggleTutorAccordion} items={tutorFaq} />
        </div>
      )}
      {isStudentAccOpen && (
        <div
          className="inset-0 bg-black  overflow-auto fixed "
          style={{ zIndex: 9999 }}
        >
          <Accordion onToggle={toggleStudentAccordion} items={studentFaq} />
        </div>
      )}
    </div>
  );
};

export default FooterMobile

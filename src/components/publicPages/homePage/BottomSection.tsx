"use client";
import Image from "next/image";
import Link from "next/link";
import Accordion from "../../shared/accordian/Accordian";
import { cup_person } from "@/assets/index";
import { useState } from "react";
import CustomButton from "../../shared/CustomButton/CustomButton";

const BottomSection = () => {
  const [activeAccrodian, setActiveAccrodian] = useState(false);
  const switchAccordion = () => {
     window.scrollBy({
       top: -25,
       behavior: "smooth",
     });
    setActiveAccrodian(!activeAccrodian);
  };

  const homePageFAQ = [
    {
      Question: "How does EmpowerEd Learnings work?",
      Answer:
        "EmpowerEd Learnings connects students with expert mentors in three categories: Academic Tutoring, Life Coaching, and Skill Development. You can choose a mentor in your desired area and schedule classes based on your availability. Our platform offers personalized learning with flexible scheduling options.",
    },
    {
      Question: "How do I get charged?",
      Answer:
        "All mentors on the platform offer three tiers of classes: once a week, twice a week, or three times a week. You can select the option that best fits your learning needs. Once you've made your choice, payments will be billed monthly on a recurring basis.",
    },
    {
      Question: "Why should I sign up for at least 4 classes?",
      Answer:
        "Consistent learning is the key to real progress! Research shows that committing to at least 4 classes helps you build momentum and achieve better results. Our flexible options—once, twice, or three times a week—make it easy to stay on track. Choose the option that fits your schedule and start making meaningful strides toward your goals",
    },
    {
      Question: "Are my payments secure?",
      Answer:
        "Yes, payments are processed securely on a monthly basis according to the class option you choose. You'll receive notifications about upcoming charges, so you always know what to expect.",
    },
    {
      Question: "Can I cancel my payments at any time?",
      Answer:
        "Yes, you can cancel your payments at any time. However, we recommend canceling at least 10 days prior to the next billing cycle to avoid being charged for the upcoming month",
    },
    {
      Question: "Can I try a free class before committing?",
      Answer:
        "Some mentors offer a free trial class. If available, you can take advantage of this opportunity to experience the mentor’s teaching style before making a commitment.",
    },

    {
      Question: "What features does my personal dashboard include?",
      Answer:
        "Once you sign up, your dashboard provides tools to enhance your learning experience, including: tracking your progress, accessing teacher notes, viewing purchased courses, scheduling and rescheduling classes, receiving reminders and notifications, and communicating with your mentor outside of class hours.",
    },
    {
      Question: "What if I need to reschedule a class?",
      Answer:
        "You can reschedule your classes through your dashboard. Simply check the mentor's availability and choose a new time that works for both of you.",
    },
    {
      Question: "How do I communicate with my mentor outside of class time?",
      Answer:
        "Your dashboard allows you to send messages to your mentor. This feature makes it easy to ask questions or get additional support as needed.",
    },
    {
      Question: "Are there any refunds available?",
      Answer:
        "EmpowerEd Learnings does not offer refunds. Please ensure to cancel your payment before the next billing cycle to avoid further charges.",
    },
    {
      Question: "Who should I contact for help and support?",
      Answer:
        "For any technical support or issues using the EmpowerEd Learnings platform, our team is here to assist you. However, if you have questions about scheduling, rescheduling, or payments, please reach out directly to your mentor. EmpowerEd Learnings does not take commissions or manage mentor earnings—we're dedicated to empowering both students and mentors by providing a seamless platform to connect. Your mentor is the best point of contact for addressing any concerns related to scheduling or payments. ",
    },
  ];
  return (
    <>
      <div className="max-w-7xl  mx-auto">
        {activeAccrodian && (
          <Accordion onToggle={switchAccordion} items={homePageFAQ} />
        )}
      </div>
      <div id="faq-section" className="max-w-7xl mx-auto mt-24 ">
        <div className="flex justify-end mr-[5%] mt-[3%] font-poppins ">
          <button
            onClick={switchAccordion}
            className="bg-[#F9F9F9] hover:scale-105 transform transition duration-200 shadow-xl border-[2px] border-[#8228BB]  px-6 py-3 my-5 rounded-full"
          >
            FAQs & Support
          </button>
        </div>
        <div className="pt-10 bg-[#F9F9F9] pb-[70px] md:pb-[120px] mt-10 relative">
          <div className="flex flex-col justify-center items-center">
            <div className="w-[50%] px-2 sm:w-[65%] mr-[165px] md:mr-[180px] font-poppins lg:mr-[260px] mx-auto">
              <p className="text-center text-[#8228BB] ">
                EmpowerEd Learnings goes beyond academics, offering tutoring,
                life coaching, and skill development.
              </p>
              <p className="text-center mt-2">
                Our platform helps students excel in school and thrive in life.
              </p>
            </div>

            <Image
              src={cup_person}
              alt="Person Holding Cup Image"
              className="absolute h-[179px] w-[179px] -right-0 top-3 sm:-right-0 sm:-top-6 md:h-[259px] md:w-[259px] lg:h-[339px] lg:w-[339px] md:-right-0 md:-top-12"
            />

            <div className="mt-10">
              <Link href="/student-to-mentor-1">
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
};
export default BottomSection;

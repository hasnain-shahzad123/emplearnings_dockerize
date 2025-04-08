import Image from "next/image";
import Link from "next/link";
import { SvgStep1, SvgStep2, SvgStep3 } from "@/assets/index.js";
import CustomButton from "../../shared/CustomButton/CustomButton";
import {arrow} from "@/assets/index";


const EasySteps = () => {
  const steps =[
    {
      title: "Start Your Search",
      description:
        "Complete a quick questionnaire to help us understand your goals and needs.",   
      color: "#FF3D85",
      svg: SvgStep1,
    },
    {
      title: "Choose Your Mentor",
      description:
        "Browse a personalized list of recommended mentors tailored to your goals. Select the one that best fits your needs.",
      color: "#7841F9",
      svg: SvgStep2,
    },
    {
      title: "Book & Begin",
      description:
        "Pick a time that works for you, book your first session, and start your journey towards success and empowerment!",
        color:"#F8BE30",
      svg: SvgStep3,
    },
  ];

return (
  <div className="max-w-7xl mx-auto my-[10%]">
    <section className="bg-gray-100 w-[90%] mx-auto py-12 rounded-3xl px-6 sm:px-10">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Easy Steps to Get Started
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Follow these simple steps to enjoy our services.
        </p>
      </div>

      {/* Steps Section */}
      <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-6 lg:space-x-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center md:w-1/3 text-center relative px-4"
          >
            {/* SVG Container */}
            <div className="flex flex-col justify-start items-center h-full">
              <div className="flex justify-center items-center">
                <div
                  className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full flex justify-center items-center"
                  style={{ backgroundColor: step.color }}
                >
                  <div className="relative h-[60px] w-[60px] md:h-[70px] md:w-[70px]">
                    <Image src={step.svg.src} alt="SVG Icon" fill />
                  </div>
                </div>
              </div>

              {/* Content Section with proper alignment */}
              <div className="mt-4 text-center flex flex-col items-center h-full">
                <h3 className="text-xl md:text-2xl  font-semibold mb-2 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem]">
                  {step.title}
                </h3>
                <p className="text-md md:text-base text-gray-500  min-h-[2.5rem] sm:min-h-[3rem]">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute right-[-30px] top-1/4 transform -translate-y-1/2">
                <Image
                  src={arrow.src}
                  alt="Arrow"
                  width={52}
                  height={52}
                  className="transform rotate-90 md:rotate-0"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Button Section */}
      <div className="mt-12 flex justify-center">
        <Link href="/student-to-mentor-1">
          <CustomButton
            className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
            text="Find Your Perfect Mentor"
          />
        </Link>
      </div>
    </section>
  </div>
);



};

export default EasySteps;

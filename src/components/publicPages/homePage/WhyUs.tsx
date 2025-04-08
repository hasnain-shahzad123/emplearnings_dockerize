"use client"
import Image from "next/image";
import {
  Bottom_card1,
  Bottom_card2,
  Bottom_card3,
  Bottom_card4,
} from "@/assets/index";
import { useEffect, useState } from "react";
import CustomButton from "../../shared/CustomButton/CustomButton";

const WhyUs = () => {

  const switchAccordion = () => {
  }

  const cards = [
    {
      title: "Diverse Mentors",
      description:
        "We match you with experts who align with your specific needs and goals. Our diverse pool of mentors ensures that you receive the exact support you need",
      image: Bottom_card1.src,
    },
    {
      title: "Flexible Learning Options",
      description:
        "Enjoy personalized options including 1:1 live sessions, pre-recorded courses, test prep, and tutorials tailored to your pace and goals",
      image: Bottom_card2.src,
    },
    {
      title: "Quality Experience",
      description:
        "Access your mentor’s notes, learning materials, and timely updates through your personal dashboard for an organized and engaging experience",
      image: Bottom_card3.src,
    },
    {
      title: "Unlock your Full Potential",
      description:
        "We support not just your academic and career goals, but also your personal achievements, helping you unlock your full potential in all areas of life.",
      image: Bottom_card4.src,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect to auto-run the carousel
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [cards.length]);

  return (
    <div className="bg-[#F4F4F5]" >
      <div className="max-w-7xl pb-10 mx-auto">
        <div className="min-h-[500px] font-poppins">
          <h1 className="text-center py-10 text-2xl px-5 md:text-4xl font-semibold">
            Why Choose Empower<span className="text-[#4A148C]">Ed</span>{" "}
            Learnings?
          </h1>
          <div className="hidden md:flex justify-center flex-wrap gap-7">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white w-[90%] mx-auto md:mx-0 md:w-[35%] my-5 rounded-2xl flex flex-col border-[2px] border-[#D9D9D9]"
              >
                <div className="p-4 text-center flex-grow">
                  <h1 className="font-semibold text-xl py-5">{card.title}</h1>
                  <p>{card.description}</p>
                </div>
                <div className="relative ">
                  <Image
                    src={card.image}
                    height={800}
                    width={856}
                    alt={card.title}
                    className="object-cover h-[120px] w-full rounded-b-2xl"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Custom Carousel for smaller screens */}
          <div className="md:hidden ">
            <div className="bg-white w-full mx-auto my-5 rounded-2xl flex flex-col border-[2px] border-[#D9D9D9]">
              <div className="p-4 text-center flex-grow">
                <h1 className="font-semibold text-xl py-5">
                  {cards[currentIndex].title}
                </h1>
                <p>{cards[currentIndex].description}</p>
              </div>
              <div className="relative h-[120px] w-full">
                <Image
                  src={cards[currentIndex].image}
                  fill
                  alt={cards[currentIndex].title}
                  className="object-cover rounded-b-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;

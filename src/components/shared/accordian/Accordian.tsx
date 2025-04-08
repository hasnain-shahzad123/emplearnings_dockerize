"use client";
import { useEffect, useState } from "react";
import { Acc_arrow } from "@/assets/index";
import Image from "next/image";
import { cross_icon } from "@/assets/index";
import { AccordianProp } from "@/types/index";

const Accordion: React.FC<AccordianProp> = ({ onToggle, items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleClose = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const accordionItems = items || [
    // Assuming items is passed as a prop
    {
      Question: "What happens after the 1-month free trial?",
      Answer:
        "After your free trial ends, the plan you selected will automatically charge you based on your subscription (monthly, bi-annually, or annually). If you wish to cancel, please do so before the trial ends to avoid charges.",
    },
    {
      Question: "How can I keep track of my payments?",
      Answer:
        "We use a secure Stripe payment system. You can track all your payments directly on your personal dashboard, where you’ll see real-time updates on payments received, upcoming transactions, and any payment issues, all clearly laid out for your convenience.",
    },
    // Additional items...
  ];

  return (
    <div
      className={`flex transition-all duration-700 ease-in-out justify-center my-10 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="w-[90%] md:w-[80%] lg:w-[70%] bg-[#F9F9F9] shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-[50px] border border-[#000000]">
        <div className="flex justify-end items-center pb-4">
          
          <button onClick={handleClose}>
            <Image
              src={cross_icon.src}
              alt="Close Icon"
              height={20}
              width={20}
              className="md:h-8 md:w-8 h-6 w-6"
            />
          </button>
        </div>
        <div>
          {accordionItems.map((item, index) => (
            <div key={index} className="border-b border-[#000000] py-4">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between items-center w-full text-left text-gray-800 font-medium"
              >
                <span className="text-base md:text-lg">{item.Question}</span>
                <span
                  className={`transform ${
                    activeIndex === index ? "rotate-90" : ""
                  } transition-transform`}
                >
                  <Image
                    src={Acc_arrow.src}
                    alt="Accordion Arrow"
                    height={20}
                    width={20}
                    className="h-5 w-5"
                  />
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  activeIndex === index
                    ? "max-h-auto opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-600 text-sm md:text-base px-4">
                  {item.Answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accordion;

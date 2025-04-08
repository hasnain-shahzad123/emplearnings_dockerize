"use client"
import { useState } from "react";
import offers from "./offeredData";
import Accordion from "../../shared/accordian/Accordian";
import Image from 'next/image';
import { Crown } from "@/assets";
const Offered = () =>{
  const [activeAccrodian, setActiveAccrodian] = useState(false);
  const switchAccordion = () => {
    setActiveAccrodian(!activeAccrodian);
  };

    const workWithUsFAQ = [
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
      {
        Question: "What is the demo call?",
        Answer:
          "Our admin team will walk you through the platform, explain the different subscription plans, and help you choose the best plan for your business needs during the demo call. It’s a great way to get an inside look at how everything works.",
      },
      {
        Question: "What’s included with onboarding and tech support?",
        Answer:
          "Once you subscribe, a dedicated team member will guide you through setting up your profile, showcasing your offers, and advising on effective marketing strategies. We also provide ongoing support for any technical issues related to the website, platform, or payment system. (The registration fee covers these services.)",
      },
      {
        Question: "How do you handle marketing for me?",
        Answer:
          "Once your marketing efforts are active, our dedicated marketing team takes care of everything. For Pro and Premium plans, we use a mix of strategies like online ads, community events, and more. You can also add video features to ad campaigns for extra visibility. We provide campaign performance reports upon request, detailing reach, engagement, and leads. Our efforts go beyond social media, including community events and flyers to attract students and clients to your profile.",
      },
      {
        Question:
          "What if I want to cancel my subscription? What’s the refund policy?",
        Answer:
          "We do not offer refunds. If you are unsatisfied with the service, please cancel before the next billing cycle to avoid charges. You can cancel your plan directly through your dashboard at any time. Requirements: Reliable computer with audio and video capabilities, Strong Wi-Fi connection, Ability to teach and coach students virtually, Consistent hours with recurring weekly sessions, Willingness to offer a 25-minute free trial class, Ability to educate students across different age groups and academic levels. Required Skills and Qualifications: Bachelor’s degree or equivalent (preferred), At least one year of teaching experience, Excellent organizational and communication skills, Creative, positive, and energetic demeanor.",
      },
      {
        Question:
          "Ready to Empower and Be Empowered?",
        Answer:
          "Join EmpowerEd Learnings today and start running your own independent online mentoring business with all the support and tools you need to succeed. Our mission is to empower mentors like you so that you can empower others.Take advantage of our special offer and see how we can help you grow your student base and maximize your earnings.",
      },
    ];


    return (
      <>
        <div className="max-w-7xl mx-auto mt-20">
          <div className="flex flex-col px-5 text-center md:px-0 items-center mt-10 font-poppins">
            <h1 className="text-4xl font-bold">What We Offer?</h1>

            <p className="my-3 text-[#7A7A7A] w-[70%] ">
              At <span className="text-[#4A148C]">EmpowerEd Learnings</span>, we
              provide you with the platform and tools to make a meaningful
              impact on students’ lives through personalized and engaging online
              education.
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mt-[5%]">
            {offers.map((offer, index) =>
              index !== offers.length - 1 ? (
                <div
                  key={index}
                  className="flex flex-col md:flex-row text-center md:text-left items-center md:items-start gap-3 font-poppins mt-[3%] w-[350px]"
                >
                  <div
                    className={`${
                      index < 3 ? "bg-[#4A148C]" : "bg-[#F4F4F5]"
                    } p-2 rounded-full flex-shrink-0 w-[50px] h-[50px] flex items-center justify-center`}
                  >
                    <Image
                      src={offer.img.src}
                      alt="Picture of the author"
                      layout="fixed"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3">
                    <h1 className="font-bold text-[#4A148C]">{offer.title}</h1>
                    <p className="mt-5">{offer.description}</p>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex flex-col md:flex-row text-center md:text-left items-center md:items-start gap-3 font-poppins mt-[3%] w-[350px] bg-[#4A148C] px-5 py-7 rounded-xl"
                >
                  <div
                    className={
                      "bg-[#F4F4F5] p-2 rounded-full flex-shrink-0 w-[50px] h-[50px] flex items-center justify-center"
                    }
                  >
                    <Image
                      src={offer.img.src}
                      alt="Picture of the author"
                      layout="fixed"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 text-[#FFFFFF] relative">
                    <h1 className="font-bold ">{offer.title}</h1>
                    <p className="mt-5">{offer.description}</p>
                    <Image
                      src={Crown}
                      alt="Crown Image"
                      className="absolute -top-20 right-1 md:-top-7 md:-right-1"
                    />
                  </div>
                </div>
              )
            )}
          </div>

          <div className="border-t-[1px] w-[90%] mx-auto mt-[5%] border-black "></div>

          {activeAccrodian && (
            <Accordion onToggle={switchAccordion} items={workWithUsFAQ} />
          )}

          <div
            id="faq-section-tutors"
            className="flex justify-end mr-[5%] mt-[3%] font-poppins "
          >
            <button
              onClick={switchAccordion}
              className="bg-[#F9F9F9] border-[2px] border-[#8228BB] shadow-lg hover:scale-105 transform transition duration-200  px-6 py-3 my-5 rounded-full"
            >
              FAQs & Support
            </button>
          </div>
        </div>
      </>
    );
}
export default Offered;
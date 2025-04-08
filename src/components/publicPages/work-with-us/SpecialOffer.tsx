import { Clock, Special_offer, Star } from "@/assets/index";
import {Special_offer2} from '@/assets/index';
import {Requirements} from '@/assets/index';
import Image from "next/image";
const SpecialOffer = () => {

    const Requirement = [
      "Reliable computer with audio and video capabilities",
      "Strong Wi-Fi connection",
      "Ability to teach and coach students virtually",
      "Consistent hours with recurring weekly sessions",
      "Willingness to offer a 25-minute free trial class",
      "Ability to educate students across different age groups and academic levels",
      "Bachelor’s degree or equivalent (preferred)",
      "At least one year of teaching experience",
      "Excellent organizational and communication skills",
      "Creative, positive, and energetic demeanor"
    ];
    return (
      <>
        <div className="max-w-7xl mx-auto mt-[8%]">
          <div className=" w-[90%] mx-auto border-4 py-5 border-[#4A148C] rounded-2xl bg-[#F5F7FC]">
            <h1 className="text-center md:text-4xl text-2xl my-2 font-poppins font-semibold">
              Special Offer
            </h1>
            <div className="flex items-center px-5 md:px-0 gap-2 md:gap-8 justify-center">
              <div>
                <Image
                  src={Star}
                  alt="Special Offer Star"
                  className="md:h-[100%] md:w-[100%] h-[27px] w-[27px]"
                />
              </div>
              <h3 className="text-center md:text-2xl text-[12px] my-5 font-poppins">
                Don’t Miss Out on Our Early Bird Deal!
              </h3>
              <div>
                <Image
                  src={Clock}
                  alt="Special Offer Clock"
                  className="md:h-[100%] md:w-[100%] h-[27px] w-[27px]"
                />
              </div>
            </div>
            <p className="text-center mx-auto text-[11px] md:text-[18px] px-5 md:px-0 mb-5 font-poppin text-[#4A148C] w-[90%] lg:w[100%]">
              Enjoy 2 Month FREE – Absolutely Risk-Free, with No Registration
              Fees and No Subscription Costs. Limited Time Offer!
            </p>
          </div>
        </div>
      </>
    );
}   
export default SpecialOffer;
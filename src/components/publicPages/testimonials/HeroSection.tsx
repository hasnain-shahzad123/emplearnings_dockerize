import Image from "next/image";
import { trusted_families } from "@/assets/index";
import {HeroSection_image, space_rocket, spiral_arrow,clock} from '@/assets/index';

const HeroSection = () => {
  return (
    <>
      {/* defining max width here */}
      <div className="max-w-7xl mx-auto mt-[8%]">
        <div className="flex justify-center mb-[10%] mt-[10%] md:w-[90%] mx-auto lg:w-full  flex-wrap gap-8 lg:gap-[90px]">
          <div className="w-[80%] mt-7  mx-auto md:mx-0 md:w-[60%] lg:w-[45%]">
            {/* Responsive heading */}
            <h1 className="text-4xl  md:text-4xl  lg:text-5xl font-poppins tracking-wide text-center md:text-left font-semibold">
              Transformative Journeys with Empower
              <span className="text-[#4A148C]">Ed</span> Learnings
            </h1>

            {/* Responsive paragraph */}
            <p className="mt-5 font-poppins text-center leading-relaxed">
              What Our Tutors and Students Say: Real Stories, Real Success! What
            </p>
            <p className="flex justify-center mt-[5%] text-lg">
              <Image
              src={trusted_families.src}
              alt="trusted families"
              width={28}
              height={24}
              className="mr-2"
              />
              Trusted by&nbsp;<span className="font-semibold">100+</span>&nbsp;Families
            </p>
          </div>

          {/* div for the image */}
          <div className="relative ">
            <Image
              src={HeroSection_image.src}
              alt="Hero Section Image"
              priority={true}
              height={2400}
              width={2400}
              className="object-cover rounded-2xl h-[300px] w-[400px]"
            />
            {/* Rocket ship image */}
            <div className="absolute -top-[20px] sm:-top-[25px] md:-top-[30px] lg:-top-[37px] right-[10px] md:right-[15px] lg:right-[20px]">
              <Image 
                src={space_rocket}
                alt="Spiral Arrow Image"
                className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] md:w-[55px] md:h-[55px] lg:w-[65px] lg:h-[65px]"
              />
            </div>
            {/* Spiral Arrow on top of image */}
            <div className="absolute top-4 -left-[15px] sm:-left-[20px] md:-left-[25px] lg:-left-[50px]">
              <Image 
                src={spiral_arrow}
                alt="Spiral Arrow Image"
                className="w-[50px] h-[30px] sm:w-[70px] sm:h-[50px] md:w-[90px] md:h-[70px] lg:w-[110px] lg:h-[90px]"
              />
            </div>
            <p className="text-center mt-4 font-poppins">
              <Image
                src={clock.src}
                alt="Clock Image"
                width={34}
                height={37}
                className="inline h-7 w-7"/>{" "}
              <span className="font-semibold">2000+</span> Hours of Coaching
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

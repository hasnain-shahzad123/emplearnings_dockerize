import Image from "next/image";
import { bulb, snake_arrow,big_star } from "@/assets/index";

const Approach = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-[8%] text-4xl font-semibold relative">
          <svg
            width="106"
            height="73"
            viewBox="0 0 106 73"
            fill="none"
            className="absolute -top-14 left-1/2 transform -translate-x-1/2 hidden md:block w-20  h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.20142 24.2242C1.90764 23.208 1.85378 22.1375 2.04407 21.0969C2.23437 20.0564 2.66362 19.0742 3.29804 18.2277C3.93245 17.3812 4.75471 16.6936 5.70006 16.2189C6.64542 15.7443 7.68805 15.4955 8.74588 15.4923C13.2847 15.4022 16.3272 21.8287 18.8117 25.4636C25.78 35.5503 32.7344 45.6467 39.6747 55.7528C41.1738 57.9564 43.0586 59.8986 43.1011 62.5266C43.1545 66.3342 39.5368 69.3399 35.8601 69.3C31.7105 69.2637 29.1302 63.6368 26.3246 59.5542C20.4277 50.9379 15.9306 44.7148 10.2088 36.4292C7.66492 32.7367 3.46446 28.4373 2.20142 24.2242ZM48.5384 61.005C47.1677 53.9493 46.6231 43.0443 45.7978 34.3467C45.3232 29.4066 42.217 13.22 44.4143 8.61183C45.905 5.46221 51.6252 4.02695 54.5854 6.14372C58.8432 9.12634 58.7321 28.795 59.3956 35.9033L60.8985 52.0052C61.4202 57.5944 62.2423 63.2637 59.632 65.5714C58.2812 66.7431 54.2486 67.3809 52.6547 66.9618C50.1413 66.3491 49.2192 64.5333 48.5384 61.005ZM68.3256 60.9383C67.1383 56.619 71.7806 49.7186 73.3108 46.2678C77.6693 36.3744 80.2248 30.0518 85.0069 19.2896C86.6963 15.4679 89.0552 8.48768 93.0535 7.62777C96.8269 6.82039 100.312 9.29828 101.045 11.695C102.45 16.314 97.7015 23.337 96.3198 26.3503C91.9094 35.9286 88.9352 43.3178 84.3977 53.611C82.8122 57.1931 80.7094 64.4559 76.6242 65.4952C72.6677 66.5134 69.3121 64.5057 68.3256 60.9383Z"
              fill="#F8BE30"
            />
          </svg>

          <h1 className="font-poppins text-center">Our Approach</h1>
        </div>

        {/* Main container */}
        <div className="bg-[#F4F4F5] flex flex-col lg:flex-row rounded-3xl w-full md:w-[90%] h-auto mx-auto mb-10 mt-[80px] relative text-center">
          {/* Left section with purple rotated box and text */}
          <div className="w-full lg:w-[70%] text-[#7A7A7A] leading-8 pt-13 pl-15 p-10 lg:pl-[10rem] relative z-10 overflow-hidden">
            {/* Left rotated purple box */}
            <div className="bg-[#8B55CC] w-[20%] h-[140px] rotate-[80deg] rounded-tr-[20px] absolute top-[-30px] left-[-30px] z-20 hidden lg:block"></div>
            <Image
              src={snake_arrow.src}
              alt="Snake Arrow Image"
              width={216}
              height={225}
              className="absolute hidden lg:block left-2 top-4 z-30"
            />
  
            {/* Text content */}
            <p>
              At{" "}
              <span className="text-[#4A148C] font-poppins">
                EmpowerEd Learnings,
              </span>{" "}
              we believe success goes beyond just academics. While other
              tutoring platforms focus solely on subject tutoring, we offer a
              one-stop shop for empowerment and growth. From academic tutoring
              to life coaching and skill development, our platform is designed
              to help students not only excel in school but also thrive in life.
            </p>
          </div>

          {/* Right purple block with image (allowing overflow) */}
          <div className="h-full w-full lg:w-[30%] relative overflow-visible">
            {/* Background with the sloped effect */}
            <div className="bg-[#8B55CC] h-full w-full rounded-r-3xl clip-sloped absolute top-0 right-0"></div>
            <Image
              src={bulb.src}
              alt="Bulb Image"
              width={112}
              height={118}
              className="absolute hidden lg:block top-5 right-48"
            />
            <Image
              src={big_star.src}
              alt="Big Star Image"
              width={113}
              height={99}
              className="absolute hidden lg:block bottom-8 right-36"/>
            {/* Image container with responsive styles */}
            <div className="relative h-auto md:h-[330px] hidden lg:block bottom-[80px] right-[40px] z-[1000] overflow-visible"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approach;

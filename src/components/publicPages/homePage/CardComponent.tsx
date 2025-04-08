import Image from "next/image";
import { TestimonialCardProps } from "@/types/index";
import { singleQuote_1 } from "@/assets/index";
const CardComponent = ({
  imgSrc,
  name,
  title,
  testimonial,
  by,
  color, // Expecting a hex color string
}: TestimonialCardProps) => {
  return (
    <div
      className="relative  flex md:flex-row  flex-col items-center shadow-lg rounded-2xl border-[10px] border-white p-3 md:p-6 text-center   max-w-4xl mx-auto transition-all duration-300"
      style={{ backgroundColor: color }}
    >
      {/* Dynamic Image */}
      <div className="flex items-start justify-center pb-4">
        <Image
          src={imgSrc}
          alt={name}
          width={544}
          height={544}
          className="rounded-full object-cover h-[144px] w-[144px]"
        />
      </div>

      {/* Title and Testimonial Text */}
      <div className="w-[70%] font-poppins">
        <h3 className="text-lg md:text-xl font-semibold text-orange-600 mb-2">
          {title}
        </h3>

        <p className="text-gray-700 mb-4">{testimonial}</p>

        <p className="text-sm text-[#4A148C] font-semibold italic">By: {by}</p>
      </div>
    </div>
  );
};

export default CardComponent;

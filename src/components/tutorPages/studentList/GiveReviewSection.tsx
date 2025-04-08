import Image from "next/image";
import { cross_icon } from "@/assets/index";
interface GiveReviewSectionProps {
    onCloseModal: () => void;
    }
const GiveReviewSection = ({onCloseModal}:GiveReviewSectionProps) => {
    return (
      <>
        <div className="flex border-b-[1px] items-center justify-end px-5 py-3">
          <button onClick={onCloseModal}>
            <Image
              src={cross_icon.src}
              alt="cross"
              width={30}
              height={30}
              className="w-8 h-8 hover:scale-110 transition-all duration-300"
            />
          </button>
        </div>
        <div>
          <h1 className="text-empoweredFlag text-xl px-[8%] py-5 font-semibold">
            Write Your Review{" "}
          </h1>

          <div className="w-[90%] mx-auto">
            <textarea
              name=""
              id=""
              placeholder={
                "You have a great attitude and always bring positive energy to the class. Your hard work and dedication truly shine through in everything you do.Keep up the amazing effort—your potential is limitless!"
              }
              rows={5}
              className="w-full mx-auto resize-none border-[2px] border-[#989898] rounded-lg px-5 py-3"
             
            ></textarea>
          </div>
          <h1 className="text-empoweredFlag text-xl px-[8%] py-5 font-semibold">
            Rate Your Experience
          </h1>
        </div>
      </>
    );
}
export default GiveReviewSection;
"use client";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { useForm } from "@/contexts/studentFormContext";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useRouter } from "next/navigation";
type CardProp = {
  Title: string;
  Icon: StaticImport;
  Description: string;
};

const CustomCard = ({ Title, Description, Icon }: CardProp) => {
  const { dispatch, state } = useForm();
  const router = useRouter();
  const handleClick = (Title: string) => {
    try {
      dispatch({ type: "SET_STEP2", payload: { category: Title } });
      if (Title === "Academic Tutoring") {
        router.push(`/student-question?data=academic_tutoring`);
      } else if (Title === "Life Coaching") {
        router.push(`/student-question?data=life_coaching`);
      } else {
        router.push(`/student-question?data=skill_development`);
      }
    } catch (e: any) {
      alert("an unexpected error occurred" + e.toString());
    }
  };
  return (
    <div
      className="bg-white custom-shadow px-3 pt-3 pb-5 rounded-3xl flex flex-col justify-between items-center w-[300px] h-[350px] sm:h-[410px]
    hover:scale-110  transition-transform duration-300 ease-in-out
    sm:w-[460px]"
    >
      <div className="bg-[#4A148C] p-4 rounded-full">
        <Image src={Icon} alt="Icon Image" />
      </div>
      <div>
        <p>{Description}</p>
      </div>
      <div>
        <CustomButton
          onclickEvent={() => handleClick(Title)}
          className="py-3 px-10 my-5 rounded-full text-white mt-10 bg-[#4A148C]"
          text={Title}
        />
      </div>
    </div>
  );
};

export default CustomCard;

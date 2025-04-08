"use client";
import { useAlert } from "@/contexts/AlertContext";
import { cross } from "@/assets/index";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";


const CustomAlert = () => {
  const { message, type, cssClass, hideAlert } = useAlert();
  return (
    <div className={cssClass}>
      <div className="basis-11/12 text-center flex justify-center gap-4 items-center text-nowrap px-2 md:text-base">
        {type === "SUCCESS" && <FaCheck />}
        {type === "WARNING" && <RiErrorWarningFill />}
        {type === "INFO" && <FaInfoCircle />}
        {type === "ERROR" && <BiSolidError />}

        <div>{message}</div>
      </div>
      <button className="p-4 text-center" onClick={hideAlert}>
        <Image src={cross.src} alt="close" width={14} height={14}/>
      </button>
      <div
        className={`${
          type === "SUCCESS"
            ? "bg-green-500"
            : type === "ERROR"
            ? "bg-red-500"
            : type === "WARNING"
            ? "bg-yellow-500"
            : "bg-blue-500"
        } h-1.5 absolute bottom-0 left-0 right-0 animate-alert`}
      ></div>
    </div>
  );
};

export default CustomAlert;

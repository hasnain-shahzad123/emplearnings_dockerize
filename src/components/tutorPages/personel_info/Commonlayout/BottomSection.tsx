"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import CustomButton from "@/components/shared/CustomButton/CustomButton";
import path from "path";
const BottomSection = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [nextPage, setNextPage] = useState<string>("");
  const showPath=()=>{
    
    const part = pathname.split('/')
   const uid = part[part.indexOf('mentor-dashboard') + 1];
  
   const  currentPage = part[part.length-1]
    if(currentPage === 'bio'){
      router.push(`/mentor-dashboard/${uid}/education`)
      
    }
    else if(currentPage === 'education'){
      console.log('education')
      router.push(`/mentor-dashboard/${uid}/categories`)
    }
    else if (currentPage === "categories") {
      router.push(`/mentor-dashboard/${uid}/pricing`);
    } else if (currentPage === "pricing") {
    router.push(`/mentor-dashboard/${uid}/lesson-schedule`);
    } 
    else{
      router.push(`/mentor-dashboard/${uid}`);
    }
  }
  return (
    <>
      <div className="flex flex-row justify-end items-center my-10">
        <div>
          <button  onClick={showPath}>
            <CustomButton
              className="bg-[#4A148C] px-7 py-3 font-poppins text-white rounded-3xl"
              text="Continue"
            />
          </button>
        </div>
      </div>
    </>
  );
};
export default BottomSection;

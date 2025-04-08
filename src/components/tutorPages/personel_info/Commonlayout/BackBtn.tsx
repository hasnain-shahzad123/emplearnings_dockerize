"use client";
import Link from "next/link";
import Image from "next/image";
import { backBtn } from "@/assets/index";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BackBtn = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
       className="hover:scale-110 transform transition duration-300 ease-in-out"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
      >
        <Image
          src={backBtn.src}
          alt="Build your Profile"
          height={50}
          width={50}
          className="h-10 w-10 md:h-25 md:w-25"
        />
      </button>
    </>
  );
};

export default BackBtn;
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  bio,
  education,
  services,
  pricing,
  class_scheduling,
  bio_white,
  education_white,
  category_white,
  class_scheduling_white,
  pricing_white,
  settings_profile,
  settings_profile_white,
  settings_payment,
  settings_payment_white,
} from "@/assets";
import { backBtn } from "@/assets";
import BottomSection from "@/components/tutorPages/personel_info/Commonlayout/BottomSection";
import TutorName from "@/components/tutorPages/personel_info/Commonlayout/TutorName";
import ActiveLink from "@/components/tutorPages/personel_info/Commonlayout/ActiveLink";
import BackBtn from "@/components/tutorPages/personel_info/Commonlayout/BackBtn";
import { on } from "process";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { usePathname, useRouter } from "next/navigation";
interface TutorPersonalInfoLayoutProps {
  children: React.ReactNode;
  params: { uid: string };
}

export default function TutorPersonalInfoLayout({
  children,
  params,
}: TutorPersonalInfoLayoutProps) {
  const [provider, setProvider] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const providerId = user.providerData[0]?.providerId || "";
        setProvider(providerId);
        if (providerId !== "password" && pathname.endsWith("/edit_profile")) {
          router.replace(
            `/mentor-dashboard/${params.uid}/subscription-settings`
          );
        }
      }
    });

    return () => unsubscribe();
  }, [params.uid, pathname, router]);

  return (
    <div className="max-w-7xl mx-auto px-5 py-3">
      <h1 className="text-[#4A148C] xl:text-3xl text-3xl font-semibold my-5">
        Account Setting
      </h1>
      <div className="custom-shadow rounded-xl px-5 py-3 pb-10">
        <div className="flex pl-5 flex-row items-center justify-start gap-7">
          <BackBtn />
        </div>
        <hr className="my-5" />

        <div className="flex flex-col md:flex-row justify-center w-[90%] mx-auto md:w-auto md:items-start gap-5">
          <div className="flex md:flex-col tems-center justify-center gap-3 sm:gap-7 custom-shadow px-3 pt-3 pb-5 rounded-xl">
            {provider === "password" && (
              <ActiveLink
                href={`/mentor-dashboard/${params.uid}/edit_profile`}
                src={settings_profile}
                src2={settings_profile_white}
                alt="Profile"
              />
            )}
            <ActiveLink
              href={`/mentor-dashboard/${params.uid}/subscription-settings`}
              src={settings_payment}
              src2={settings_payment_white}
              alt="Payment"
            />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

"use client";
import BioHead from "@/components/tutorPages/personel_info/bio/DesktopScreen/BioHead";
import CountryDetails from "@/components/tutorPages/personel_info/bio/DesktopScreen/CountryDetails";
import Language from "@/components/tutorPages/personel_info/bio/DesktopScreen/Language";
import ProfilePhoto from "@/components/tutorPages/personel_info/bio/DesktopScreen/ProfilePhoto";
import SelfIntroduction from "@/components/tutorPages/personel_info/bio/DesktopScreen/SelfIntroduction";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { TutorDocumentDataType } from "@/types";

const Bio = () => {
  const { uid } = useParams<{ uid: string }>();

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl">
      <BioHead />
      <ProfilePhoto tutorId={uid} />
      <SelfIntroduction tutorId={uid} />
      <Language tutorId={uid} />
      <CountryDetails tutorId={uid} />
    </div>
  );
};

export default Bio;

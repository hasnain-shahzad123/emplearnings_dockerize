import React from "react";
import EducationHead from "@/components/tutorPages/personel_info/education/EducationHead";
import EducationDetails from "@/components/tutorPages/personel_info/education/EducationDetails";
import ProfessionalExperience from "@/components/tutorPages/personel_info/education/ProfessionalExperience";
import Achievements from "@/components/tutorPages/personel_info/education/Achievements";
import ExternalReviews from "@/components/tutorPages/personel_info/education/ExternalReviews";
import Strengths from "@/components/tutorPages/personel_info/education/Strengths";


interface MyPageProps {
  params: { uid: string }
}


const Education = ({ params }: MyPageProps) => {
  const { uid } = params

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl">
      <EducationHead />
      <EducationDetails uid={uid} />
      <ProfessionalExperience />
      <Achievements uid={uid} />
      <ExternalReviews uid={uid} />
      <Strengths uid={uid} />
    </div>
  );
};

export default Education;


import { bio, services, education, pricing, class_scheduling } from "@/assets";
import ProfileCard from "./ProfileCard";
import { backBtn } from "@/assets/index";
import Image from "next/image";
import Link from "next/link";
import BackBtn from "../personel_info/Commonlayout/BackBtn";
 

const Profile = () => {
  const id = 10;
 
  const profileData = [
    {
      Title: "Bio",
      Img: bio,
      PageLink: "/bio",
      Description:
        "Bio includes personal details such as a profile photo, a self-introduction (including a tagline for your profile), language proficiency, and country details.",
    },
    {
      Title: "Education & Expertise",
      Img: education,
      PageLink: "/education",
      Description:
        "Education & Expertise includes education, professional experience, achievements/certificates, external reviews, and key strengths.",
    },
    {
      Title: "Services",
      Img: services,
      PageLink: "/categories",
      Description:
        "Services include your selection of the main primary category, category, and subcategory. This section is available for Premium members, who can add more than one service.",
    },
    {
      Title: "Pricing",
      Img: pricing,
      PageLink: "/pricing",
      Description: "Pricing includes the rates for your 50-minute lessons.",
    },
    {
      Title: "Class Scheduling",
      Img: class_scheduling,
      PageLink: "/lesson-schedule",
      Description:
        "Class Scheduling includes setting the time frames for your lessons over a two-week period.",
    },
  ];

  return (
    <div className="bg-[#F5F7FC]">
      <div className="px-5 pt-5">
        <BackBtn />
      </div>
      <div className="w-full mx-auto flex flex-col items-center gap-5 pb-5  px-5 ">
        <div className="flex flex-col items-start w-11/12 px-5">
          <h1 className="text-[rgb(74,20,140)] font-semibold text-2xl lg:text-4xl mt-7">
            Welcome to your Profile section!
          </h1>
          <h1 className="text-lg mt-2 font-semibold mb-4 md:mb-10">
            Navigate to any section of your profile to view, add or modify
            related info.
          </h1>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="rounded-xl sm:bg-none sm:rounded-none py-10 sm:py-0 px-5 sm:px-0">
            {profileData.map((cardData, index) => {
              return (
                <ProfileCard
                  key={index}
                  Title={cardData.Title}
                  Img={cardData.Img}
                  Description={cardData.Description}
                  PageLink={cardData.PageLink}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

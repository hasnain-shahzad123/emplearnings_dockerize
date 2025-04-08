"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { desclaimer, right_arrow } from "@/assets/index";
import { usePathname } from "next/navigation";

type ProfileCardProps = {
  key:number
  Title: string;
  Img: StaticImport;
  Description: string;
  PageLink: string;
};

const ProfileCard = ({
  key,
  Title,
  Img,
  Description,
  PageLink,
}: ProfileCardProps) => {
  const pathname = usePathname();
  const basePath = pathname.replace("/profile", "");
  const fullLink = `${
    basePath.endsWith("/") ? basePath : `${basePath}/`
  }${PageLink}`;

  return (
    <div key={key} className="max-w-7xl px-5 md:px-7 py-7 md:py-16 custom-shadow rounded-xl mb-5">
      <div className="flex flex-row justify-between items-center md:mb-5 ">
        <div className="flex flex-row items-center justify-start gap-5">
          <div>
            <Image src={Img} alt="Card Image" width={40} height={40} />
          </div>
          <div>
            <h1 className="text-[20px] sm:text-2xl font-semibold">{Title}</h1>
          </div>
        </div>
        <div className="block">
          <Link href={fullLink}>
            <Image
              src={right_arrow}
              alt="Right Arrow"
              height={20}
              width={20}
              className="h-8 w-8 md:h-12 md:w-12 hover:scale-110 hover:opacity-80 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
      <div className="hidden md:block">
        <h1 className="text-lg text-[#7A7A7A]">{Description}</h1>
      </div>
    </div>
  );
};

export default ProfileCard;

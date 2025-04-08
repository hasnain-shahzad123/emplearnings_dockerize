
import CustomButton from "@/components/shared/CustomButton/CustomButton"
import Image from "next/image"
import { desclaimer_black, white_star } from "@/assets/index";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function GoPremiumComponent() {
    const pathname = usePathname();

    return (
      <div className="bg-white p-3 rounded-lg">
        <div className="bg-[#F1F1FF] p-3 rounded-md">
          <div className="flex justify-center items-center gap-4">
            <div className="p-2 rounded-full bg-empoweredFlag">
              <Image
                src={white_star.src}
                alt="upgrade-plan"
                width={20}
                height={20}
                className="h-8 w-8"
              />
            </div>
            <Link href={pathname + "/upgrade-plan"}>
              <CustomButton
                text=" Go Premium"
                className="bg-empoweredFlag text-white  rounded-full px-8 py-2 text-[14px]"
              />
            </Link>
          </div>
          <div className="p-2 mt-3 flex gap-3 items-center border-[1px] border-[#4A148C] rounded-lg  bg-[#EAEAF9]">
            <div>
              <Image
                src={desclaimer_black.src}
                alt="desclaimer"
                width={20}
                height={20}
                className="h-10 w-10"
              />
            </div>
            <div className="text-[10px]">
              <p>Unlock more useful features and benefits with Premium Plan</p>
            </div>
          </div>
        </div>
      </div>
    );
}

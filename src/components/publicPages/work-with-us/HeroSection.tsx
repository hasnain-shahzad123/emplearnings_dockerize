
import Image from "next/image";
import Link from "next/link";
import { Green_Arrow, Hero_section } from '@/assets/index';
import CustomButton from "@/components/shared/CustomButton/CustomButton";

const PURPLE = "#4A148C";
const ORANGE = "#DD5D00";
const GREEN = "#25A36F";
const GRAY = "#7A7A7A";

export default function HeroSection() {
 
  return (
    <section className="max-w-7xl mx-auto px-5 py-8 md:px-0">
      <h1 className="text-center text-4xl font-bold">
        Join Our Team at Empower<span style={{ color: PURPLE }}>Ed</span>{" "}
        Learnings
      </h1>
      <p className="text-center mt-2" style={{ color: GRAY }}>
        Become Part of a Growing Network of Online Tutors, Coaches, and
        Instructors!
      </p>

      <div className="flex flex-wrap justify-evenly my-[5%] items-start">
        <div className="relative w-full md:w-[539px] h-[439px] md:h-[439px]">
          <Image
            src={Hero_section}
            alt="Empowered Learning Team"
            priority
            fill
            sizes="(max-width: 768px) 100vw, 539px"
            className="object-cover"
          />
        </div>
        <div
          className="font-poppins text-center md:text-left text-2xl md:text-4xl max-w-[590px] font-medium mt-8 md:mt-[7%] relative"
          style={{ color: ORANGE }}
        >
          <h2>
            Are you a passionate educator, coach or instructor eager to run your
            own business with ease and independence
            <span style={{ color: GREEN }}>?</span>
          </h2>
          <div className=" hidden xl:block absolute right-4 ">
            <Image
              src={Green_Arrow}
              alt="Green Arrow"
              width={150}
              height={170}
              className="object-contain w-[120px] h-[150px]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-center text-xl mb-2 max-w-[90%] text-black">
          Join <span style={{ color: PURPLE }}>EmpowerEd Learnings</span> today
          and start running your own independent online mentoring business with
          all the support and tools you need to succeed. Our mission is to
          empower mentors like you so that you can empower others.
        </p>
        <p
          className="text-xl text-center hidden lg:block"
          style={{ color: PURPLE }}
        >
          Take advantage of our special offer and see how we can help you grow
          your student base and maximize your earnings.
        </p>
        <Link href="/demo-for-mentors" prefetch={true}>
          <CustomButton
            className={`py-3 px-10 my-5 rounded-full text-white mt-10 bg-[${PURPLE}] `}
            text="Book a Demo"
          />
        </Link>
      </div>
    </section>
  );
}
import CustomButton from "../../shared/CustomButton/CustomButton";
import Image from "next/image";
import Link from "next/link";
import { arrow_svg } from "@/assets/index";
const agreementData = [
  {
    name: "Scope of Services",
    points: [
      "EmpowerEd Learnings provides a platform connecting students with mentors for Academic Tutoring, Skill Development, and Life Coaching.",
      "Students can select mentors, schedule sessions, and track progress through their personal dashboard.",
      "Services are provided by independent mentors who are responsible for their own scheduling, availability, and pricing details with students.",
    ],
  },
  {
    name: "Payments",
    points: [
      "Learning Plans: Choose from three flexible learning options—Once a Week, Twice a Week, or Thrice a Week—billed monthly.",
      "Recurring Payments: Your chosen plan will automatically renew each month unless canceled.",
      "Cancellation Policy: You may cancel at any time, but please cancel at least 10 days before the next billing cycle to avoid additional charges.",
      "EmpowerEd Learnings does not take a commission from mentor earnings. Payments are securely processed via Stripe, and no payment information is stored on our servers.",
    ],
  },
  {
    name: "Free Trial and Class Cancellations",
    points: [
      "Trial Classes: Some mentors offer a free trial class, allowing you to experience their teaching style before committing.",
      "Rescheduling and Cancellations: For any scheduling adjustments, please contact your mentor directly, who will assist with rescheduling or cancellations as needed.",
    ],
  },
  {
    name: "Confidentiality and Privacy",
    points: [
      "We prioritize your privacy. EmpowerEd Learnings does not sell or disclose personal information to third parties.",
      "Information shared with EmpowerEd Learnings is securely stored and used solely to enhance your learning experience.",
    ],
  },
  {
    name: "Code of Conduct",
    points: [
      "Respectful Engagement: We encourage mutual respect between students, parents, and mentors to foster a positive learning environment.",
      "Session Preparedness: Please arrive on time, prepared to engage in your scheduled sessions.",
      "Dashboard Use: Use your personal dashboard to track your learning progress, access course materials, and communicate with your mentor outside of class.",
    ],
  },
  {
    name: "Refund Policy",
    points: [
      "EmpowerEd Learnings does not facilitate refunds. Any request for refunds related to unused sessions should be communicated directly with your mentor.",
      "Mentors may or may not offer refunds, as this is solely at their discretion.",
      "EmpowerEd Learnings is not responsible for, nor will participate in, any disputes regarding refunds.",
    ],
  },
  {
    name: "Marketing and Promotional Use",
    points: [
      "Promotional Videos: With permission, EmpowerEd Learnings may use testimonials or video content shared by mentors or students for marketing purposes to promote the learning platform and highlight success stories.",
    ],
  },
  {
    name: "Limitations of Liability",
    points: [
      "EmpowerEd Learnings serves as a platform facilitator, connecting students with mentors.",
      "We are not liable for the content or outcomes of sessions, nor for any loss or damages arising from mentor-student interactions.",
      "By using our platform, students and parents acknowledge and accept these terms, understanding that mentors are independent contractors responsible for their own coaching methods and content.",
    ],
  },
];

const Agreement = () => {
  return (
    <div className=" overflow-scroll p-5 ">
      <div className="max-w-7xl px-3 mx-auto  h-screen flex py-10 flex-col">
        <div className="mt-5 sm:mt-5 sm:mb-5 flex justify-between my-10 items-center">
          <Link href="/">
            <Image
              src={arrow_svg.src}
              alt="arrow"
              width={30}
              height={30}
              className="h-[50px] w-[50px] hover:scale-110 hover:opacity-80 transition-transform duration-200"
            />
          </Link>
        </div>
        <div className="flex-grow max-w-6xl mt-3 mx-auto flex flex-col">
          {/* Agreement */}
          <div className="custom-shadow mb-5 rounded-xl flex-grow">
            <div className="text-[10px] md:text-lg lg:text-xl font-semibold px-4 py-3 lg:px-7 lg:py-4">
              <h1>EmpowerEd Learnings Terms and Conditions</h1>
            </div>
            <div className="border-b-2 border-black"></div>
            <div className="h-[calc(100%-4rem)] pl-5 pr-4 ml-3 py-3 lg:pl-10 lg:pr-7 lg:ml-5 lg:py-5 text-[10px]">
              <h1 className="text-[#4A148C] text-[16px]">
                Welcome to EmpowerEd Learnings! These Terms and Conditions
                outline the terms of use for students and parents engaging with
                our platform and services. Our mission is to provide flexible,
                personalized learning experiences, empowering both students and
                mentors to succeed.
              </h1>
              {agreementData.map((val, index) => (
                <div key={index}>
                  <p className="font-bold text-[15px] my-2 md:my-5">
                    {val.name}
                  </p>
                  <ul className="list-disc pl-5 lg:pl-8">
                    {val.points.map((p, index) => (
                      <li key={index} className="text-[15px] mb-1">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="text-[#4A148C] text-[16px] mt-5">
                <h1 className="font-semibold pb-3"> Acknowledgment </h1>
                By using EmpowerEd Learnings, you agree to these Terms and
                Conditions. We are committed to fostering a safe, supportive
                learning experience and helping students unlock their full
                potential.
                <h1 className="font-semibold pt-3">
                  {" "}
                  We look forward to supporting your learning journey!
                </h1>
              </div>
            </div>
          </div>
          {/* Button */}
        </div>
      </div>
    </div>
  );
};

export default Agreement;

// const Agreement = () => {
//   return (
//     <div className="max-w-7xl px-3 h-screen  mx-auto custom-scrollbar">
//       <div className="max-w-6xl mt-3 h-screen mx-auto">
//         {/* <h1 className="text-[#4A148C] font-semibold text-[16px] md:text-xl lg:text-2xl mt-7">
//           Welcome Mian Ali!
//         </h1>
//         <h1 className="text-[10px] md:text-lg mt-2 mb-4 md:mb-10">
//           Tutor Dashboard Building Steps:
//         </h1> */}
//         {/* Agreement */}
//         <div className="custom-shadow  rounded-xl">
//           <div className="text-[10px] md:text-lg lg:text-xl font-semibold px-4 py-3 lg:px-7 lg:py-4">
//             <h1>EmpowerEd Learnings Terms and Conditions</h1>
//           </div>
//           <div className="border-b-2 border-black"></div>
//           <div className="h-[35vh] md:h-[48vh] xl:h-[30vh] pl-5 pr-4 ml-3 py-3  lg:pl-10 lg:pr-7 lg:ml-5 lg:py-5 text-[10px]  overflow-y-scroll">
//             <h1 className="text-[#4A148C] text-[16px]">
//               Welcome to EmpowerEd Learnings. By signing up and subscribing to
//               our platform, you agree to the following terms and conditions.
//               Please read them carefully:
//             </h1>
//             {agreementData.map((val, index) => {
//               return (
//                 <div key={index}>
//                   <p className="font-bold text-[15px]  my-2 md:my-5">
//                     {val.name}
//                   </p>
//                   <ul className="list-disc pl-5 lg:pl-8">
//                     {val.points.map((p, index) => (
//                       <li
//                         key={index}
//                         className="text-[15px] mb-1"
//                       >
//                         {p}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               );
//             })}
//           </div>
//           {/* <div className="px-4 lg:px-7 py-3 lg:py-2 border-black border-2 rounded-bl-xl rounded-br-xl">
//             <h1 className="font-bold text-[10px] md:text-lg mb-2 md:mb-3">
//               Acknowledgment
//             </h1>
//             <div className="px-5 lg:px-8 mb-2 md:mb-5">
//               <p className="text-[10px] md:text-[15px]">
//                 By clicking <span className="text-[#4A148C]">“I Accept”</span>{" "}
//                 at the end, you acknowledge that you have read and agree to
//                 these terms and conditions.
//               </p>
//             </div>
//             <div className="flex flex-row items-start gap-3 px-5 lg:px-8">
//               <div>
//                 <input
//                   type="checkbox"
//                   className="form-checkbox cur h-3 w-3 md:h-5 md:w-5 text-[#4A148C]"
//                 />
//               </div>
//               <div className="mt-1 md:-mt-1">
//                 <p className="ml-0 md:ml-2 text-[10px] md:text-[14px] lg:text-[16px]">
//                   I have read and agree to the EmpowerEd Learnings Terms and
//                   Conditions.
//                 </p>
//               </div>
//             </div>
//           </div> */}
//         </div>
//         {/* Button */}
//         <div className="flex flex-row justify-between items-center mt-5 mb-10 sm:mt-5 sm:mb-5">
//           <button>
//             <Image
//               src={arrow_svg.src}
//               alt="arrow"
//               width={30}
//               height={30}
//               className="h-[50px] w-[50px] hover:scale-110 hover:opacity-80 transition-transform duration-200"
//             />
//           </button>
//         </div>
//       </div>
//     </div>

//   );
// }

// export default Agreement

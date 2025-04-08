import CustomButton from "../../shared/CustomButton/CustomButton";
import Image from "next/image";
import Link from "next/link";
import { arrow_svg } from "@/assets/index";
const agreementData = [
  {
    name: "Platform Use",
    points: [
      "EmpowerEd Learnings provides a platform for independent professionals (teachers, coaches, instructors) to offer services such as tutoring, coaching, and skill development.",
      "You are responsible for maintaining the accuracy and professionalism of your profile, content, and communication with clients.",
    ],
  },
  {
    name: "Subscription and Payment",
    points: [
      "Subscription fees are billed according to the selected plan (Standard, Pro, Premium). Fees will be automatically charged after any free trial period ends unless canceled before the trial expiration.",
      "Payments for your services will be processed through our platform’s payment system. We provide integration with Stripe for a smooth transaction process. You will have access to a dashboard where you can track your payments and client interactions.",
      "EmpowerEd Learnings does not take a commission on your earnings; however, you are responsible for any associated fees from the payment provider.",
    ],
  },
  {
    name: "Refunds and Cancellations",
    points: [
      "EmpowerEd Learnings does not offer refunds for subscription fees. If you choose to cancel your subscription, please do so before the next billing cycle to avoid any further charges.",
      "As a professional using EmpowerEd Learnings, you are responsible for informing your clients about your cancellation and refund policies. Clients are charged based on their selected tier (once a week, twice a week, or three times a week, billed monthly). While we do not offer refunds, clients can cancel their services at any time. To avoid charges for the next billing cycle, clients must give you at least 10 days' notice before the next payment.",
      "EmpowerEd Learnings is not liable for disputes or payment issues between you and your clients, as the platform does not retain any portion of your earnings.",
    ],
  },
  {
    name: "Marketing and Promotion",
    points: [
      "For Pro and Premium plans, EmpowerEd Learnings will include your services in various marketing campaigns (social media ads, online events, etc.). Video content may also be featured in ads to increase visibility.",
      "We reserve the right to use your profile information (name, photo, service description) in marketing materials.",
    ],
  },
  {
    name: "Content Ownership and Usage Rights",
    points: [
      "By uploading content to EmpowerEd Learnings, you grant us permission to use, distribute, and display your content for promotional and marketing purposes.",
      "You retain ownership of the original content you provide, but you are responsible for ensuring it does not infringe on any copyright or trademark rights.",
    ],
  },
  {
    name: "Independent Contractor Status",
    points: [
      "You acknowledge that you are an independent contractor and not an employee of EmpowerEd Learnings.",
      "You are responsible for your own business expenses, taxes, and liabilities, including any claims from your clients regarding the services you provide.",
    ],
  },
  {
    name: "Code of Conduct",
    points: [
      "You must maintain professional conduct when interacting with clients or other users on the platform.",
      "Harassment, discrimination, or any unprofessional behavior will not be tolerated and may result in the termination of your account.",
      "In the event of multiple client complaints regarding unprofessional conduct, misconduct, or failure to adhere to the platform's guidelines, EmpowerEd Learnings reserves the right to investigate these claims.",
      "Depending on the findings of the investigation, your account may be suspended or terminated without prior notice. Any fees paid will not be refunded in such cases.",
      "Repeated violations of our code of conduct may lead to permanent removal from the platform.",
    ],
  },
  {
    name: "Liability Limitation",
    points: [
      "EmpowerEd Learnings is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Subscribers agree to indemnify and hold EmpowerEd Learnings harmless from any claims, losses, or damages resulting from their actions.",
    ],
  },
  {
    name: "Termination of Services",
    points: [
      "EmpowerEd Learnings reserves the right to terminate services to any subscriber who violates these terms and conditions or engages in conduct detrimental to the platform or its users.",
    ],
  },
  {
    name: "Changes to Terms",
    points: [
      "EmpowerEd Learnings reserves the right to modify these terms and conditions at any time. Subscribers will be notified of significant changes via email or through the platform.",
    ],
  },
];


const Agreement = () => {
  return (
    <div className="max-w-7xl px-3 mx-auto  h-screen flex py-10  flex-col">
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
        <div className="custom-shadow rounded-xl flex-grow">
          <div className="text-[10px] md:text-lg lg:text-xl font-semibold px-4 py-3 lg:px-7 lg:py-4">
            <h1>EmpowerEd Learnings Terms and Conditions</h1>
          </div>
          <div className="border-b-2 border-black"></div>
          <div className="h-[calc(100%-4rem)] pl-5 pr-4 ml-3 py-3 lg:pl-10 lg:pr-7 lg:ml-5 lg:py-5 text-[10px]">
            <h1 className="text-[#4A148C] text-[16px]">
              Welcome to EmpowerEd Learnings. By signing up and subscribing to
              our platform, you agree to the following terms and conditions.
              Please read them carefully:
            </h1>
            {agreementData.map((val, index) => (
              <div key={index}>
                <p className="font-bold text-[15px] my-2 md:my-5">{val.name}</p>
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

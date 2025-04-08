import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardLink } from "@/services/connect/getDashboardLinkService";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import {
  profile,
  settings,
  logout,
  courses,
  analytics,
  help_support,
  students,
  payment,
  trial_lesson,
  upgrade_star,
  tutor_profile,
  profile_star,
  my_teachers,
  teacher_notes,
  faqs,
} from "@/assets/index";
import { auth } from "@/firebase/firebaseConfig";
import logoutStudentFromDashboard from "@/firebase/student/logoutStudentFromDashboard";
import { useAlert } from "@/contexts/AlertContext";
import Spinner from "@/components/shared/spinner/Spinner";
import ConfirmLogout from "@/components/tutorPages/dashboard/DesktopScreen/logoutModal/ConfirmLogout";





interface TutorDetails {
  name: string;
  student_image: string;
  ratings: number;
  number_of_reviews: number;
  uid: string;
}

// Separate component for Payment link to handle its specific logic
const PaymentLink = ({ uid, pathname }: { uid: string; pathname: string }) => {
  const [dashboardState, setDashboardState] = useState<{
    link: string;
    isLoading: boolean;
    error?: string;
    action?: string;
  }>({
    link: "",
    isLoading: true,
  });

  useEffect(() => {
    const fetchDashboardLink = async () => {
      try {
        const response = await getDashboardLink({ uid });

        if (response.type === "success") {
          setDashboardState({
            link: response.data?.link || "",
            isLoading: false,
            action: response.action,
          });
        } else {
          setDashboardState({
            link: "",
            isLoading: false,
            error: response.message as string,
          });
        }
      } catch (error) {
        setDashboardState({
          link: "",
          isLoading: false,
          error: "Failed to fetch dashboard link",
        });
      }
    };

    fetchDashboardLink();
  }, [uid]);

  const handlePaymentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dashboardState.error) {
      e.preventDefault();
      alert("Payment dashboard is unavailable. Please try again later.");
    } else if (dashboardState.action === "fulfill") {
      alert(
        "You have some missing details that need to be submitted. You will be redirected to complete them."
      );
    } else if (dashboardState.action === "onboard") {
      alert("Please provide additional details to begin selling.");
    }
  };

  if (dashboardState.isLoading) {
    return (
      <div className="flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full hover:bg-gray-100">
        <Image
          src={payment.src}
          alt="Payment"
          width={50}
          height={50}
          className="h-7 w-7"
        />
        <span className="font-semibold text-gray-400">
          Loading payment dashboard...
        </span>
      </div>
    );
  }

  if (dashboardState.error) {
    return (
      <div className="flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full hover:bg-gray-100">
        <Image
          src={payment.src}
          alt="Payment"
          width={50}
          height={50}
          className="h-7 w-7"
        />
        <span className="font-semibold text-red-500">
          Payment dashboard unavailable
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full hover:bg-gray-100">
      <Image
        src={payment.src}
        alt="Payment"
        width={50}
        height={50}
        className="h-7 w-7"
      />
      <Link
        href={dashboardState.link}
        className="font-semibold"
        onClick={handlePaymentClick}
      >
        Payment
      </Link>
    </div>
  );
};
const CustomizationSection = ({
  name,
  student_image = "",
  ratings,
  number_of_reviews,
  uid,
}: TutorDetails) => {
  const pathname = usePathname();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [LogoutModal, setLogoutModal] = useState(false);

  const handleLogout = async () => {
    setLogoutModal((prev) => !prev);
    setLogoutLoading(true);
    const response = await logoutStudentFromDashboard();
    if (response.type === "error") {
      setLogoutLoading(false);
      showAlert(response.message, "ERROR");
      document.body.style.overflow = "auto";
    } else {
      router.push("/");
      setLogoutLoading(false);
      document.body.style.overflow = "auto";
    }
  };

  const setShowModal = () => {
    setLogoutModal((prev) => !prev);
    if (LogoutModal) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  const hardcodedLinks = [
    { text: "Log out", image: logout.src, onClick: setShowModal }, // Updated to use setShowModal
    { text: "Help & Support", image: help_support.src, href: "" },
    { text: "Settings", image: settings.src, href: "" },
  ];

  const navigationLinks = [
    {
      text: "My Teachers",
      image: my_teachers.src,
      link: `${pathname}/tutor-list`,
    },
    {
      text: "Teacher Notes",
      image: teacher_notes.src,
      link: `${pathname}/teacher-notes`,
    },
    { text: "My Courses", image: courses.src, link: `${pathname}/my-courses` },
    { text: "FAQs", image: faqs.src, link: `${pathname}/faqs` },
  ];

  return (
    <div className="pl-5 pb-5">
      {/* Profile Section */}
      <div className="flex flex-col items-center bg-[#FFFFFF] shadow-xl p-5 rounded-3xl">
        <div className="flex gap-3">
          <div>
            <Image
              src={student_image || tutor_profile.src}
              alt="Customization"
              width={50}
              height={50}
              className="h-14 w-14 rounded-full"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-semibold text-lg text-center">{name}</h1>
            <div className="flex gap-1 text-[12px] justify-center items-center">
              <Image
                src={profile_star.src}
                alt="star"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <p className="text-center text-[15px] font-semibold text-[#08A935]">
                {ratings} <span>({number_of_reviews} reviews)</span>
              </p>
            </div>
          </div>
        </div>
        <Link href={`${pathname}/profile`}>
          <CustomButton
            className="bg-[#4A148C] px-10 py-1 rounded-full mt-5 text-white text-sm"
            text="Build your Profile"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col bg-[#FFFFFF] shadow-xl p-5 rounded-3xl items-start mt-7">
        {/* Regular navigation links */}
        {navigationLinks.map((link, index) => (
          <div
            key={index}
            className={`flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full hover:bg-gray-100`}
          >
            <Image
              src={link.image}
              alt={link.text}
              width={50}
              height={50}
              className="h-7 w-7"
            />
            <Link href={link.link} className="font-semibold">
              {link.text}
            </Link>
          </div>
        ))}

        {/* Payment link with its own loading state */}
        {/* <PaymentLink uid={uid} pathname={pathname} /> */}
      </div>

      {/* Settings Links */}
      <div className="flex flex-col p-5 rounded-3xl items-start mt-7">
        {hardcodedLinks.map((link, index) => (
          <div
            key={index}
            className="flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full hover:bg-gray-100"
            onClick={link.onClick}
            style={{ cursor: link.onClick ? "pointer" : "default" }} // Add this line
          >
            <Image
              src={link.image}
              alt={link.text}
              width={50}
              height={50}
              className="h-7 w-7"
            />
            <span className="font-semibold">{link.text}</span>
          </div>
        ))}
      </div>
      {LogoutModal && (
        <ConfirmLogout
          setShowModal={setShowModal}
          handleLogout={handleLogout}
        />
      )}

      {logoutLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default CustomizationSection;

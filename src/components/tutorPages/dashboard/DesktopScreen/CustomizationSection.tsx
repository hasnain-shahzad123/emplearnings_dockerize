import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardLink } from "@/services/connect/getDashboardLinkService";
import ConfirmLogout from "./logoutModal/ConfirmLogout";
import { useAlert } from "@/contexts/AlertContext";
import Spinner from "@/components/shared/spinner/Spinner";
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
  profile_star,
  free_trial_white,
  my_courses_white,
  students_white,
  analytics_white,
  payment_white,
  help_support_white,
  no_profile,
  logout_white,
  settings_white,
  profile_gray,
} from "@/assets/index";
import { log } from "console";
import logoutTutorFromDashboard from "@/firebase/tutor/logoutTutorFromDashboard";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, ProviderId } from "firebase/auth";

// Add isLoading prop to the interface
interface TutorDetails {
  name: string;
  tutor_image: string;
  ratings: number;
  number_of_reviews: number;
  uid: string;
  isLoading?: boolean; // New prop
}

// Separate component for Payment link to handle its specific logic
const PaymentLink = ({ uid, pathname }: { uid: string; pathname: string }) => {
  const { showAlert } = useAlert();
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
      // alert("Payment dashboard is unavailable. Please try again later.");
      showAlert(
        "Payment dashboard is unavailable. Please try again later.",
        "ERROR"
      );
    } else if (dashboardState.action === "fulfill") {
      // alert(
      //   "You have some missing details that need to be submitted. You will be redirected to complete them."
      // );
      showAlert(
        "You have some missing details that need to be submitted. You will be redirected to complete them.",
        "INFO"
      );
    } else if (dashboardState.action === "onboard") {
      // alert("Please provide additional details to begin selling.");
      showAlert("Please provide additional details to begin selling.", "INFO");
    }
  };

  if (dashboardState.isLoading)
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

  if (dashboardState.error) {
    return (
      <div className="flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full text-red-500 hover:bg-empoweredFlag hover:text-white">
        <Image
          src={payment.src}
          alt="Payment"
          width={50}
          height={50}
          className="h-7 w-7"
        />
        <span className="font-semibold">Payment dashboard unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full hover:bg-empoweredFlag hover:text-white">
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
  tutor_image = "",
  ratings,
  number_of_reviews,
  uid,
  isLoading = false,
}: TutorDetails) => {
  const [tutorName, setTutorName] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const pathname = usePathname();
  const [LogoutModal, setLogoutModal] = useState(false);
  const [provider, setProvider] = useState<String>("");
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleLogout = async () => {
    setLogoutModal((prev) => !prev);
    setLogoutLoading(true);
    const response = await logoutTutorFromDashboard();
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

  useEffect(() => {
    console.log("Setting up auth state listener");
    let mounted = true;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!mounted) return;

      if (user) {
        setTutorName(name || user.displayName || "");
        console.log(
          "User is signed in. Setting tutor name:",
          name || user.displayName
        );

        if (user.providerData && user.providerData.length > 0) {
          setProvider(user.providerData[0].providerId);
        } else {
          console.log("User is signed in but no provider data available");
        }
      } else {
        console.log("No user authenticated");
        setTutorName(name || "");
        setProvider("");
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [name]);
  const setShowModal = () => {
    //it will show the logout modal when the user clicks on the logout button and hide it when the user clicks on the cancel button
    setLogoutModal((prev) => !prev);
    if (LogoutModal) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  const navigationLinks = [
    {
      text: "Profile",
      image: profile_gray.src,
      image2: profile.src,
      link: `${pathname}/profile`,
    },
    {
      text: "Free Trial Lesson",
      image: trial_lesson.src,
      image2: free_trial_white.src,
      link: `${pathname}/free-trial-lesson`,
    },
    {
      text: "My Courses",
      image: courses.src,
      image2: my_courses_white.src,
      link: `${pathname}/my-courses`,
    },
    {
      text: "Students",
      image: students.src,
      image2: students_white.src,
      link: `${pathname}/mentor-students`,
    },
    {
      text: "Analytics",
      image: analytics.src,
      image2: analytics_white.src,
      link: `${pathname}/analytics`,
    },
  ];

  const hardcodedLinks = [
    { text: "Log out", image: logout.src, image2: logout_white.src },
    {
      text: "Help & Support",
      image: help_support.src,
      image2: help_support_white.src,
    },
    { text: "Settings", image: settings.src, image2: settings_white.src },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="pl-5 pb-5">
      {/* Profile Section */}
      <div className="flex flex-col items-center bg-[#FFFFFF] shadow-xl p-5 rounded-3xl">
        <div className="flex gap-1">
          <div className="flex-shrink-0">
            {isLoading ? (
              <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <div className="h-[50px] w-[50px]">
                <Image
                  src={tutor_image || no_profile.src}
                  alt="Customization"
                  width={1500}
                  height={1500}
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            {isLoading ? (
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            ) : (
              <h1 className="font-semibold text-lg text-center">{name}</h1>
            )}
            <div className="flex gap-1 text-[12px] justify-center items-center">
              <Image
                src={profile_star.src}
                alt="star"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              {isLoading ? (
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-center text-[15px] font-semibold text-[#08A935]">
                  {ratings} <span>({number_of_reviews} reviews)</span>
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Rest of the component */}

        <CustomButton
          text="Preview Screen"
          onclickEvent={() =>
            router.push(`/mentor-dashboard/${uid}/mentor-preview`)
          }
          className="bg-empoweredFlag text-[14px] text-white mt-4 px-6 py-1 rounded-full"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col bg-[#FFFFFF] shadow-xl p-5 rounded-3xl items-start mt-7">
        {/* Regular navigation links */}
        {navigationLinks.map((link, index) => (
          <Link
            href={link.link}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            key={index}
            className={`flex items-center py-2 px-5 mt-3 rounded-full gap-5 w-full
              hover:bg-empoweredFlag  hover:text-white
            `}
          >
            <Image
              src={hoveredIndex === index ? link.image2 : link.image}
              alt={link.text}
              width={50}
              height={50}
              className="h-7 w-7"
            />
            <button className="font-semibold">{link.text}</button>
          </Link>
        ))}

        {/* Payment link with its own loading state */}
        <PaymentLink uid={uid} pathname={pathname} />
      </div>

      {/* Settings Links */}
      <div className="flex flex-col p-5 rounded-3xl items-start mt-7">
        {hardcodedLinks.map((link, index) => (
          <div
            onClick={() => {
              if (link.text === "Log out") {
                setShowModal();
              } else if (link.text === "Help & Support") {
                router.push(`/mentor-dashboard/${uid}/get_help`);
              } else if (link.text === "Settings") {
                if (provider === "password") {
                  router.push(`/mentor-dashboard/${uid}/edit_profile`);
                } else {
                  router.push(`/mentor-dashboard/${uid}/subscription-settings`);
                }
              }
            }}
            onMouseEnter={() => setHoveredIndex(index + 8)}
            onMouseLeave={() => setHoveredIndex(null)}
            key={index}
            className="flex cursor-pointer items-center hover:bg-empoweredFlag hover:text-white py-2 px-5 mt-3 rounded-full gap-5 w-full"
          >
            <Image
              src={hoveredIndex === index + 8 ? link.image2 : link.image}
              alt={link.text}
              width={50}
              height={50}
              className="h-7 w-7"
            />
            <button className="font-semibold">{link.text}</button>
          </div>
        ))}
      </div>

      {/* Logout Modal */}
      {LogoutModal && (
        <ConfirmLogout
          setShowModal={setShowModal}
          handleLogout={handleLogout}
        />
      )}

      {logoutLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
          style={{ zIndex: 1000 }}
        >
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default CustomizationSection;

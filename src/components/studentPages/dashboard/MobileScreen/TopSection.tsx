"use client";
import Image from 'next/image';
import Link from 'next/link';
import {
  hamBurger,
  tutor_profile,
  notification_icon,
  mobile_cross,
  cross,
  logout,
  profile,
  settings,
  trial_lesson,
  courses,
  analytics,
  help_support,
  students,
  payment,
  upgrade_plan,
  profile_star,
} from "@/assets/index";
import {useState,useEffect} from "react";
import { NotificationType, NotificationTypeTemp } from '@/types';

type TopSectionProps = {
  studentNotifications: NotificationTypeTemp[]| undefined;
  username: string | undefined;
  student_image: string | undefined;
  ratings: number | undefined;
}


const TopSection = ({
  studentNotifications,
  username,
  student_image = "",
  ratings,
}: TopSectionProps) => {

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationCount,setNotificationCount] = useState<number>(0);
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const handleNotification = () => {
    setShowNotification(!showNotification);
  };
  const handleSideBar = () => {
    setShowSideBar(!showSideBar);
    setShowNotification(false);
  };

  const [notifications, setNotifications] =
    useState<NotificationTypeTemp[] | undefined>([]);

  const customizationLinks = [
    { link: "Profile", image: profile.src },
    { link: "Free Trial Lesson", image: trial_lesson.src },
    { link: "My Courses", image: courses.src },
    { link: "Payment", image: payment.src },
    { link: "Students", image: students.src },
    { link: "Analytics", image: analytics.src },
    { link: "Help & Support", image: help_support.src },
    { link: "Settings", image: settings.src },
    { link: "Upgrade your plan", image: upgrade_plan.src },
  ];
  const clearAllNotifications = () => {
    setNotifications([]); 
    setNotificationCount(0);
    setShowNotification(false);
    //here we 'll make a db call for removal of all notifications
  };

  const removeNotification = (index: number) => {
    setNotifications((prev) =>
      prev?.filter((_, i) => i !== index)
    );
    setNotificationCount(
      notifications?.filter((notification) => !notification.read).length ||
        0
    );
    //here we 'll make a db call for removal of a notification
  };

  useEffect(() => {
    if (showSideBar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSideBar]);

  useEffect(() => {
    setNotifications(studentNotifications);
    setNotificationCount(studentNotifications?.filter((notification) => !notification.read).length || 0);
  }, [studentNotifications]);

  //when notification is read then count is being updated here 
  useEffect(() => {
    setNotificationCount(notifications?.filter((notification) => !notification.read).length || 0);
  }, [notifications]);

  const readNotification = (index:number) => {
      setNotifications((prev) =>
      prev?.map((notification, i) =>i==index?{...notification,read:true}:notification)
      )
  }

  return (
    <>
      <div className="bg-white flex items-center lg:hidden justify-between w-[95%] rounded-xl mx-auto mt-2 shadow-xl p-5">
        <button onClick={handleSideBar}>
          <Image
            src={student_image}
            alt="logo"
            width={50}
            height={50}
            className="h-10 w-10 sm:h-18 sm:w-18"
          />
        </button>
        <div className="flex items-center gap-5">
          <button
            onClick={handleNotification}
            className="bg-white relative p-3 sm:p-5 rounded-full shadow-xl"
          >
            <Image
              src={notification_icon.src}
              alt="Notification icon"
              width={50}
              height={50}
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </div>
          </button>
          <div>
            <Image
              src={tutor_profile.src}
              alt="tutor_profile"
              width={250}
              height={250}
              className="sm:h-20 sm:w-20 rounded-full h-14 w-14"
            />
          </div>
        </div>

        {showNotification && (
          <div
            className={`bg-white shadow-xl p-5 w-[90%] absolute top-[80px]  rounded-xl mx-auto
        transition-opacity duration-300 ease-in-out
        ${showNotification ? "opacity-100" : "opacity-0 hidden"}`}
            style={{ zIndex: 1000 }}
          >
            <div className="flex justify-between">
              <h1 className="text-lg font-semibold">Notifications</h1>
              <button className="text-sm" onClick={clearAllNotifications}>
                Clear All
              </button>
            </div>

            <div className={`flex  flex-col`}>
              {notifications?.map((notification, index) => (
                <div
                  onClick={()=>readNotification(index)}
                  key={index}
                  className="border-[2px]  rounded-xl mt-2 border-[#D9D9D9]"
                >
                  <div className="flex justify-end">
                    <button
                      className="py-1 px-1"
                      style={{zIndex:1000}}
                      onClick={() => removeNotification(index)}
                    >
                      <Image
                        src={cross.src}
                        alt="cross"
                        width={20}
                        height={20}
                        className="h-4 w-4"
                      />
                    </button>
                  </div>

                  <p
                    className={`text-[12px] px-2 text-[#7A7A7A]
                    ${notification.read ? "" : "font-semibold"}
                    `}
                  >
                    {notification.notification}
                  </p>
                  <div className="flex justify-between py-1 px-2">
                    <p className="text-[#DD5D00]">
                      {notification.time?.toDate().toLocaleString()}
                    </p>
                    {/* <button className="text-[#4A148C] text-[12px]">
                      Read More
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showSideBar && (
        <div
          className="bg-[#F5F7FC] h-full top-0 p-5 overflow-y-auto  w-full z-1000 absolute"
          style={{ zIndex: 100000 }}
        >
          <div className="bg-white w-[95%] mx-auto rounded-xl px-8 py-5 mt-10 ">
            <div className="flex justify-between items-center">
              <div>
                <button onClick={handleSideBar}>
                  <Image
                    src={mobile_cross.src}
                    alt="tutor_profile"
                    width={250}
                    height={250}
                    className=" h-10 w-10"
                  />
                </button>
              </div>
              <div>
                <button className="flex items-center gap-2 text-[#7A7A7A] font-semibold">
                  <Image
                    src={logout.src}
                    alt="tutor_profile"
                    width={250}
                    height={250}
                    className=" h-10 w-10"
                  />
                  Log Out
                </button>
              </div>
            </div>

            {/* showing user profile,username and Reviews  */}
            <div className="mt-10 flex w-[95%] mx-auto flex-col items-center">
              <div>
                <Image
                  src={tutor_profile.src}
                  alt="tutor_profile"
                  width={450}
                  height={450}
                  className="h-[180px] w-[180px] rounded-full "
                />
              </div>
              <div className="font-semibold mt-8">
                <h1 className="text-xl text-center">{username}</h1>
                <div className="flex mt-2 items-center gap-3">
                  <Image
                    src={profile_star.src}
                    alt="star"
                    width={50}
                    height={50}
                    className="h-9 w-9"
                  />
                  <h2 className="text-center text-[#08A935] text-lg">
                    {ratings} reviews
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[95%] mx-auto bg-[#FFFFFF]  p-5 rounded-3xl items-start mt-7">
            {customizationLinks.map((link, index) => (
              <div
                key={index}
                className={`flex items-center py-2 px-5 mt-3 text-[12px] rounded-lg w-[80%] mx-auto gap-5 ${
                  index === 0 ? "bg-[#4A148C] text-white" : "hover:bg-gray-100"
                } ${index === 5 ? "mb-5" : ""}`}
              >
                <Image
                  src={link.image}
                  alt={link.link}
                  width={50}
                  height={50}
                  className="h-5 w-5"
                />
                <Link href={""} className="font-semibold">
                  {link.link}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default TopSection;
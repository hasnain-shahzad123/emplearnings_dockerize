"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Spinner from "@/components/shared/spinner/Spinner";
import { notification, cross } from "@/assets/index";
import {
  clock_icon,
  video_meet,
  join_meet,
  reschedule_meet,
  upgrade_star,
  cancel_meet,
  desclaimer_black,
} from "@/assets/index";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import { NotificationType, NotificationTypeTemp } from "@/types";
import markTutorNotificationRead from "@/firebase/tutor/dashboard/notifications/markTutorNotificationRead";
import { auth } from "@/firebase/firebaseConfig";

type NotificationSectionProps = {
  studentNotifications: NotificationTypeTemp[] | undefined;
};

const NotificationSection = ({
  studentNotifications,
}: NotificationSectionProps) => {
  //this state is used to toggle the notification section
  const [showNotification, setShowNotification] = useState(true);
  const [showMore, setShowMore] = useState<boolean[]>([]);
  const [isTruncated, setIsTruncated] = useState<Record<number, boolean>>({});
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);

  const handleToggleReadMore = (index: number) => {
    setShowMore((prevShowMore) => {
      const updatedShowMore = [...prevShowMore];
      updatedShowMore[index] = !updatedShowMore[index]; // Toggle the state
      return updatedShowMore;
    });
  };
  //this stete is used to store the notifications
  const [notifications, setNotifications] = useState<
    NotificationTypeTemp[] | undefined
  >([]);

  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState<
    number | undefined
  >(0);

  //this function is used to toggle the notification section
  const handleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleClearAll = () => {
    //basically will make all notifications read
    //make all notifications read
    setNotifications((prevNotifications) =>
      prevNotifications?.map((notification) => ({ ...notification, read: true }))
    );

    const UnReadNotifications = studentNotifications
      ?.filter((notification) => !notification.read)
      .map((notification) => notification.uid);

    // now here make a db call to remove all the notifications
    const tutorId = auth.currentUser ? auth.currentUser.uid : "";
    UnReadNotifications?.forEach(async (notificationId) => {
      const response = await markTutorNotificationRead({ tutorId: tutorId, notificationId: notificationId });
      if (response.type === "error") {
        console.log(response.message);
        //TODO: SHOW ALERT
      }
    });

  };

  const handleRemoveNotification = (idx: number, event: React.MouseEvent) => {
    // Prevent the click event from triggering the read notification action
    event.stopPropagation();
    setNotifications((prevNotifications) =>
      prevNotifications?.filter((notification, index) => index !== idx)
    );
    // now here make a db call to remove this notification
  };

  useEffect(() => {
    setNotifications(studentNotifications);
    setTotalUnreadNotifications(
      studentNotifications?.filter((notification) => notification.read === false)
        .length || 0
    );
    setShowMore(new Array(studentNotifications?.length).fill(false));
  }, [studentNotifications]);

  useEffect(() => {
    setTotalUnreadNotifications(
      notifications?.filter((notification) => notification.read === false)
        .length || 0
    );
    const newIsTruncated: Record<number, boolean> = {};
    refs.current.forEach((ref, index) => {
      if (ref) {
        const lineHeight = 40;
        const maxHeight = lineHeight; // Height for 2 lines
        if (ref.scrollHeight > maxHeight) {
          newIsTruncated[index] = true;
        }
      }
    });
    setIsTruncated(newIsTruncated);
  }, [notifications]);

  //this function is used to mark one notification as read
  const handleReadNotification = (index: number) => async () => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications?.map((notification, i) =>
        i === index ? { ...notification, read: true } : notification
      );

      // Recalculate unread notifications after the change
      setTotalUnreadNotifications(
        updatedNotifications?.filter((notification) => !notification.read)
          .length || 0
      );
      return updatedNotifications;
    });

    // now here make a db call to mark this notification as read
    const tutorId = auth.currentUser ? auth.currentUser.uid : "";
    const notificationId = studentNotifications ? studentNotifications?.[index].uid : "";
    const response = await markTutorNotificationRead({ tutorId: tutorId, notificationId: notificationId });
    if (response.type === "error") {
      console.log(response.message);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex  Cgap-3 items-center font-semibold">
          <div className="relative">
            <button
              onClick={handleNotification}
              className="bg-white flex justify-center items-center shadow-xl w-12 h-12 rounded-full p-4 cursor-pointer hover:border-[2px]"
            >
              <Image
                src={notification.src}
                alt="Notification"
                width={50}
                height={50}
                className="h-8 w-8"
              />
            </button>

            {/* Notification count badge */}
            {
              <div className="absolute top-0 right-0 bg-empoweredFlag text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {totalUnreadNotifications}
              </div>
            }
          </div>

          {showNotification ? (
            ""
          ) : (
            <h1 className="text-empoweredFlag">Notifications</h1>
          )}
        </div>
        {!studentNotifications ? (
          <Spinner size="sm" className="mt-0" />
        ) : (
          <div
            className={`bg-white shadow-xl max-h-[480px] overflow-y-auto custom-scrolbar p-5  relative bottom-7 rounded-xl mx-auto
        transition-opacity duration-300 ease-in-out
        ${showNotification ? "opacity-100" : "opacity-0 hidden"}`}
          >
            <div className="flex justify-between gap-7">
              <h1 className="text-lg font-semibold">Notifications</h1>
              <button onClick={handleClearAll} className="text-sm text-red-500">
                Clear All
              </button>
            </div>

            <div className={`flex flex-col`}>
              {notifications?.map((notification, index) => (
                <div
                  onClick={handleReadNotification(index)}
                  key={index}
                  className="border-[2px] cursor-pointer rounded-xl mt-2 border-[#D9D9D9]"
                  style={{ zIndex: 10 }}
                >
                  <div className="flex justify-end">
                    <button
                      style={{ zIndex: 20 }}
                      className="py-1 px-1"
                      onClick={(e) => {
                        handleRemoveNotification(index, e);
                      }}
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
                    ref={(el) => {
                      refs.current[index] = el;
                    }}
                    className={`text-[12px] px-2 text-[#7A7A7A]
                    
                  ${notification.read ? "" : "font-bold"}
                ${showMore[index] ? "" : "line-clamp-2"}`}
                  >
                    {notification.notification}
                  </p>
                  {isTruncated[index] && (
                    <button
                      onClick={() => handleToggleReadMore(index)}
                      className="text-[#4A148C] py-1 px-2 text-[14px]"
                      style={{ zIndex: 20 }}
                    >
                      {showMore[index] ? "Show Less" : "Read More"}
                    </button>
                  )}
                  <div className="flex justify-between py-1 px-2">
                    <p className="text-[#DD5D00] text-xs">
                      {notification.time?.toDate().toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default NotificationSection;

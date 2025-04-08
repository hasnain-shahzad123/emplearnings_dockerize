import CustomizationSection from "./DesktopScreen/CustomizationSection";
import NotificationSection from "./DesktopScreen/NotificationSection";
import ScheduleSection from "./DesktopScreen/ScheduleSection";
import TopSection from "./MobileScreen/TopSection";
import OverViewSection from "./MobileScreen/OverviewSection";
import NextClassSection from "./MobileScreen/NextClassSection";
import Image from "next/image";
import { Logo } from "@/assets/index";
import CalendarSection from "./MobileScreen/CalendarSection";
import { useEffect, useState } from "react";
import isCalendarAuthorized from "@/services/googleCalendar/calendarAuthorization/checkCalendarAuthorizationService";
import fetchCalendarEventsService from "@/services/googleCalendar/fetchCalendarEventsService";
import { MappedEvents, TutorDashboardDataType } from "@/types";
import mapEventsToCalendarStructure from "@/services/googleCalendar/mapEventsToCalendarService";
import generateOAuthConsentLinkService from "@/services/googleCalendar/calendarAuthorization/generateOAuthConsentLinkService";
import Spinner from "@/components/shared/spinner/Spinner";
import Link from "next/link";
import CustomButton from "@/components/shared/CustomButton/CustomButton";
import NextClass from "./DesktopScreen/NextClass";
import { desclaimer_black } from "@/assets/index";
import GoPremiumComponent from "./DesktopScreen/GoPremiumComponent";
import MeetingRescheduler from "./DesktopScreen/MeetingScheduler";
import { useCallback } from "react";


const HeroSection = ({
  uid,
  tutorData,
}: {
  uid: string;
  tutorData: TutorDashboardDataType | undefined;
}) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [events, setEvents] = useState<MappedEvents>({});
  const [consentLink, setConsentLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [eventToBeRescheduled, setEventToBeRescheduled] = useState<string>("");
  const [tutorDataLoaded, setTutorDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsLoading(true);
      const isAuthorized = await isCalendarAuthorized({ uid });
      setAuthorized(isAuthorized);
      if (!isAuthorized) {
        const generatedLink = generateOAuthConsentLinkService({ uid });
        setConsentLink(generatedLink);
      }
      setIsLoading(false);
    };

    checkAuthorization();
  }, [uid]);
  const refreshEvents = useCallback(async () => {
    if (authorized) {
      try {
        const response = await fetchCalendarEventsService({ uid: uid });
        if (response.type === "success" && response.events !== null) {
          const events = mapEventsToCalendarStructure(response.events);
          setEvents(events);
        } else {
          setEvents({});
          console.log("Unable to fetch your schedule at this time.", response);
          alert("Unable to fetch your schedule at this time." + response);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("An unexpected error occurred while fetching your schedule.");
      }
    }
  }, [authorized, uid]);

  useEffect(() => {
    if (authorized) {
      refreshEvents();
    }
  }, [authorized, uid, refreshEvents]);

  useEffect(() => {
    console.log("events are :", events);
  }, [events]);

  useEffect(() => {
    console.log("Tutor Data :", tutorData);
  }, [tutorData]);

  // Add a useEffect to check if tutorData is loaded
  useEffect(() => {
    if (tutorData && tutorData.tutorDocumentData) {
      setTutorDataLoaded(true);
    } else {
      setTutorDataLoaded(false);
    }
  }, [tutorData]);

  const getLatestEvent = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const dayEvents = events[year]?.[month]?.[day] || [];
    return dayEvents.length > 0 ? dayEvents[0] : null;
  };

  const latestEvent = getLatestEvent();

  

  return (
    <>
      {/* Mobile Screen */}
      <div className="block lg:hidden">
        <TopSection
          tutorNotifications={tutorData?.notifications}
          username={tutorData?.tutorDocumentData?.username}
          tutor_image={tutorData?.tutorDocumentData?.profilePhotoURL}
          ratings={tutorData?.tutorDocumentData?.rating}
        />
        <OverViewSection
          students={tutorData?.tutorDocumentData.total_students as number}
          activeStudents={tutorData?.tutorDocumentData.active_students as number}
          lessons={tutorData?.tutorDocumentData.completed_lessons as number}
          pendingLessons={tutorData?.tutorDocumentData.pending_lessons as number}
        />

        {isLoading ? (
          <Spinner size="lg"></Spinner>
        ) : authorized ? (
          <div className="relative">
            {isRescheduling && (
              <div
                className="fixed inset-0 bg-black bg-opacity-20 z-20"
                onClick={() => setIsRescheduling(false)}
              ></div>
            )}
            <CalendarSection
              refreshEvents={refreshEvents}
              uid={uid}
              events={events}
              setEventToBeRescheduled={setEventToBeRescheduled}
              setIsRescheduling={setIsRescheduling}
            ></CalendarSection>
            {isRescheduling ? (
              <div className="z-30">
                <MeetingRescheduler
                  uid={uid}
                  isVisible={isRescheduling}
                  setIsVisible={setIsRescheduling}
                  eventId={eventToBeRescheduled}
                  refreshEvents={refreshEvents}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <div className="h-80 w-full flex flex-col items-center mt-5 justify-center gap-y-6 pr-4 pl-4">
              <Link href={consentLink}>
                {" "}
                <button className="bg-empoweredFlag rounded-lg h-10 w-36 text-white">
                  Authorize
                </button>
              </Link>
              <p className="text-sm text-center">
                Please authorize this app with your Google account to seamlessly
                sync your events and meetings. This ensures you stay updated and
                enjoy the full benefits of your calendar.
              </p>
            </div>
          </div>
        )}
        <NextClassSection />
      </div>
      {/* Desktop Screen */}
      <div className="bg-[#F5F7FC] hidden lg:block h-full ">
        <div className="max-w-7xl mx-auto ">
          {/* Logo and Title */}
          <div className="p-5 flex items-center gap-4">
            <Image
              src={Logo.src}
              alt="logo"
              width={50}
              height={50}
              className="h-20 w-20"
            />
            <h1 className="text-2xl font-semibold">
              Empower<span className="text-[#4A148C]">Ed</span> Learning
            </h1>
          </div>
          
          {/*Using Grid Layout */}
          <div className="grid grid-cols-12 gap-4 ">
            {/* CustomizationSection */}
            <div className="col-span-3">
              <CustomizationSection
                uid={uid}
                name={tutorData?.tutorDocumentData?.username || ''}
                number_of_reviews={tutorData?.tutorDocumentData?.total_reviews || 0}
                ratings={tutorData?.tutorDocumentData?.rating || 0}
                tutor_image={tutorData?.tutorDocumentData?.profilePhotoURL || ''}
                isLoading={!tutorDataLoaded}
              />
            </div>
            
            <div className="col-span-6 ">
              <ScheduleSection
                refreshEvents={refreshEvents}
                uid={uid}
                consentLink={consentLink}
                authorized={authorized}
                totalStudents={tutorData?.tutorDocumentData.total_students as number}
                totalLessons={tutorData?.tutorDocumentData.completed_lessons as number}
                pendingLessons={tutorData?.tutorDocumentData.pending_lessons as number}
                activeStudents={tutorData?.tutorDocumentData.active_students as number}
                events={events}
                isLoading={isLoading}
              />
            </div>
            <div className="col-span-3 flex flex-col gap-y-5 w-full h-full">
              <NotificationSection
                tutorNotifications={tutorData?.notifications}
              />

              {latestEvent && <NextClass event={latestEvent} />}
              <GoPremiumComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

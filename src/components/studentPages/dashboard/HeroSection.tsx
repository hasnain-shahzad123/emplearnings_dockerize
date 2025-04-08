"use client"

import CustomizationSection from "./DesktopScreen/CustomizationSection"
import NotificationSection from "./DesktopScreen/NotificationSection"
import ScheduleSection from "./DesktopScreen/ScheduleSection"
import TopSection from "./MobileScreen/TopSection"
import OverViewSection from "./MobileScreen/OverviewSection"
import NextClassSection from "./MobileScreen/NextClassSection"
import Image from "next/image"
import { Logo } from "@/assets/index"
import CalendarSection from "./MobileScreen/CalendarSection"
import { useCallback, useEffect, useState } from "react"
import isCalendarAuthorized from "@/services/googleCalendar/calendarAuthorization/checkCalendarAuthorizationService"
import fetchCalendarEventsService from "@/services/googleCalendar/fetchCalendarEventsService"
import type { MappedEvents, StudentDashboardDataType } from "@/types"
import mapEventsToCalendarStructure from "@/services/googleCalendar/mapEventsToCalendarService"
import generateOAuthConsentLinkService from "@/services/googleCalendar/calendarAuthorization/generateOAuthConsentLinkService"
import Spinner from "@/components/shared/spinner/Spinner"
import Link from "next/link"
import NextClass from "./DesktopScreen/NextClass"
import GoPremiumComponent from "./DesktopScreen/GoPremiumComponent"
import MeetingRescheduler from "./DesktopScreen/MeetingScheduler"

const HeroSection = ({
  uid,
  studentData,
}: {
  uid: string
  studentData: StudentDashboardDataType | undefined
}) => {
  const [authorized, setAuthorized] = useState<boolean>(false)
  const [events, setEvents] = useState<MappedEvents>({})
  const [consentLink, setConsentLink] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false)
  const [eventToBeRescheduled, setEventToBeRescheduled] = useState<string>("")

  useEffect(() => {
    const checkAuthorization = async () => {
      setIsLoading(true)
      const isAuthorized = await isCalendarAuthorized({ uid })
      setAuthorized(isAuthorized)
      if (!isAuthorized) {
        const generatedLink = generateOAuthConsentLinkService({ uid })
        setConsentLink(generatedLink)
      }
      setIsLoading(false)
    }

    checkAuthorization()
  }, [uid])

  const refreshEvents = useCallback(async () => {
    if (authorized) {
      try {
        const response = await fetchCalendarEventsService({ uid: uid })
        if (response.type === "success" && response.events !== null) {
          const events = mapEventsToCalendarStructure(response.events)
          setEvents(events)
        } else {
          setEvents({})
          console.log("Unable to fetch your schedule at this time.", response)
          alert("Unable to fetch your schedule at this time." + response)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        alert("An unexpected error occurred while fetching your schedule.")
      }
    }
  }, [authorized, uid])

  useEffect(() => {
    if (authorized) {
      refreshEvents()
    }
  }, [authorized, refreshEvents])

  useEffect(() => {
    console.log("events are :", events)
  }, [events])

  const getLatestEvent = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()

    const dayEvents = events[year]?.[month]?.[day] || []
    return dayEvents.length > 0 ? dayEvents[0] : null
  }

  const latestEvent = getLatestEvent()

  useEffect(() => {
    console.log("latest event is:", latestEvent)
  }, [latestEvent])

  return (
    <>
      {/* Mobile Screen */}
      <div className="block lg:hidden">
        <TopSection
          studentNotifications={studentData?.notifications}
          username={studentData?.studentDocumentData.username}
          student_image={studentData?.studentDocumentData.profilePhotoURL}
          ratings={studentData?.studentDocumentData.rating}
        />
        <OverViewSection
          totalCourses={studentData?.studentDocumentData.total_courses as number}
          lessons={studentData?.studentDocumentData.completed_lessons as number}
          bookedLessons={studentData?.studentDocumentData.booked_lessons as number}
        />

        {isLoading ? (
          <Spinner size="lg"></Spinner>
        ) : authorized ? (
          <div className="relative">
            {isRescheduling && (
              <div className="fixed inset-0 bg-black bg-opacity-20 z-20" onClick={() => setIsRescheduling(false)}></div>
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
                <button className="bg-empoweredFlag rounded-lg h-10 w-36 text-white">Authorize</button>
              </Link>
              <p className="text-sm text-center">
                Please authorize this app with your Google account to seamlessly sync your events and meetings. This
                ensures you stay updated and enjoy the full benefits of your calendar.
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
            <Image src={Logo.src || "/placeholder.svg"} alt="logo" width={50} height={50} className="h-20 w-20" />
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
                name={studentData?.studentDocumentData.username as string}
                number_of_reviews={studentData?.studentDocumentData.total_reviews as number}
                ratings={studentData?.studentDocumentData.rating as number}
                student_image={studentData?.studentDocumentData.profilePhotoURL as string}
              />
              {/* //student_image will be passed as a prop */}
            </div>
            <div className="col-span-6 ">
              <ScheduleSection
                refreshEvents={refreshEvents}
                uid={uid}
                consentLink={consentLink}
                authorized={authorized}
                totalCourses={studentData?.studentDocumentData.total_courses as number}
                totalLessons={studentData?.studentDocumentData.completed_lessons as number}
                bookedLessons={studentData?.studentDocumentData.booked_lessons as number}
                events={events}
                isLoading={isLoading}
              />
            </div>
            <div className="col-span-3 flex flex-col gap-y-5 w-full h-full">
              <NotificationSection studentNotifications={studentData?.notifications} />

              {latestEvent && <NextClass event={latestEvent} />}
              <GoPremiumComponent />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroSection


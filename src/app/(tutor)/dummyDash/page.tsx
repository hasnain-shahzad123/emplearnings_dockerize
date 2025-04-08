"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import generateOAuthConsentLinkService from "@/services/googleCalendar/calendarAuthorization/generateOAuthConsentLinkService";
import Link from "next/link";
import { Event } from "@/types";
import { useAlert } from "@/contexts/AlertContext";

import createCalendarEventService from "@/services/googleCalendar/createCalendarEventService";
import fetchCalendarEventsService from "@/services/googleCalendar/fetchCalendarEventsService";

const Dashboard = () => {
  const { showAlert } = useAlert();
  const [consentLink, setConsentLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState<string>("");
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);

  // Event creation form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [studentEmails, setStudentEmails] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const params = useSearchParams();
  useEffect(() => {
    const status = params.get("status");
    if (status === "error") {
      setAuthError("There was an issue during authorization.");
    }
    if (status === "success") {
      setAuthSuccess("Authorization successful!");
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Checking if the user has a valid UID and generating consent link
        if (user.uid) {
          const link = generateOAuthConsentLinkService({ uid: user.uid });
          setConsentLink(link);
        } else {
          console.error("Can't get link because UID is missing.");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleFetchEvents = async () => {
    const uid = auth?.currentUser?.uid || "";
    const eventsFetch = await fetchCalendarEventsService({ uid });
    if (eventsFetch.type == "error") {
      console.log("unable to fetch events", eventsFetch.error);
    } else {
      setCalendarEvents(eventsFetch.events);
    }
  };

  const handleCreateEvent = async () => {
    const attendees = studentEmails
      .split(",")
      .map((email) => ({ email: email.trim() }));
    const uid = auth?.currentUser?.uid || "";
    const name = "M.Haris";
    const eventCreation = await createCalendarEventService({
      uid,
      name,
      title,
      description,
      startTime,
      endTime,
      attendees,
    });
    if (eventCreation.type === "error") {
      //alert("unable to create event, see console");
      showAlert("unable to create event, see console", "ERROR");
      
      console.log(eventCreation.details);
    } else {
     // alert("event creation successfull");
      showAlert("event creation successfull", "SUCCESS");
      handleFetchEvents();
    }
  };

  return (
    <div className="h-screen w-screen bg-purple-500 overflow-scroll flex flex-col items-center justify-evenly text-white">
      <h1>This is the dashboard</h1>
      {authError && <p className="text-red-500">{authError}</p>}
      {authSuccess && <p className="text-green-500">{authSuccess}</p>}

      {consentLink ? (
        <div className="h-screen w-screen flex flex-col justify-evenly mt-10 items-center gap-y-10">
          <Link
            href={consentLink}
            className="bg-purple-400 rounded-md h-10 flex w-80 text-center items-center justify-center"
          >
            Authorize Google Calendar
          </Link>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateEvent();
            }}
            className="flex flex-col gap-y-4 bg-white p-6 rounded-lg text-purple-600 shadow-md"
          >
            <h2 className="text-lg font-semibold">Create Event</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Student Emails (comma-separated)"
              value={studentEmails}
              onChange={(e) => setStudentEmails(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Create Event
            </button>
          </form>

          <button
            className="bg-[#4A148C] px-6 py-3 sm:px-7 sm:py-3 rounded-full text-white text-xs sm:text-sm md:text-md"
            onClick={handleFetchEvents}
          >
            Fetch Events
          </button>

          <div className="grid grid-cols-3 gap-4 text-purple-600">
            {calendarEvents?.map((event, index) => (
              <div
                key={index}
                className="rounded-lg h-80 w-56 bg-white flex flex-col justify-center items-center shadow-lg"
              >
                <a
                  href={event.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-sm p-2"
                >
                  <p>{event.summary}</p>
                  <p>{new Date(event.startTime).toLocaleString()}</p>
                  <p>{new Date(event.endTime).toLocaleString()}</p>
                  <p>Attendees: {event.attendees?.join(", ")}</p>
                  <p>
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      Join Meeting
                    </a>
                  </p>
                  <p>attendee names :{"dummy"}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Please log in to authorize Google Calendar.</p>
      )}
    </div>
  );
};

const DummyDashBoard = () => {
  return (
    <div>
      <Suspense fallback={"Loading..."}>
        <Dashboard />
      </Suspense>
    </div>
  );
};

export default DummyDashBoard;

import { Event, MappedEvents } from "@/types";

const mapEventsToCalendarStructure = (eventsArray: Event[]): MappedEvents => {
  const mappedEvents: MappedEvents = {};

  eventsArray.forEach((event) => {
    const startDate = new Date(event.startTime);
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;
    const day = startDate.getDate();

    // Initializing the structure if it doesn't exist
    if (!mappedEvents[year]) {
      mappedEvents[year] = {};
    }
    if (!mappedEvents[year][month]) {
      mappedEvents[year][month] = {};
    }
    if (!mappedEvents[year][month][day]) {
      mappedEvents[year][month][day] = [];
    }

    // Adding the event to the appropriate day
    mappedEvents[year][month][day].push({
      meetingLink: event.meetingLink,
      eventLink: event.eventLink,
      startTime: event.startTime,
      endTime: event.endTime,
      attendees: event.attendees,
      summary: event.summary,
      eventId: event.eventId,
      attendeeNames: event.attendeeNames,
    });
  });
  return mappedEvents;
};

export default mapEventsToCalendarStructure;

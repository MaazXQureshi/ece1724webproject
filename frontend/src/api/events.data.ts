import axios from 'axios';
import { EventResponse } from "@/models/event.model.ts";
import { formatDate, formatTime } from "@/utils/helpers.tsx";

export interface getEventFilter {
  eventName?: string;
  eventLocation?: string;
  date?: Date;
  hours?: number;
  tags: string[];
}

export async function getEvents(filters: getEventFilter) {

  const { eventName, eventLocation, date, hours, tags } = filters;
  try {
    let queryString = '';

    if (eventName) queryString += `&name=${ eventName }`;
    if (eventLocation) queryString += `&location=${ eventLocation }`;
    if (date) queryString += `&date=${ date }`;
    if (hours) queryString += `&hours=${ hours }`;
    if (tags.length !== 0) queryString += `&tags=${ tags }`;

    const response = await axios.get(`/api/events?${ queryString }`);
    const data = response.data;
    const parsedEvents: EventResponse = data.events.map((event: any) => ({
      ...event,
      date: formatDate(event.time),
      time: formatTime(event.time),
      organizer: {
        ...event.organizer,
        tags: event.organizer.orgTags.map((tag: any) => (tag.tag.name))
      }
    }))

    return {
      ...data,
      events: parsedEvents,
    };
  } catch (err) {
    console.log(err)
    throw err;
  }
}

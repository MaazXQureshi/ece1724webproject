import axios from "axios";
import { EventResponse } from "@/models/event.model.ts";
import { formatDate, formatTime } from "@/utils/helpers.tsx";

export interface getEventFilter {
  eventName?: string;
  eventLocation?: string;
  date?: Date;
  hours?: number;
  tags: string[];
}

export async function getEvents(
  filters: getEventFilter,
  limit: number,
  offset: number,
  userId?: number // Used for user registration fetching
) {
  const { eventName, eventLocation, date, hours, tags } = filters;
  try {
    const params = new URLSearchParams();

    if (eventName) params.append("name", eventName);
    if (eventLocation) params.append("location", eventLocation);
    if (date) params.append("date", date.toLocaleString());
    if (hours) params.append("hours", hours.toString());
    tags.forEach((tag) => params.append("tags", tag));
    if (limit) params.append("limit", limit.toString());
    if (offset) params.append("offset", offset.toString());
    if (userId) params.append("userId", userId.toString());

    console.log("User id to fetch events for: ", userId);

    const response = await axios.get(`/api/events?${params.toString()}`);
    const data = response.data;
    const parsedEvents: EventResponse = data.events.map((event: any) => ({
      ...event,
      date: formatDate(event.time),
      time: formatTime(event.time),
      organizer: {
        ...event.organizer,
        tags: event.organizer.orgTags.map((tag: any) => tag.tag.name),
      },
    }));

    return {
      ...data,
      events: parsedEvents,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getTags(name: string) {
  try {
    const params = new URLSearchParams();
    if (name) params.append("name", name);

    const response = await axios.get(`/api/tags?${params.toString()}`);
    const data = response.data;
    const parsedTags: EventResponse = data.events.map((tag: any) => tag.name);

    return {
      ...data,
      tags: parsedTags,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getTagsFull(name: string) {
  try {
    const params = new URLSearchParams();
    if (name) params.append("name", name);

    const response = await axios.get(`/api/tags?${params.toString()}`);
    const data = response.data;
    const parsedTags: EventResponse = data.events.map((tag: any) => tag);

    return {
      ...data,
      tags: parsedTags,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

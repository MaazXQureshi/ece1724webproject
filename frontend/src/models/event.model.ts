import { Organizer } from "@/models/organizer.model.ts";
import { Register } from "@/models/register.model.ts";

export interface Event {
  id: number;
  clubId: number;
  name: string;
  date: string;
  time: string;
  location: string;
  info?: string | null;
  hours?: number | null;
  imageUrl?: string;
  organizer: Organizer;
  registrations: Register[];
}

export interface EventResponse {
  events: Event[];
  total: number;
  limit: number;
  offset: number;
}

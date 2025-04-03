import { User } from "@/models/user.model.ts";
import { Event } from "@/models/event.model.ts";

export interface Register {
  userId: number;
  eventId: number;
  user: User;
  event: Event;
}

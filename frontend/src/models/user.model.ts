import { Register } from "@/models/register.model.ts";
import { Organizer } from "@/models/organizer.model.ts";

export interface User {
  id: number;
  email: string;
  username: string;
  admin: boolean;
  passwordHash: string;
  organizer?: Organizer | null;
  registrations: Register[];
}

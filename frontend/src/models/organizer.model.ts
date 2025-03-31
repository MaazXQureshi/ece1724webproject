export interface Organizer {
  id: number;
  name: string;
  info?: string | null;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string;
  tags?: string[];
}

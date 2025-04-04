import { Organizer } from "@/models/organizer.model.ts";
import { Tag } from "@/models/tag.model.ts";

export interface OrgTag {
  orgId: number;
  tagId: number;
  organizer: Organizer;
  tag: Tag;
}

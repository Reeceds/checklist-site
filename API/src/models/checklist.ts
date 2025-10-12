import { checklistItem } from "./checklistItem";

export interface Checklist {
    id: number;
    title: string;
    date_modified: string;
    checklist_items?: checklistItem[];
    user_id: number;
}

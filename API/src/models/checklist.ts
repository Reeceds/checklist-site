import { checklistItem } from "./checklistItem";

export interface Checklist {
    id: number;
    title: string;
    date_modified: string;
    checklistItems?: checklistItem[];
}

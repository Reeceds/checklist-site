import { checklistItem } from "./checklistItem";

export interface Checklist {
    id: number;
    title: string;
    dateModified: string;
    checklistItems?: checklistItem[];
    userId: number;
}

import { ChecklistItem } from './checklistItem';

export interface Checklist {
  id?: number;
  title?: string;
  dateModified?: string;
  checklistItems?: ChecklistItem[];
  userId?: number;
}

import { ChecklistItem } from './checklistItem';

export interface Checklist {
  id?: number;
  title?: string;
  date_modified?: string;
  checklist_items?: ChecklistItem[];
  user_id?: number;
}

export interface ChecklistItem {
  id?: number;
  content?: string;
  is_checked?: boolean | number;
  position?: number;
  date_modified?: string;
  checklist_id?: number;
  user_id?: number;
  temp_id?: number;
}

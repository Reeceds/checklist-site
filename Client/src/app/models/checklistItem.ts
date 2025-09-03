export interface ChecklistItem {
  id?: number;
  content?: string;
  isChecked?: boolean | number;
  position?: number;
  dateModified?: string;
  checklistId?: number;
  userId?: number;
  tempId?: number;
}

import { Checklist } from "./checklist";

export interface User {
    id: number;
    email: string;
    dateModified?: string;
    refreshToken?: string;
    checklist?: Checklist[];
}

import { Checklist } from "./checklist";

export interface User {
    id: number;
    email: string;
    date_modified?: string;
    refresh_token?: string;
}

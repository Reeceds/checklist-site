import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ChecklistItem } from '../models/checklistItem';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private url = environment.apiUrl;

  isChecklistSaved = signal<boolean>(true); // Used in the 'side-nav.component' to check for checklistItem changes before creating/editing the current checklist name

  constructor(private http: HttpClient) {}

  modifyChecklistItem(id: number, data: ChecklistItem[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'text/plain',
      }),
    };

    const snippetData = JSON.stringify(data);

    return this.http.post<any>(
      `${this.url}checklistItem/${id}`,
      data,
      httpOptions
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ChecklistItem } from '../models/checklistItem';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private url = environment.apiUrl;

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

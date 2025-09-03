import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Checklist } from '../models/checklist';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getChecklists(): Observable<Checklist[] | undefined> {
    return this.http.get<Checklist[]>(`${this.url}checklist`);
  }

  getChecklistById(id: number): Observable<Checklist | undefined> {
    return this.http.get<Checklist>(`${this.url}checklist/${id}`);
  }

  createChecklist(data: Checklist): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'text/plain',
      }),
    };

    const checklistData = JSON.stringify(data);

    return this.http.post<any>(
      `${this.url}checklist`,
      checklistData,
      httpOptions
    );
  }

  editChecklist(data: Checklist, id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'text/plain',
      }),
    };

    const checklistData = JSON.stringify(data);

    return this.http.patch<any>(
      `${this.url}checklist/edit/${id}`,
      checklistData,
      httpOptions
    );
  }

  deleteChecklist(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}checklist/delete/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User | undefined> {
    return this.http.get<User>(`${this.url}current-user`);
  }
}

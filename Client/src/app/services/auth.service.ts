import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleCredentials } from '../models/googleCredentials';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiUrl;
  private accessToken: string | null = null;
  currentUserSource = new BehaviorSubject({}); // Store access token in memory
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  googleLoginApi(credentials: GoogleCredentials): Observable<any> {
    const httpOptions = {
      withCredentials: true, // jwt cookie which was set on the backend will be passed on all requests using withCredentials
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const googleCredentials = JSON.stringify(credentials);

    return this.http.post<GoogleCredentials>(
      `${this.url}authentication/google-login`,
      googleCredentials,
      httpOptions
    );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(
      `${this.url}authentication/refresh-token`,
      {},
      { withCredentials: true }
    );
  }

  setCurrentUser(userDetails: User) {
    this.currentUserSource.next(userDetails);
  }

  logout() {
    this.clearAccessToken();

    this.http
      .post(`${this.url}authentication/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        window.location.href = '/';
      });
  }
}

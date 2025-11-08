import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  switchMap,
  throwError,
  filter,
  take,
  finalize,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { EventTriggerService } from '../services/event-trigger.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null); // To queue requests during refresh

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const _authService = inject(AuthService);
  const _eventTriggerService = inject(EventTriggerService);

  const accessToken = _authService.getAccessToken();
  const isRefreshRequest = req.url.includes('/refresh-token');
  const isGoogleRequest = req.url.includes('/google-client-id');

  // Attach the Authorization header if the access token exists and it's not a refresh request
  let authReq = req;

  if (accessToken && !isRefreshRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Display loading overlay until the Google button appears
  if (isGoogleRequest) {
    _eventTriggerService.getPendingTrigger(true);
    return next(req).pipe(
      finalize(() => {
        // finalize() is always called after success or error — request is no longer pending
        _eventTriggerService.getPendingTrigger(false);
      })
    );
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshRequest) {
        // Handle token refresh
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return _authService.refreshToken().pipe(
            switchMap((response) => {
              isRefreshing = false;
              _authService.setAccessToken(response.accessToken);
              refreshTokenSubject.next(response.accessToken);

              // Retry the failed request with the new access token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });

              return next(newReq);
            }),
            catchError((refreshError) => {
              console.log('REFRESH TOKEN REQUEST FAILED');
              isRefreshing = false;
              _authService.logout();

              return throwError(() => refreshError);
            })
          );
        } else {
          // Queue other requests until the token is refreshed
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((newToken) => {
              // Retry the original request with the new token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken!}`,
                },
              });

              return next(newReq);
            })
          );
        }
      }

      // Redirect to profile page if trying to create snippet/document with no 'DisplayName'
      // if (error.status === 400 && error.error === 'No display name found') {
      //   router.navigate(['/app/profile']);
      // }

      return throwError(() => error); // Propagate other errors
    })
  );
};

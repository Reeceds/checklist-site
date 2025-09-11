import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Add this to use 'environment.apiUrl' in appConfig. 'API_URL' can be @inject into component and used as a representation of 'environment.apiUrl'
    { provide: 'API_URL', useValue: environment.apiUrl },
    //! This code provides the Google social login service inside '@abacritt/angularx-social-login' with the correct credentials before the app initializes, these credentails are used to determine the login workflow e.g. popup or onetap, consent/no consent. The "<asl-google-signin-button>" button inside  'google-login.component.html' will not load correctly without this code. It retreives the 'clientId' from the backend where it is safely stored instead of storing it in Angular.
    // 'useFactory' is used to make an api call within the 'appConfig' object, this is used to store GoogleId in backend securely instead of in Angular
    {
      provide: 'SocialAuthServiceConfig',
      useFactory: async (http: HttpClient) => {
        const res = await firstValueFrom(
          http.get<{ clientId: string }>(
            `${environment.apiUrl}config/google-client-id`
          )
        );
        return {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(res.clientId, {
                oneTapEnabled: false,
                prompt: 'consent',
              }),
            },
          ],
        };
      },
      // deps: [HttpClient] ensures that HttpClient is available for making API calls
      deps: [HttpClient],
    },
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(), // required for Toastr
    provideToastr(), // Toastr setup
  ],
};

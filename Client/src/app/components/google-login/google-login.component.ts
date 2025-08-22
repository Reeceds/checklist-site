import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleCredentials } from '../../models/googleCredentials';
import { User } from '../../models/user';

@Component({
  selector: 'app-google-login',
  imports: [CommonModule, FontAwesomeModule, GoogleSigninButtonModule],
  templateUrl: './google-login.component.html',
  styleUrl: './google-login.component.scss',
})
export class GoogleLoginComponent {
  public faGoogle = faGoogle;
  public faSpinner = faSpinner;

  destroyRef = inject(DestroyRef);

  isUserAuthenticated: boolean = false;
  isLoading: boolean = false;
  isServerError: boolean = false;

  user: User = {};

  constructor(
    private _socialAuthService: SocialAuthService,
    private _authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.googleLogin();
  }

  googleLogin() {
    this._socialAuthService.authState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading = true;
          console.log('Response from Google: ', res);
          const googleCreds: GoogleCredentials = {
            idToken: res.idToken,
            provider: res.provider,
          };

          this.user = {
            email: res.email,
          };

          this.handleCredentialResponse(googleCreds);
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }

  handleCredentialResponse(credentials: GoogleCredentials) {
    this._authService
      .googleLoginApi(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          console.log('Response from backend: ', res);
          if (res.isAuthSuccessful === true) {
            this.isUserAuthenticated = true;

            this._authService.setAccessToken(res.accessToken);

            this.user = {
              ...this.user,
            };

            this._authService.setCurrentUser(this.user);
            this.router.navigate(['/app']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log('handleCredentialResponse', err);

          if (err.status === 500) {
            this.isServerError = true;
          }
        },
      });
  }
}

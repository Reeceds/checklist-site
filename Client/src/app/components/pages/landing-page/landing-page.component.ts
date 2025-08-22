import { Component } from '@angular/core';
import { GoogleLoginComponent } from '../../google-login/google-login.component';

@Component({
  selector: 'app-landing-page',
  imports: [GoogleLoginComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {}

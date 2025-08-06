import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { HeaderNavComponent } from '../../header-nav/header-nav.component';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, SideNavComponent, HeaderNavComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}

import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-nav',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss',
})
export class HeaderNavComponent implements OnInit {
  faUser = faUser;
  loggedIn: boolean = false;
  pageWidth: number = 0;
  tablesSizePx: number = 992;
  tabletSize: boolean = false;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.TabletSizeOnPageLoad();
  }

  logout() {
    this._authService.logout();
  }

  // Checks if the screen is tablet size on page resize (makes sure that the profile icon is removed when tablet size)
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.pageWidth = (event.target as Window).innerWidth;

    if (this.pageWidth < this.tablesSizePx) {
      this.tabletSize = true;
    } else {
      this.tabletSize = false;
    }
  }

  // Checks if the screen is tablet size on page load (makes sure that the profile icon is removed when tablet size)
  TabletSizeOnPageLoad() {
    this.pageWidth = window.innerWidth;
    this.pageWidth < this.tablesSizePx ? (this.tabletSize = true) : null;
  }
}

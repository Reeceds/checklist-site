import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { HeaderNavComponent } from '../../header-nav/header-nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-page',
  imports: [
    RouterOutlet,
    SideNavComponent,
    HeaderNavComponent,
    FontAwesomeModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  faChevronIcon = faChevronRight;

  isSidePanelExpanded = false;

  toggleSidePanel() {
    if (!this.isSidePanelExpanded) {
      this.isSidePanelExpanded = true;
      this.faChevronIcon = faChevronLeft;
    } else {
      this.isSidePanelExpanded = false;
      this.faChevronIcon = faChevronRight;
    }
  }

  closeSidePanel() {
    this.isSidePanelExpanded = false;
    this.faChevronIcon = faChevronRight;
  }
}

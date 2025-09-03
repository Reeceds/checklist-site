import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../../side-nav/side-nav.component';
import { HeaderNavComponent } from '../../header-nav/header-nav.component';
import { InputSaveComponent } from '../../input-save/input-save.component';
import { ChecklistPageComponent } from '../checklist-page/checklist-page.component';

@Component({
  selector: 'app-main-page',
  imports: [
    RouterOutlet,
    SideNavComponent,
    HeaderNavComponent,
    InputSaveComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  // showInputBar = false;
  // toggleInputBar(component: any) {
  //   if (component instanceof ChecklistPageComponent) {
  //     this.showInputBar = true;
  //   } else {
  //     this.showInputBar = false;
  //   }
  // }
}

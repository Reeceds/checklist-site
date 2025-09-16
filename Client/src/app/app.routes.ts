import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/pages/landing-page/landing-page.component';
import { ChecklistPageComponent } from './components/pages/checklist-page/checklist-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { PendingChangesGuard } from './guards/pending-changes.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full',
    title: 'Home Page',
  },
  {
    path: 'app',
    component: MainPageComponent,
    title: 'App Page',
    children: [
      {
        path: 'profile',
        component: ProfilePageComponent,
        title: 'Profile Page',
      },
      {
        path: 'checklist/:id',
        component: ChecklistPageComponent,
        title: 'checklist Page',
        canDeactivate: [PendingChangesGuard],
      },
      {
        path: 'checklist',
        component: ChecklistPageComponent,
        title: 'checklist Page',
      },
    ],
  },
];

// When uer logs in, they are directed to /app/checklist/x

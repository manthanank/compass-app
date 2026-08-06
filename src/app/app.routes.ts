import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'places',
    loadComponent: () =>
      import('./features/places/pages/places-management/places-management').then(
        (m) => m.PlacesManagementComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/pages/settings/settings').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

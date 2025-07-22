import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard-component/dashboard-component';
import { UsersComponent } from './features/dashboard/components/users-component/users-component';
import { VehiclesComponent } from './features/dashboard/components/vehicles-component/vehicles-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'vehicles',
        component: VehiclesComponent
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];


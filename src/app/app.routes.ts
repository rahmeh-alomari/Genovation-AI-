import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/components/dashboard-component/dashboard-component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./core/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./core/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/dashboard/components/users-component/users-component').then(m => m.UsersComponent)
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./features/dashboard/components/vehicles-component/vehicles-component').then(m => m.VehiclesComponent)
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  }
];

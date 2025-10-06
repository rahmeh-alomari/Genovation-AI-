import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/components/dashboard-component/dashboard-component';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login.component').then(m => m.LoginComponent),
    data: {
      metaTitle: 'Login | Admin Panel',
      metaDescription: 'Log in to access the dashboard and manage content.'
    }
  },
  {
    path: 'signup',
    loadComponent: () => import('./core/auth/signup/signup.component').then(m => m.SignupComponent),
    data: {
      metaTitle: 'Sign Up | Admin Panel',
      metaDescription: 'Create a new admin account to manage the dashboard.'
    }
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./core/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    data: {
      metaTitle: 'Reset Password | Admin Panel',
      metaDescription: 'Reset your password to regain access to your admin account.'
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: {
      metaTitle: 'Dashboard | Admin Panel',
      metaDescription: 'Overview of your admin dashboard.'
    },
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/dashboard/components/users-component/users-component').then(m => m.UsersComponent),
        data: {
          metaTitle: 'Manage Users | Admin Panel',
          metaDescription: 'View and manage application users.'
        }
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./features/dashboard/components/vehicles-component/vehicles-component').then(m => m.VehiclesComponent),
        data: {
          metaTitle: 'Manage Vehicles | Admin Panel',
          metaDescription: 'View and manage vehicles in the system.'
        }
      },
     
      
       
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];
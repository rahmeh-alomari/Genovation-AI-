import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard-component/dashboard-component';
import { UsersComponent } from './features/dashboard/components/users-component/users-component';
import { VehiclesComponent } from './features/dashboard/components/vehicles-component/vehicles-component';
import { LoginComponent } from './core/auth/login/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { SignupComponent } from './core/auth/signup/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
    {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
     canActivate: [authGuard],
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


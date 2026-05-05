import { Routes } from '@angular/router';
import { MainLayout, AuthLayout } from '../layout';
import { routes as authRoutes } from '../features/auth/auth.routes';
import { mainRoutes } from './main.routes';
import { authGuard, guestGuard } from '../core';
import { Forbidden } from '../features/forbidden/forbidden';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: mainRoutes,
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: authRoutes,
    canActivate: [guestGuard],
  },
  {
    path: 'forbidden',
    component: Forbidden,
  },
  { path: '**', redirectTo: '' },
];

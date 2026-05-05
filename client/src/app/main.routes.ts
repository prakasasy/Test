import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { Home } from '../features/home/home';

const title = environment.title;

export const mainRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title: `Home - ${title}` },
];

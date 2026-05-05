import { Routes } from '@angular/router';
import { Login } from './login/login';
import { environment } from '../../environments/environment';

const title = environment.title;

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        title: `Login - ${title}`
    }
];

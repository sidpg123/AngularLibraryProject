import { Routes } from "@angular/router";
import { authRedirectGuard } from "./guards/authRedirect.guard";


export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
        {
            path: 'login',
            canActivate: [authRedirectGuard],
            loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
        },
        {
            path: 'register', 
            canActivate: [authRedirectGuard],
            loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
        },
    {
        path: '**',
        redirectTo: 'login',
    }
]
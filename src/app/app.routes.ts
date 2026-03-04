import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { LandingComponent } from './landing/landing.component';
import { librarianChildGuard } from './auth/guards/librarian-child.guard';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'books',
        loadChildren: () => import('./books/books.routes').then(m => m.BOOKS_ROUTES)
    },
    {
        path: 'my-books',
        canActivate: [authGuard],
        loadChildren: () => import('./my-books/my-books.routes').then(m => m.MY_BOOKS_ROUTES)
    },
    {
        path: 'librarian',
        canActivateChild: [librarianChildGuard],
        canActivate: [authGuard],
        loadChildren: () => import('./librarian/librarian.routes').then(m => m.LIBRARIAN_ROUTES)
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
    }
];

import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    // { path: '', } this is going to be landing page/
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
        canActivate: [authGuard],
        loadChildren: () => import('./librarian/librarian.routes').then(m => m.LIBRARIAN_ROUTES)
    }
];

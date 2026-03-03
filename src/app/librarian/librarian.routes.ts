import { Routes } from '@angular/router';

export const LIBRARIAN_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./dashboard/dashboard.component')
                .then(m => m.DashboardComponent)
    },
    {
        path: 'manage-books',
        loadComponent: () =>
            import('./manage-books/manage-books.component')
                .then(m => m.ManageBooksComponent)
    },
    {
        path: 'manage-users',
        loadComponent: () =>
            import('./manage-users/manage-users.component')
                .then(m => m.ManageUsersComponent)
    },
    {
        path: 'manage-books/:id',
        loadComponent: () => import('./manage-books/book-details/book-details.component').then(m => m.BookDetailComponent)
    },
    {
        path: 'manage-users',
        loadComponent: () => import('./manage-users/manage-users.component').then(m => m.ManageUsersComponent)
    },
    {
        path: 'manage-users/:id',
        loadComponent: () => import('./manage-users/user-details/user-details.component').then(m => m.UserDetailComponent)
    }
];
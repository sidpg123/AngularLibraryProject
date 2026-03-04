import { Routes } from '@angular/router'
import { userGuard } from '../auth/guards/user.guard'


export const BOOKS_ROUTES: Routes = [
    {
        path: '',
        canActivate: [userGuard],
        loadComponent: () => import('./books-list/books-list.component').then(m => m.BooksListComponent)
    },
    {
        path: ':id',
        // canActivate: [userGuard],
        loadComponent: () => import('./books-detail/books-detail.component').then(m => m.BookDetailComponent)
    },
]
import { Routes } from '@angular/router'


export const BOOKS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./books-list/books-list.component').then(m => m.BooksListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./books-detail/books-detail.component').then(m => m.BookDetailComponent)
    },
]
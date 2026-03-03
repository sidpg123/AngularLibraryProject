import { Routes } from "@angular/router";


export const MY_BOOKS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./my-books.component').then(m => m.MyBooksComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./issue-details/issue-details.component').then(m => m.IssueDetailComponent)
    }
]
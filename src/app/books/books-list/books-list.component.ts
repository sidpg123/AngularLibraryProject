import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../../models/books.model';
import { BookCardComponent } from '../books-card/books-card.component';
import { AuthService } from '../../auth/auth.service';
import { IssueService } from '../../my-books/issue.service';
import { LoadingSpinnerComponent } from '../../shared/loading.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, BookCardComponent, LoadingSpinnerComponent],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent implements OnInit {

  books: Book[] = [];
  errorMessage = '';
  isLoading = false;

  searchTerm$ = new Subject<string>();
  searchTerm = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private bookService: BookService,
    private router: Router,
    private authService: AuthService,
    private issueService: IssueService
  ) { }

  ngOnInit(): void {

    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {

          this.isLoading = true;

          if (!term || term.trim() === '') {
            return this.bookService.getAllBooks();
          }

          return this.bookService.searchBooks(term);

        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (books) => {
          this.books = books;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err?.error?.error || 'Failed to fetch books';
          this.isLoading = false;
        }
      });

    this.loadBooks();
  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getAllBooks().subscribe({
      next: (data) => { this.books = data; this.isLoading = false; },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to fetch books';
        this.isLoading = false;
      }
    });
  }

  onViewDetails(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }

  onIssueBook(bookId: number): void {
    this.issueService.borrowBook(bookId, this.authService.getCurrentUser()?.id).subscribe({
      next: (response) => { alert(response.message); this.loadBooks(); },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to issue book';
        alert(this.errorMessage);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm$.next(value);
  }

  // selectedCategory = '';

  // onFilter(event: Event): void {
  //   const value = (event.target as HTMLSelectElement).value;
  //   this.selectedCategory = value;
  //   this.loadBooks();
  // }
}
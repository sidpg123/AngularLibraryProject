import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../books/book.service';
import { Book } from '../../models/books.model';
import { FormsModule } from '@angular/forms';
import { BookFormComponent } from './book-form/book-form.component';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../shared/loading.component';
import { ConfirmDialogService } from '../../shared/confirm/confirm-dialog-host/confirm-dialogue.service';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule, BookFormComponent, LoadingSpinnerComponent],
  templateUrl: './manage-books.component.html',
  styleUrl: './manage-books.component.css'         
})
export class ManageBooksComponent implements OnInit {

  books: Book[] = [];
  categories: string[] = [];

  isLoading = false;
  errorMessage = '';

  searchTerm = '';
  selectedCategory = 'all';

  sortColumn: keyof Book | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showFormModal = false;
  selectedBook: Book | null = null;

  constructor(private bookService: BookService, private router: Router, private confirm: ConfirmDialogService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getAllBooks().subscribe({
      next: (res) => { this.books = res; this.isLoading = false; },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load books';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.bookService.getBookCategoryList().subscribe({
      next: (res) => { this.categories = res; }
    });
  }

  applySearch(books: Book[]): Book[] {
    if (!this.searchTerm.trim()) return books;
    const term = this.searchTerm.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(term) ||
      b.isbn?.toLowerCase().includes(term) ||
      b.category?.toLowerCase().includes(term)
    );
  }

  applyCategoryFilter(books: Book[]): Book[] {
    if (this.selectedCategory === 'all') return books;
    return books.filter(b => b.category === this.selectedCategory);
  }

  sortBy(column: keyof Book): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  applySort(books: Book[]): Book[] {
    if (!this.sortColumn) return books;
    return [...books].sort((a, b) => {
      const vA = a[this.sortColumn as keyof Book];
      const vB = b[this.sortColumn as keyof Book];
      if (vA == null) return -1;
      if (vB == null) return 1;
      if (typeof vA === 'number' && typeof vB === 'number') {
        return this.sortDirection === 'asc' ? vA - vB : vB - vA;
      }
      return this.sortDirection === 'asc'
        ? String(vA).localeCompare(String(vB))
        : String(vB).localeCompare(String(vA));
    });
  }

  get processedBooks(): Book[] {
    let result = this.books;
    result = this.applySearch(result);
    result = this.applyCategoryFilter(result);
    result = this.applySort(result);
    return result;
  }

  openCreateForm(): void { this.selectedBook = null; this.showFormModal = true; }
  closeForm(): void      { this.showFormModal = false; }
  onBookSaved(): void    { this.loadBooks(); this.closeForm(); }
  editBook(book: Book): void { this.selectedBook = book; this.showFormModal = true; }

 deleteBook(id: number): void {

  this.confirm
    .open(
      'Delete Book',
      'Are you sure you want to delete this book? This action cannot be undone.'
    )
    .subscribe(result => {

      if (!result) return;

      this.bookService.deleteBook(String(id)).subscribe({
        next: () => this.loadBooks(),
        error: (err) => alert(err?.error?.error || 'Delete failed')
      });

    });

}

  viewDetails(id: number): void {
    this.router.navigate(['/librarian/manage-books', id]);
  }
}
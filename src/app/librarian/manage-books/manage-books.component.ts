import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../books/book.service';
import { Book } from '../../models/books.model';
import { FormsModule } from '@angular/forms';
import { BookFormComponent } from "./book-form/book-form.component";
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from "../../shared/loading.component";

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule, BookFormComponent, LoadingSpinnerComponent],
  templateUrl: './manage-books.component.html'
})
export class ManageBooksComponent implements OnInit {

  books: Book[] = [];
  categories: string[] = [];

  isLoading = false;
  errorMessage = '';

  // 🔍 Search & Filter
  searchTerm = '';
  selectedCategory = 'all';

  // ↕ Sorting
  sortColumn: keyof Book | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showFormModal = false;
  selectedBook: Book | null = null;

  constructor(private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks(): void {
    this.isLoading = true;

    this.bookService.getAllBooks().subscribe({
      next: (res) => {
        this.books = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load books';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.bookService.getBookCategoryList().subscribe({
      next: (res) => {
        this.categories = res;
      }
    });
  }

  // -----------------------------
  // SEARCH
  // -----------------------------

  applySearch(books: Book[]): Book[] {
    if (!this.searchTerm.trim()) return books;

    const term = this.searchTerm.toLowerCase();

    return books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.isbn?.toLowerCase().includes(term) ||
      book.category?.toLowerCase().includes(term)
    );
  }

  // -----------------------------
  // CATEGORY FILTER
  // -----------------------------

  applyCategoryFilter(books: Book[]): Book[] {
    if (this.selectedCategory === 'all') return books;

    return books.filter(
      book => book.category === this.selectedCategory
    );
  }

  // -----------------------------
  // SORTING
  // -----------------------------

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

      const valueA = a[this.sortColumn as keyof Book];
      const valueB = b[this.sortColumn as keyof Book];

      if (valueA == null) return -1;
      if (valueB == null) return 1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      return this.sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }

  // -----------------------------
  // FINAL PROCESSED LIST
  // -----------------------------

  get processedBooks(): Book[] {
    let result = this.books;
    result = this.applySearch(result);
    result = this.applyCategoryFilter(result);
    result = this.applySort(result);
    return result;
  }


  openCreateForm(): void {
    this.selectedBook = null;   // create mode
    this.showFormModal = true;
  }

  closeForm(): void {
    this.showFormModal = false;
  }

  onBookSaved(): void {
    this.loadBooks();
    this.closeForm();
  }

  editBook(book: Book): void {
    this.selectedBook = book;
    this.showFormModal = true;
  }

  deleteBook(id: number): void {

    const confirmDelete = confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    this.bookService.deleteBook(String(id)).subscribe({
      next: () => {
        this.loadBooks();
      },
      error: (err) => {
        alert(err?.error?.error || 'Delete failed');
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/librarian/manage-books', id]);
  }
}
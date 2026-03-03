import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Book } from '../models/books.model';
import { getBookAvailabilityResponse } from '../models/book-service.models';

export interface CreateBookPayload {
  title: string;
  body: string;
  isbn?: string;
  category?: string;
  publishedYear?: number;
  totalCopies?: number;
  coverImage?: string;
}

export interface UpdateBookPayload {
  title?: string;
  body?: string;
  category?: string;
  publishedYear?: number;
  totalCopies?: number;
  coverImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly apiUrl = 'http://localhost:3001/api/books';

  constructor(private http: HttpClient) {}

  // -------------------------
  // PUBLIC ENDPOINTS
  // -------------------------

  /**
   * Get all books (detailed)
   */
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/detailed`).pipe(
      retry({
        count: 2,
        delay: (error: HttpErrorResponse) => {
          if (error.status === 0 || error.status >= 500) {
            return timer(1000);
          }
          return throwError(() => error);
        }
      })
    );
  }

  /**
   * Get single book by ID
   */
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/detailed/${id}`);
  }

  /**
   * Search books
   */
  searchBooks(term: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search`, {
      params: { q: term }
    });
  }

  /**
   * Get only available books
   */
  getAvailableBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/available`);
  }

  /**
   * Get category list
   */
  getBookCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories/list`);
  }

  /**
   * Get books by category
   */
  getBooksByCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Get availability info for specific book
   */
  getBookAvailability(id: string): Observable<getBookAvailabilityResponse> {
    return this.http.get<getBookAvailabilityResponse>(`${this.apiUrl}/${id}/availability`);
  }

  // -------------------------
  // LIBRARIAN ENDPOINTS
  // -------------------------

  /**
   * Create new book (Librarian only)
   */
  createBook(payload: CreateBookPayload): Observable<{
    message: string;
    book: Book;
  }> {
    return this.http.post<{
      message: string;
      book: Book;
    }>(`${this.apiUrl}/create`, payload);
  }

  /**
   * Update book (Librarian only)
   */
  updateBook(id: string, payload: UpdateBookPayload): Observable<{
    message: string;
    book: Book;
  }> {
    return this.http.put<{
      message: string;
      book: Book;
    }>(`${this.apiUrl}/${id}/update`, payload);
  }

  /**
   * Delete book (Librarian only)
   */
  deleteBook(id: string): Observable<{
    message: string;
    book: Book;
  }> {
    return this.http.delete<{
      message: string;
      book: Book;
    }>(`${this.apiUrl}/${id}/delete`);
  }
}
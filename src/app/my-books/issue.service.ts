import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Issue,
  BorrowResponse,
  ReturnResponse,
  RenewResponse
} from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private readonly apiUrl = 'http://localhost:3001/api/issues';

  constructor(private http: HttpClient) {}

  // -------------------------
  // BORROW
  // -------------------------

  /**
   * Borrow a book
   * Librarians may optionally pass userId
   */
  borrowBook(bookId: number, userId?: number): Observable<BorrowResponse> {
    if (!userId || !bookId) {
      throw new Error('Both bookId and userId are required to borrow a book');
    }

    const payload = { bookId, userId };

    return this.http.post<BorrowResponse>(this.apiUrl, payload);
  }

  // -------------------------
  // GET ISSUES
  // -------------------------

  /**
   * Get issues list
   * - Librarian → all issues
   * - User → own issues
   */
  getAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl);
  }

  /**
   * Get single issue by ID
   */
  getIssueById(issueId: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${issueId}`);
  }

  /**
   * Get active issues for a specific user
   * Get all active (non-returned) issues for a specific user. Users can only view their own; librarians can view anyone's.
   */
  getUserActiveIssues(userId: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  /**
   * Librarian: Get issue history for a book
   */
  getIssuesByBook(bookId: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(
      `${this.apiUrl}/book/${bookId}`
    );
  }

  /**
   * Librarian: Get all overdue issues
   */
  getAllOverdueIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(
      `${this.apiUrl}/overdue/all`
    );
  }

  // -------------------------
  // RETURN BOOK
  // -------------------------

  returnBook(issueId: number): Observable<ReturnResponse> {
    return this.http.put<ReturnResponse>(
      `${this.apiUrl}/${issueId}/return`,
      {}
    );
  }

  // -------------------------
  // RENEW BOOK
  // -------------------------

  renewBook(issueId: number): Observable<RenewResponse> {
    return this.http.put<RenewResponse>(
      `${this.apiUrl}/${issueId}/renew`,
      {}
    );
  }
}
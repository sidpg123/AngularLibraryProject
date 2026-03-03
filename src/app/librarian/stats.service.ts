import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardStats,
  BooksStats,
  UserStats,
  IssueStats,
  OverdueReport,
  PopularReport
} from '../models/stats-service.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private readonly apiUrl = 'http://localhost:3001/api/stats';

  constructor(private http: HttpClient) {}

  // -----------------------------
  // DASHBOARD
  // -----------------------------

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/dashboard`
    );
  }

  // -----------------------------
  // BOOKS STATS
  // -----------------------------

  getBooksStats(): Observable<BooksStats> {
    return this.http.get<BooksStats>(
      `${this.apiUrl}/books`
    );
  }

  // -----------------------------
  // USER STATS
  // -----------------------------

  getUsersStats(): Observable<UserStats> {
    return this.http.get<UserStats>(
      `${this.apiUrl}/users`
    );
  }

  // -----------------------------
  // ISSUE STATS
  // -----------------------------

  getIssuesStats(): Observable<IssueStats> {
    return this.http.get<IssueStats>(
      `${this.apiUrl}/issues`
    );
  }

  // -----------------------------
  // OVERDUE REPORT
  // -----------------------------

  getOverdueReport(): Observable<OverdueReport> {
    return this.http.get<OverdueReport>(
      `${this.apiUrl}/reports/overdue`
    );
  }

  // -----------------------------
  // POPULAR BOOKS REPORT
  // -----------------------------

  getPopularReport(): Observable<PopularReport> {
    return this.http.get<PopularReport>(
      `${this.apiUrl}/reports/popular`
    );
  }
}
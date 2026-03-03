import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserFineSummary,
  PayFineResponse,
  PayAllFinesResponse,
  FineCalculationPreview,
  FineReport
} from '../models/fine.model';

@Injectable({
  providedIn: 'root'
})
export class FineService {

  private readonly apiUrl = 'http://localhost:3001/api/fines';

  constructor(private http: HttpClient) {}

  // -----------------------------
  // USER FINE SUMMARY
  // -----------------------------

  getUserFineSummary(userId: number): Observable<UserFineSummary> {
    return this.http.get<UserFineSummary>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  // -----------------------------
  // PAY SINGLE FINE
  // -----------------------------

  payFine(issueId: number): Observable<PayFineResponse> {
    return this.http.post<PayFineResponse>(
      `${this.apiUrl}/${issueId}/pay`,
      {}
    );
  }

  // -----------------------------
  // PAY ALL FINES FOR USER
  // -----------------------------

  payAllFines(userId: number): Observable<PayAllFinesResponse> {
    return this.http.post<PayAllFinesResponse>(
      `${this.apiUrl}/user/${userId}/pay-all`,
      {}
    );
  }

  // -----------------------------
  // PREVIEW FINE CALCULATION
  // -----------------------------

  calculateFine(issueId: number): Observable<FineCalculationPreview> {
    return this.http.get<FineCalculationPreview>(
      `${this.apiUrl}/calculate/${issueId}`
    );
  } 

  // -----------------------------
  // LIBRARIAN REPORT
  // -----------------------------

  getFinesReport(): Observable<FineReport> {
    return this.http.get<FineReport>(
      `${this.apiUrl}/report`
    );
  }
}
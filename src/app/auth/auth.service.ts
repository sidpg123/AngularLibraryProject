import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthResponse, RegisterPayload, VerifyTokenResponse } from '../models/auth-service.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3001/api';
  private readonly TOKEN_KEY = 'auth_token';

  // We initialize with 'undefined' or a null, but we'll fetch the real user immediately
  private userSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.autoAuthenticate();
  }

  /**
   * On app load, check if we have a token and verify it with the server
   */
  private autoAuthenticate() {
    if (this.isLoggedIn()) {
      this.verifyToken().subscribe({
        
        next: (res) => {
          console.log("Token verified successfully:", res);
          this.userSubject.next(res.user)
        },
        error: (err) => {
          console.error("Token verification failed:", err);
          this.logout();
        }
      });
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
      tap(res => this.setSession(res))
    );
  }

  private setSession(res: AuthResponse) {
    console.log('auth response:', res);
    if (res?.token) {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      this.userSubject.next(res.user);
    }
  }

  // --- Helpers ---

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
  return this.userSubject.value;
}

  /**
   * Returns an observable so components can react to role changes.
   */
  get isLibrarian$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user?.role === 'librarian')
    );
  }

  // Synchronous check if needed for Guards
  getIsLibrarian(): boolean {
    return this.userSubject.value?.role === 'librarian';
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userSubject.next(null);
  }

  verifyToken(): Observable<VerifyTokenResponse> {
    console.log("Verifying token...")
    const res =  this.http.get<VerifyTokenResponse>(`${this.apiUrl}/auth/verify`);
    console.log("Verify token response:", res);
    return res;
  }
}
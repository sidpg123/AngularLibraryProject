import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Issue } from '../../models/issue.model';
// import { User } from '../models/user.model';
// import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:3001/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, payload: any) {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deactivateUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUserIssues(id: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/${id}/issues`);
  }

  getUserStats(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/stats`);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserFormComponent } from '../librarian/manage-users/user-form/user-form.component';
import { LoadingSpinnerComponent } from '../shared/loading.component';
import { User } from '../models/user.model';
import { UserService } from '../librarian/manage-users/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, UserFormComponent, LoadingSpinnerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user?: User;
  stats: any;

  isLoading    = false;
  errorMessage = '';
  showEditModal = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Could not determine current user.';
      return;
    }
    this.loadProfile(currentUser.id);
  }

  loadProfile(id: number): void {
    this.isLoading = true;
    
    this.authService.profile().subscribe({
      next: (res) => {
             this.user = res;
        this.isLoading = false;
        // this.loadStats(id)
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load profile.';
        this.isLoading = false;
      }
    });
  }

  // loadStats(id: number): void {
  //   this.userService.getUserStats(id).subscribe({
  //     next: (res) => { this.stats = res; },
  //     error: () => {}   // stats are decorative; silently ignore
  //   });
  // }

  openEdit():  void { this.showEditModal = true; }
  closeEdit(): void { this.showEditModal = false; }

  onSaved(): void {
    this.closeEdit();
    this.loadProfile(this.user!.id);
  }
}
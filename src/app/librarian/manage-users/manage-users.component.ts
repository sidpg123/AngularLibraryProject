import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from './user.service';
import { LoadingSpinnerComponent } from '../../shared/loading.component';
import { ConfirmDialogService } from '../../shared/confirm/confirm-dialog-host/confirm-dialogue.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'       // ← added
})
export class ManageUsersComponent implements OnInit {

  users: User[] = [];
  isLoading    = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => { this.users = res; this.isLoading = false; },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/librarian/manage-users', id]);
  }

  toggleActivation(user: User): void {

  if (user.isActive) {

    this.confirm
      .open(
        'Deactivate User',
        'Are you sure you want to deactivate this user?'
      )
      .subscribe(result => {

        if (!result) return;

        this.userService
          .deactivateUser(user.id)
          .subscribe(() => this.loadUsers());

      });

  } else {

    this.userService
      .updateUser(user.id, { isActive: true })
      .subscribe(() => this.loadUsers());

  }

}
}
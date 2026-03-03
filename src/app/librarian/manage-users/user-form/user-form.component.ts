import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { UserService } from '../user.service';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  @Input() user!: User;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formData: any = {};
  errorMessage = '';
  isLoading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.user) {
      // Clone to avoid mutating original object
      this.formData = { ...this.user };
    }
  }

  submit(): void {

    if (!this.formData.fullName || !this.formData.email) {
      this.errorMessage = 'Full name and email are required';
      return;
    }

    this.isLoading = true;

    const payload = {
      fullName: this.formData.fullName,
      email: this.formData.email,
      phone: this.formData.phone,
      address: this.formData.address,
      role: this.formData.role,
      isActive: this.formData.isActive,
      maxBooksAllowed: this.formData.maxBooksAllowed
    };

    this.userService.updateUser(this.user.id, payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.saved.emit();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Update failed';
        this.isLoading = false;
      }
    });
  }
}
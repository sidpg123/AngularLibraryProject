import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username = '';
  password = '';
  email    = '';
  fullName = '';
  phone    = '';
  address  = '';
  errMsg   = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  register(): void {
    this.errMsg = '';

    this.authService.register({
      username: this.username,
      email:    this.email,
      fullName: this.fullName,
      phone:    this.phone,
      address:  this.address,
      password: this.password
    }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/books';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.errMsg = err?.error?.error || 'Registration failed. Please try again.';
      }
    });
  }
}
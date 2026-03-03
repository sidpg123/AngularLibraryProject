import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  errMsg = '';
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  login(): void {

    if (!this.username || !this.password) {
      this.errMsg = 'Username and password are required';
      return;
    }

    this.authService.login(this.username, this.password)
      .subscribe({
        next: () => {

          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') || '/books';
          console.log('Login successful, redirecting to:', returnUrl);
          // if()
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: HttpErrorResponse) => {
          
          this.errMsg = err?.error?.error || 'Login failed';
          alert(this.errMsg);
        }
      });
  }
}
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  fullName = '';
  phone = '';
  address = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  register(): void {
    if (!this.username || !this.password || !this.email || !this.fullName) {
      alert('Please fill in all required fields');
      return;
    }

    this.authService.register({
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      phone: this.phone,
      address: this.address,
      password: this.password
    }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/books';

        this.router.navigateByUrl(returnUrl);
      },
      error(err) {
        const errMsg = err?.error?.error || 'Login failed';
        alert(errMsg);
      },

    })
  }
}

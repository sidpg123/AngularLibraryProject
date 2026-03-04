import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from './models/user.model';
import { ConfirmDialogHostComponent } from "./shared/confirm/confirm-dialog-host/confirm-dialog-host.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogHostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  currentUser$: Observable<User | null>;
  isSidebarOpen = false;
  isDark        = false;
  isLanding     = false;   // hides sidebar on /

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;

    // Detect landing route
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isLanding = e.urlAfterRedirects === '/' || e.urlAfterRedirects === '';
        // Close sidebar when navigating
        this.isSidebarOpen = false;
      });

    // Initial check (before first NavigationEnd fires)
    const url = this.router.url;
    this.isLanding = url === '/' || url === '';

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') { this.enableDark(); }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleSidebar(): void  { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void   { this.isSidebarOpen = false; }

  toggleTheme(): void    { this.isDark ? this.disableDark() : this.enableDark(); }

  enableDark(): void {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    this.isDark = true;
  }

  disableDark(): void {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    this.isDark = false;
  }
}
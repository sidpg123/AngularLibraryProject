import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
// import { UserService } from '../../users/user.service';
// import { User } from '../../models/user.model';
// import { Issue } from '../../models/issue.model';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Issue } from '../../../models/issue.model';
import { UserService } from '../user.service';
import { UserFormComponent } from "../user-form/user-form.component";
import { LoadingSpinnerComponent } from "../../../shared/loading.component";

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent, LoadingSpinnerComponent],
  templateUrl: './user-details.component.html'
})
export class UserDetailComponent implements OnInit {

  user?: User;
  issues: Issue[] = [];
  stats: any;

  isLoading = false;
  errorMessage = '';

  showEditModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadUser(Number(id));
  }

  loadUser(id: number): void {
    this.isLoading = true;

    this.userService.getUserById(id).subscribe({
      next: (res) => {
        this.user = res;
        this.loadStats(id);
        this.loadIssues(id);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error;
        this.isLoading = false;
      }
    });
  }

  loadStats(id: number): void {
    this.userService.getUserStats(id).subscribe({
      next: (res) => this.stats = res
    });
  }

  loadIssues(id: number): void {
    this.userService.getUserIssues(id).subscribe({
      next: (res) => this.issues = res
    });
  }

  toggleActivation(): void {
    if (!this.user) return;

    if (this.user.isActive) {
      const confirmDeactivate = confirm('Deactivate this user?');
      if (!confirmDeactivate) return;

      this.userService.deactivateUser(this.user.id).subscribe(() => {
        this.loadUser(this.user!.id);
      });
    } else {
      this.userService.updateUser(this.user.id, { isActive: true }).subscribe(() => {
        this.loadUser(this.user!.id);
      });
    }
  }

  openEdit(): void {
    this.showEditModal = true;
  }

  closeEdit(): void {
    this.showEditModal = false;
  }

  onUserUpdated(): void {
    this.loadUser(this.user!.id);
    this.closeEdit();
  }

  goBack(): void {
    this.router.navigate(['/librarian/manage-users']);
  }
}
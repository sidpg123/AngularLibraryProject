import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IssueService } from './issue.service';
import { Issue } from '../models/issue.model';
import { IssueCardComponent } from './issueCard/issue-card.component';
import { AuthService } from '../auth/auth.service';
import { FineService } from './fine.service';
import { FineCalculationPreview, UserFineSummary } from '../models/fine.model';
import { LoadingSpinnerComponent } from '../shared/loading.component';
import { IssueCountPipe } from '../shared/issue-count.pipe';
import { ConfirmDialogService } from '../shared/confirm/confirm-dialog-host/confirm-dialogue.service';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule, IssueCardComponent, LoadingSpinnerComponent, IssueCountPipe],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.css'
})
export class MyBooksComponent implements OnInit {

  issues: Issue[] = [];
  filteredIssues: Issue[] = [];

  fineSummary?: UserFineSummary;
  fineLoading  = false;
  fineError    = '';
  calculatedFines: { [issueId: number]: FineCalculationPreview } = {};
  selectedStatus: 'all' | 'issued' | 'overdue' | 'returned' = 'all';

  isLoading    = false;
  errorMessage = '';

  constructor(
    private issueService: IssueService,
    private router: Router,
    private authService: AuthService,
    private fineService: FineService,
    private confirm: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadIssues();
    this.loadFineSummary();
  }

  loadIssues(): void {
    this.isLoading = true;
    this.issueService.getAllIssues().subscribe({
      next: (res) => {
        this.issues = res;
        this.applyFilter();
        this.loadCalculatedFines();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load issues';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredIssues = this.selectedStatus === 'all'
      ? this.issues
      : this.issues.filter(i => i.status === this.selectedStatus);
  }

  changeFilter(status: any): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  countByStatus(status: string): number {
    return this.issues.filter(i => i.status === status).length;
  }

  openDetails(issueId: number): void {
    this.router.navigate(['/my-books', issueId]);
  }

  loadFineSummary(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.fineLoading = true;
    this.fineService.getUserFineSummary(user.id).subscribe({
      next: (res) => { this.fineSummary = res; this.fineLoading = false; },
      error: (err) => { this.fineError = err?.error?.error || 'Failed to load fines'; this.fineLoading = false; }
    });
  }

 payAllFines(): void {

  const user = this.authService.getCurrentUser();
  if (!user) return;

  this.confirm
    .open(
      'Pay All Fines',
      'Are you sure you want to pay all outstanding fines?'
    )
    .subscribe(result => {

      if (!result) return;

      this.fineLoading = true;

      this.fineService.payAllFines(user.id).subscribe({
        next: () => {
          this.loadFineSummary();
          this.loadIssues();
          this.fineLoading = false;
        },
        error: (err) => {
          this.fineError = err?.error?.error;
          this.fineLoading = false;
        }
      });

    });

}

  loadCalculatedFines(): void {
    this.issues.forEach(issue => {
      this.fineService.calculateFine(issue.id).subscribe({
        next: (preview) => {
          this.calculatedFines = { ...this.calculatedFines, [issue.id]: preview };
        },
        error: () => {}
      });
    });
  }
}
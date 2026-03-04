import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CalculateFineResponse, Issue } from '../../models/issue.model';
import { IssueService } from '../issue.service';
import { FineService } from '../fine.service';
import { LoadingSpinnerComponent } from '../../shared/loading.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmDialogService } from '../../shared/confirm/confirm-dialog-host/confirm-dialogue.service';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, DatePipe],
  templateUrl: './issue-details.component.html',
  styleUrl: './issue-details.component.css'
})
export class IssueDetailComponent implements OnInit {

  issue?: Issue;
  fineDetails: CalculateFineResponse | null = null;
  isLoading = false;
  actionLoading = false;
  errorMessage = '';
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private fineService: FineService,
    private confirm: ConfirmDialogService
  ) { }

ngOnInit(): void {

  this.route.paramMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {

      const id = params.get('id');

      if (!id) {
        this.errorMessage = 'Invalid issue ID';
        return;
      }

      this.loadIssue(Number(id));

    });

}

  loadIssue(issueId: number): void {
    this.isLoading = true;
    this.issueService.getIssueById(issueId).subscribe({
      next: (res) => {
        this.issue = res;
        this.isLoading = false;
        this.calculateFine();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load issue';
        this.isLoading = false;
      }
    });
  }

  calculateFine(): void {
    if (!this.issue) return;
    this.fineService.calculateFine(this.issue.id).subscribe({
      next: (preview) => { this.fineDetails = preview; },
      error: (err) => { this.errorMessage = err?.error?.error || 'Failed to calculate fine'; }
    });
  }

  renew(): void {
    if (!this.issue) return;
    this.actionLoading = true;
    this.issueService.renewBook(this.issue.id).subscribe({
      next: () => { this.loadIssue(this.issue!.id); this.actionLoading = false; },
      error: (err) => { this.errorMessage = err?.error?.error; this.actionLoading = false; }
    });
  }

  returnBook(): void {
    if (!this.issue) return;
    this.actionLoading = true;
    this.issueService.returnBook(this.issue.id).subscribe({
      next: () => { this.loadIssue(this.issue!.id); this.actionLoading = false; },
      error: (err) => { this.errorMessage = err?.error?.error; this.actionLoading = false; }
    });
  }

  payAndReturn(): void {
    if (!this.issue) return;
    this.actionLoading = true;

    this.issueService.returnBook(this.issue.id).pipe(

      switchMap(res => {

        const hasFine = res?.hasFine;
        const fineAmount = res?.fine;

        if (!hasFine || fineAmount <= 0) {
          return of(null);
        }

        return this.confirm
          .open(
            'Outstanding Fine',
            `This book has a fine of $${fineAmount}. Would you like to pay it now?`
          )
          .pipe(

            switchMap(result => {
              if (!result) return of(null);
              return this.fineService.payFine(this.issue!.id);
            })

          );

      })

    ).subscribe({

      next: () => {
        this.loadIssue(this.issue!.id);
        this.actionLoading = false;
      },

      error: (err) => {
        this.errorMessage = err?.error?.error;
        this.actionLoading = false;
      }

    });
  }

  get renewalsRemaining(): number {
    if (!this.issue) return 0;
    return this.issue.maxRenewals - this.issue.renewalCount;
  }
}
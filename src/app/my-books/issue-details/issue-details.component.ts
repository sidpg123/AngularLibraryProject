import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CalculateFineResponse, Issue } from '../../models/issue.model';
import { IssueService } from '../issue.service';
import { FineService } from '../fine.service';
import { LoadingSpinnerComponent } from "../../shared/loading.component";
// import { IssueService } from './issue.service';
// import { Issue } from '../models/issue.model';
@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './issue-details.component.html'
})
export class IssueDetailComponent implements OnInit {

  issue?: Issue;
  fineDetails: CalculateFineResponse | null = null;
  isLoading = false;
  actionLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService,
    private fineService: FineService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Invalid issue ID';
      return;
    }
    this.loadIssue(Number(id));
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

  calculateFine() {
    if (!this.issue) return;

    this.fineService.calculateFine(this.issue.id).subscribe({
      next: (preview) => {
        console.log('Fine preview:', preview);
        this.fineDetails = preview;
        // this.issue!.fineAmount = preview.calculatedFine;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to calculate fine';
      }
    });
  }

  renew(): void {
    if (!this.issue) return;

    this.actionLoading = true;

    this.issueService.renewBook(this.issue.id).subscribe({
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

  returnBook(): void {
    if (!this.issue) return;

    this.actionLoading = true;

    this.issueService.returnBook(this.issue.id).subscribe({
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

  payAndReturn(): void {
    if (!this.issue) return;

    this.actionLoading = true;

    // Step 1: Return book first
    this.issueService.returnBook(this.issue.id).subscribe({
      next: (res) => {

        // Backend gives fine info
        const hasFine = res?.hasFine;
        const fineAmount = res?.fine;

        if (!hasFine || fineAmount <= 0) {
          // No fine → just reload
          this.loadIssue(this.issue!.id);
          this.actionLoading = false;
          return;
        }

        // Step 2: Ask for payment confirmation
        const confirmPayment = confirm(
          `Fine amount: $${fineAmount}. Do you want to pay now?`
        );

        if (!confirmPayment) {
          // Book is already returned but fine unpaid
          this.loadIssue(this.issue!.id);
          this.actionLoading = false;
          return;
        }

        // Step 3: Pay fine
        this.fineService.payFine(this.issue!.id).subscribe({
          next: () => {
            this.loadIssue(this.issue!.id);
            this.actionLoading = false;
          },
          error: (err) => {
            this.errorMessage = err?.error?.error;
            this.actionLoading = false;
          }
        });

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
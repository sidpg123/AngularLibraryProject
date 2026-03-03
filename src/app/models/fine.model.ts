export interface FineIssueSummary {
  issueId: number;
  bookTitle: string;
  fineAmount: number;
  finePaid: boolean;
}

export interface UserFineSummary {
  totalFines: number;
  paidFines: number;
  unpaidFines: number;
  unpaidIssuesCount: number;
  issuesWithFines: FineIssueSummary[];
}

export interface PayFineResponse {
  message: string;
  amountPaid: number;
  remainingFines: number;
}

export interface PayAllFinesResponse {
  message: string;
  amountPaid: number;
  issuesPaid: number;
  remainingFines: number;
}

export interface FineCalculationPreview {
  issueId: number;
  dueDate: string;
  gracePeriodDays: number;
  overdueDays: number;
  finePerDay: number;
  calculatedFine: number;
  maxFinePerBook: number;
  isOverdue: boolean;
  status: 'issued' | 'overdue' | 'returned';
}

export interface FineReportSummary {
  totalUnpaidFines: number;
  totalPaidFines: number;
  usersWithUnpaidFines: number;
  totalUsersWithFines: number;
}

export interface FineReportUser {
  userId: number;
  username: string;
  fullName: string;
  unpaidFines: number;
  paidFines: number;
  unpaidIssuesCount: number;
}

export interface FineReport {
  summary: FineReportSummary;
  users: FineReportUser[];
}
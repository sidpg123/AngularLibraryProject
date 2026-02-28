export interface Issue {
  id:           number;
  bookId:       number;
  userId:       number;
  issueDate:    string;                    // ISO 8601
  dueDate:      string;                    // ISO 8601
  returnDate:   string | null;
  status:       'issued' | 'overdue' | 'returned';   // NOT 'active'
  renewalCount: number;                    // note: renewalCount, not renewCount
  maxRenewals:  number;                    // always 2
  fineAmount:   number;                    // note: fineAmount, not fine
  finePaid:     boolean;
  issuedBy:     string;                    // username of who issued
  returnedTo:   string | null;
  book?: {                                  // populated when using GET /api/issues
    id:     number;
    title:  string;
    isbn:   string;
  };
  user?: {                                  // populated for librarian-facing responses
    id:       number;
    username: string;
    fullName: string;
  };
}

// Helper — compute these client-side, they are NOT returned by the server
export function getDaysUntilDue(issue: Issue): number {
  const now = new Date();
  const due = new Date(issue.dueDate);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(issue: Issue): boolean {
  return issue.status === 'overdue';
}

export interface DashboardBooksStats {
  totalBooks: number;
  uniqueTitles: number;
  availableBooks: number;
  issuedBooks: number;
  utilizationRate: string;
}

export interface DashboardUsersStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersWithBooks: number;
}

export interface DashboardIssuesStats {
  totalIssued: number;
  activeIssues: number;
  overdueIssues: number;
  returnedIssues: number;
  overdueRate: string;
}

export interface DashboardFinesStats {
  totalUnpaidFines: string;
  totalPaidFines: string;
  usersWithFines: number;
}

export interface DashboardStats {
  books: DashboardBooksStats;
  users: DashboardUsersStats;
  issues: DashboardIssuesStats;
  fines: DashboardFinesStats;
}


export interface BookCategoryStats {
  count: number;
  totalCopies: number;
  available: number;
}

export interface BookSummaryStats {
  totalTitles: number;
  totalCopies: number;
  totalAvailable: number;
  totalIssued: number;
}

export interface PopularBook {
  id: number;
  title: string;
  category: string;
  timesIssued: number;
  currentlyIssued: number;
  availableCopies: number;
  totalCopies: number;
}

export interface BooksStats {
  summary: BookSummaryStats;
  byCategory: { [category: string]: BookCategoryStats };
  mostPopular: PopularBook[];
  leastPopular: PopularBook[];
}


export interface UserSummaryStats {
  totalUsers: number;
  activeUsers: number;
  usersWithBooks: number;
  usersWithFines: number;
}

export interface ActiveUser {
  id: number;
  username: string;
  totalBorrowed: number;
}

export interface UserStats {
  summary: UserSummaryStats;
  mostActiveUsers: ActiveUser[];
  usersWithOverdue: ActiveUser[];
}



export interface UserSummaryStats {
  totalUsers: number;
  activeUsers: number;
  usersWithBooks: number;
  usersWithFines: number;
}

export interface ActiveUser {
  id: number;
  username: string;
  totalBorrowed: number;
}

export interface UserStats {
  summary: UserSummaryStats;
  mostActiveUsers: ActiveUser[];
  usersWithOverdue: ActiveUser[];
}


export interface IssueSummaryStats {
  totalIssues: number;
  activeIssues: number;
  overdueIssues: number;
  returnedIssues: number;
  overdueRate: string;
  averageDurationDays: string;
}

export interface IssueStats {
  summary: IssueSummaryStats;
  byStatus: { [status: string]: number };
  byMonth: { [month: string]: number };
}


export interface PopularReport {
  mostPopular: PopularBook[];
  leastPopular: PopularBook[];
}

export interface OverdueIssue {
  issueId: number;
  book: {
    id: number;
    title: string;
    isbn: string;
  };
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
  };
  issueDate: string;
  dueDate: string;
  daysOverdue: number;
  currentFine: number;
  finePaid: boolean;
}

export interface OverdueReport {
  summary: {
    totalOverdue: number;
    totalFinesAccrued: string;
    unpaidFinesCount: number;
  };
  overdueIssues: OverdueIssue[];
}
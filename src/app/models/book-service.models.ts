export interface getBookAvailabilityResponse {
    bookId: number;
    title: string;
    totalCopies: number;
    availableCopies: number;
    issuedCopies: number;
    isAvailable: boolean;
    currentlyBorrowedBy: number;
}


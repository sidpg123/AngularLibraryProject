import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/books.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-card.component.html'
})
export class BookCardComponent {

  @Input() book!: Book;

  @Output() viewDetails = new EventEmitter<number>();
  @Output() issueBook = new EventEmitter<number>();

  constructor(private authService: AuthService) {}

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onDetailsClick(): void {
    this.viewDetails.emit(this.book.id);
  }

  onIssueClick(): void {
    this.issueBook.emit(this.book.id);
  }
  
}

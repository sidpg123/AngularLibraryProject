import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../../models/books.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-detail.component.html'
})
export class BookDetailComponent implements OnInit {

  book?: Book;
  errorMessage = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Invalid book ID';
      return;
    }

    this.isLoading = true;

    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Book not found';
        this.isLoading = false;
      }
    });
  }
}
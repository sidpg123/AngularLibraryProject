import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../../models/books.model';
import { BookService } from '../../../books/book.service';
import { LoadingSpinnerComponent } from "../../../shared/loading.component";
// import { BookService } from '../../books/book.service';
// import { Book } from '../../models/books.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './book-details.component.html'
})
export class BookDetailComponent implements OnInit {

  book?: Book;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadBook(Number(id));
  }

  loadBook(id: number): void {
    this.isLoading = true;

    this.bookService.getBookById(id.toString()).subscribe({
      next: (res) => {
        this.book = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/librarian/manage-books']);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../../models/books.model';
import { BookService } from '../../../books/book.service';
import { LoadingSpinnerComponent } from '../../../shared/loading.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, DecimalPipe, DatePipe],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailComponent implements OnInit {

  book?: Book;
  isLoading = false;
  errorMessage = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {

        const id = params.get('id');

        if (!id) return;

        this.loadBook(Number(id));

      });

  }

  loadBook(id: number): void {
    this.isLoading = true;
    this.bookService.getBookById(id.toString()).subscribe({
      next: (res) => {
        this.book = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load book.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/librarian/manage-books']);
  }
} 
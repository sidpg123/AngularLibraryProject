import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../../models/books.model';
import { BookService } from '../../../books/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'          
})
export class BookFormComponent implements OnInit, OnChanges {

  @Input() book: Book | null = null;
  @Output() saved     = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  bookForm!: FormGroup;
  isEditMode   = false;
  errorMessage = '';
  isLoading    = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book'] && this.bookForm) {
      if (this.book) {
        this.isEditMode = true;
        this.bookForm.patchValue(this.book);
      } else {
        this.isEditMode = false;
        this.bookForm.reset({ totalCopies: 1 });
      }
    }
  }

  initializeForm(): void {
    this.bookForm = this.fb.group({
      title:         ['', Validators.required],
      body:          ['', Validators.required],
      isbn:          [''],
      category:      [''],
      publishedYear: [''],
      totalCopies:   [1, [Validators.min(1)]]
    });

    if (this.book) {
      this.isEditMode = true;
      this.bookForm.patchValue(this.book);
    }
  }

  submit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isLoading    = true;
    this.errorMessage = '';
    const payload     = this.bookForm.value;

    if (this.isEditMode && this.book) {
      this.bookService.updateBook(String(this.book.id), payload).subscribe({
        next:  () => { this.isLoading = false; this.saved.emit(); },
        error: (err) => {
          this.errorMessage = err?.error?.error || 'Update failed';
          this.isLoading = false;
        }
      });
    } else {
      this.bookService.createBook(payload).subscribe({
        next:  () => { this.isLoading = false; this.saved.emit(); },
        error: (err) => {
          this.errorMessage = err?.error?.error || 'Creation failed';
          this.isLoading = false;
        }
      });
    }
  }
}
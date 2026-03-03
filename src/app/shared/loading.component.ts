import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex; justify-content:center; padding:20px;">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .spinner {
      width: 30px;
      height: 30px;
      border: 4px solid #ddd;
      border-top: 4px solid #3f51b5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {}